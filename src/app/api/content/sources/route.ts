import { NextResponse } from "next/server";
import { OFFICIAL_CONTENT_SOURCES, getContentSourcesByBoard, getContentSourcesByTrustLevel } from "@/lib/data/source-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");
  const trustLevel = searchParams.get("trustLevel");
  const category = searchParams.get("category");

  let sources = OFFICIAL_CONTENT_SOURCES;

  if (boardId && boardId !== "all") {
    sources = getContentSourcesByBoard(boardId);
  }

  if (trustLevel && trustLevel !== "all") {
    sources = getContentSourcesByTrustLevel(trustLevel);
  }

  if (category && category !== "all") {
    sources = sources.filter((s) => s.source_category === category);
  }

  return NextResponse.json({
    success: true,
    totalCount: sources.length,
    sources,
    timestamp: new Date().toISOString(),
  });
}
