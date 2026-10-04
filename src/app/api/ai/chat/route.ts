import { NextRequest, NextResponse } from "next/server";
import { AIRateLimiter, AITutorMode } from "@/lib/ai";
import { ProductionRAGEngine, RAGExecutionResult } from "@/lib/ai/rag/rag-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      query,
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

    const userMessage = (message || query || "").trim();

    // 1. Validation & sanitization
    if (!userMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (userMessage.length > 2500) {
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

    // 3. Execute Production RAG
    const ragResult: RAGExecutionResult = await ProductionRAGEngine.executeRAG(
      userMessage,
      {
        board,
        classLevel: Number(classLevel) || 10,
        subject,
        chapter,
        topic,
        current3DObject,
      },
      mode as AITutorMode,
      history
    );

    await AIRateLimiter.incrementUsage(userId);

    return NextResponse.json({
      reply: ragResult.content,
      suggestedFollowUps: ragResult.suggestedFollowUps,
      detectedSubject: ragResult.detectedSubject,
      matchedChapter: ragResult.matchedChapter,
      confidence: ragResult.confidence,
      isTopicSwitched: ragResult.isTopicSwitched,
      topicSwitchReason: ragResult.topicSwitchReason,
      is3DGrounded: ragResult.is3DGrounded,
      grounded3DPartName: ragResult.grounded3DPartName,
      providerName: ragResult.providerName,
      modelUsed: ragResult.modelUsed,
      verificationAudit: ragResult.verificationAudit,
      provenance: ragResult.provenance,
      dailyLimit: rateStatus.dailyLimit,
      remainingToday: Math.max(0, rateStatus.remainingToday - 1),
    });
  } catch (err: any) {
    console.error("AI Chat Route Error:", err);
    return NextResponse.json(
      {
        error: "AI Tutor is temporarily unavailable. Please try again shortly.",
        reply: "AI Tutor is temporarily unavailable. Please check your connection or try again shortly.",
      },
      { status: 500 }
    );
  }
}
