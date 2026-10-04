import { NextRequest, NextResponse } from "next/server";
import { AIRateLimiter, AITutorMode } from "@/lib/ai";
import { ProductionRAGEngine, RAGExecutionResult } from "@/lib/ai/rag/rag-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      mode = "explain",
      board = "cbse",
      classLevel = 10,
      subject = "Science",
      chapter = "General",
      topic = "",
      current3DObject = "",
      language = "english",
      history = [],
      userId = "demo-student-001",
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const trimmed = message.trim();
    if (trimmed.length > 2500) {
      return NextResponse.json(
        { error: "Message exceeds 2500 character limit" },
        { status: 400 }
      );
    }

    // Rate Limiting (Phase 25 & 27)
    const rateStatus = await AIRateLimiter.checkLimit(userId);
    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          reply: `⚠️ ${rateStatus.reason}`,
          suggestedFollowUps: [
            "Review verified syllabus notes",
            "Browse 10-year question papers",
            "Try offline flashcards",
          ],
          rateLimitExceeded: true,
          remainingToday: 0,
        },
        { status: 429 }
      );
    }

    // Execute Production RAG Pipeline (Phases 15–29, 63–67)
    const ragResult: RAGExecutionResult = await ProductionRAGEngine.executeRAG(
      trimmed,
      {
        board,
        classLevel: Number(classLevel) || 10,
        subject,
        chapter,
        topic,
        current3DObject,
        language,
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
      source: ragResult.providerName,
      modelUsed: ragResult.modelUsed,
      verificationAudit: ragResult.verificationAudit,
      provenance: ragResult.provenance,
      remainingToday: Math.max(0, rateStatus.remainingToday - 1),
    });
  } catch (err: any) {
    console.error("AI Tutor Route Error:", err);
    return NextResponse.json(
      {
        error: "AI Tutor is temporarily unavailable. Please try again shortly.",
        reply: "AI Tutor is temporarily unavailable. Please check your connection or try again in a few moments.",
      },
      { status: 500 }
    );
  }
}
