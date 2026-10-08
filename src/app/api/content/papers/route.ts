import { NextResponse } from "next/server";
import { QUESTION_PAPERS } from "@/lib/data/mock-db";
import { calculateRealPaperAnalytics } from "@/lib/data/analytics-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");
  const classLevel = searchParams.get("class");
  const subjectId = searchParams.get("subjectId");
  const year = searchParams.get("year");
  const verifiedOnly = searchParams.get("verifiedOnly") === "true";

  let papers = QUESTION_PAPERS;

  if (boardId && boardId !== "all") {
    papers = papers.filter((p) => p.boardId === boardId);
  }

  if (classLevel) {
    const lvl = parseInt(classLevel, 10);
    if (!isNaN(lvl)) {
      papers = papers.filter((p) => p.classLevel === lvl);
    }
  }

  if (subjectId && subjectId !== "all") {
    papers = papers.filter((p) => p.subjectId === subjectId);
  }

  if (year) {
    const yr = parseInt(year, 10);
    if (!isNaN(yr)) {
      papers = papers.filter((p) => p.year === yr);
    }
  }

  if (verifiedOnly) {
    papers = papers.filter((p) => p.contentStatus === "OFFICIAL_VERIFIED" || p.contentStatus === "EXTRACTION_INCOMPLETE");
  }

  // Calculate real analytics strictly from filtered papers
  const analytics = calculateRealPaperAnalytics({
    boardId: boardId || undefined,
    classLevel: classLevel ? parseInt(classLevel, 10) : undefined,
    subjectId: subjectId || undefined,
  });

  return NextResponse.json({
    success: true,
    totalCount: papers.length,
    papers,
    analytics,
    timestamp: new Date().toISOString(),
  });
}
