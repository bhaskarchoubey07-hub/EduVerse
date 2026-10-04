import { NextRequest, NextResponse } from "next/server";
import { getAIProvider, AIRateLimiter, AITutorMode } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      mode = "explain",
      board = "cbse",
      classLevel = 10,
      subject = "Science",
      chapter = "",
      topic = "",
      current3DObject = "",
      history = [],
      userId = "anonymous-student",
    } = body;

    // 1. Validation & sanitization
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const trimmedQuery = message.trim();
    if (trimmedQuery.length === 0) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    if (trimmedQuery.length > 2500) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 2500 characters." },
        { status: 400 }
      );
    }

    // 2. Daily Rate Limiting Check (Section 25 & 27)
    const rateStatus = await AIRateLimiter.checkLimit(userId);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          error: rateStatus.reason,
          reply: `⚠️ ${rateStatus.reason}`,
          suggestedFollowUps: [
            "Review verified syllabus notes",
            "Browse 10-year question papers",
            "Try offline flashcards",
          ],
          rateLimitExceeded: true,
          dailyLimit: rateStatus.dailyLimit,
          remainingToday: 0,
        },
        { status: 429 }
      );
    }

    // 3. Select AI Provider & Generate response
    const provider = getAIProvider();

    const aiResponse = await provider.generateExplanation({
      query: trimmedQuery,
      mode: mode as AITutorMode,
      context: {
        board,
        classLevel: Number(classLevel) || 10,
        subject,
        chapter,
        topic,
        current3DObject,
      },
      history,
    });

    // 4. Increment usage count
    await AIRateLimiter.incrementUsage(userId);

    return NextResponse.json({
      reply: aiResponse.content,
      suggestedFollowUps: aiResponse.suggestedFollowUps,
      provider: aiResponse.providerName,
      modelUsed: aiResponse.modelUsed,
      remainingToday: Math.max(0, rateStatus.remainingToday - 1),
      dailyLimit: rateStatus.dailyLimit,
      isGroundedInVerifiedContent: aiResponse.isGroundedInVerifiedContent,
      generatedAt: aiResponse.generatedAt,
    });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      {
        error: "AI Tutor is temporarily unavailable. Please try again shortly.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
