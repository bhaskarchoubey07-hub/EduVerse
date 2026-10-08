import { NextResponse } from "next/server";
import { SUBJECTS } from "@/lib/data/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");
  const classFilter = searchParams.get("class");

  let subjects = SUBJECTS;

  if (boardId && boardId !== "all") {
    subjects = subjects.filter((s) => s.boardId === boardId || s.boardId === "cbse");
  }

  if (classFilter) {
    const classNum = parseInt(classFilter, 10);
    if (!isNaN(classNum)) {
      subjects = subjects.filter((s) => s.classLevel === classNum);
    }
  }

  return NextResponse.json({
    success: true,
    totalCount: subjects.length,
    subjects,
    timestamp: new Date().toISOString(),
  });
}
