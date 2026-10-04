import { NextRequest, NextResponse } from "next/server";

export interface StudentFeedbackPayload {
  feedbackId: string;
  rating: "correct" | "incorrect" | "irrelevant";
  query: string;
  answerSnippet: string;
  subject: string;
  chapter?: string;
  board?: string;
  classLevel?: number;
  userId?: string;
  comments?: string;
  timestamp: string;
}

// In-memory or database telemetry storage
const FEEDBACK_STORE: StudentFeedbackPayload[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rating,
      query,
      answerSnippet,
      subject = "General",
      chapter,
      board = "cbse",
      classLevel = 10,
      userId = "student",
      comments,
    } = body;

    if (!rating || !["correct", "incorrect", "irrelevant"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating value." }, { status: 400 });
    }

    const item: StudentFeedbackPayload = {
      feedbackId: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      rating,
      query: (query || "").slice(0, 500),
      answerSnippet: (answerSnippet || "").slice(0, 500),
      subject,
      chapter,
      board,
      classLevel,
      userId,
      comments: comments ? String(comments).slice(0, 500) : undefined,
      timestamp: new Date().toISOString(),
    };

    FEEDBACK_STORE.push(item);
    if (FEEDBACK_STORE.length > 500) FEEDBACK_STORE.shift();

    return NextResponse.json({ success: true, feedbackId: item.feedbackId });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    totalFeedbacks: FEEDBACK_STORE.length,
    recent: FEEDBACK_STORE.slice(-20).reverse(),
    breakdown: {
      correct: FEEDBACK_STORE.filter((f) => f.rating === "correct").length,
      incorrect: FEEDBACK_STORE.filter((f) => f.rating === "incorrect").length,
      irrelevant: FEEDBACK_STORE.filter((f) => f.rating === "irrelevant").length,
    },
  });
}
