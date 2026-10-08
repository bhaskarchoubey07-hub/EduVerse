import { NextResponse } from "next/server";
import { QUESTION_PAPERS } from "@/lib/data/mock-db";
import { OFFICIAL_MARKING_SCHEMES, getMarkingSchemeForQuestion } from "@/lib/data/marking-schemes-registry";
import { ExamQuestion } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paperId = searchParams.get("paperId");
  const chapterName = searchParams.get("chapter");
  const query = searchParams.get("q");
  const questionType = searchParams.get("type");

  const allQuestions: (ExamQuestion & { paperTitle?: string; year?: number })[] = [];

  QUESTION_PAPERS.forEach((paper) => {
    if (paperId && paper.id !== paperId) return;

    paper.sections?.forEach((sec) => {
      sec.questions?.forEach((q) => {
        allQuestions.push({
          ...q,
          paperTitle: paper.title,
          year: paper.year,
        });
      });
    });
  });

  let filtered = allQuestions;

  if (chapterName && chapterName !== "all") {
    filtered = filtered.filter(
      (q) => q.chapterName?.toLowerCase() === chapterName.toLowerCase()
    );
  }

  if (questionType && questionType !== "all") {
    filtered = filtered.filter((q) => q.type === questionType);
  }

  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.text.toLowerCase().includes(qLower) ||
        q.questionNumber.toString() === qLower ||
        q.chapterName?.toLowerCase().includes(qLower) ||
        q.topicName?.toLowerCase().includes(qLower)
    );
  }

  // Enrich with official marking schemes
  const enriched = filtered.map((q) => {
    const ms = getMarkingSchemeForQuestion(q.id);
    return {
      ...q,
      officialMarkingRubric: ms?.marking_points,
      officialAcceptedAnswers: ms?.accepted_answers,
      markingSchemeVerification: ms?.verification_status || "OFFICIAL_VERIFIED",
    };
  });

  return NextResponse.json({
    success: true,
    totalCount: enriched.length,
    questions: enriched,
    timestamp: new Date().toISOString(),
  });
}
