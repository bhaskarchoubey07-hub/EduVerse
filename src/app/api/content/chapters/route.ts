import { NextResponse } from "next/server";
import { CHAPTERS } from "@/lib/data/mock-db";
import { EXPANDED_CHAPTERS_REGISTRY } from "@/lib/data/curriculum-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId");
  const query = searchParams.get("q");

  let chapters = CHAPTERS;

  if (subjectId && subjectId !== "all") {
    chapters = chapters.filter((ch) => ch.subjectId === subjectId);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    chapters = chapters.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.topics.some((t) => t.title.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    totalCount: chapters.length,
    chapters,
    detailedRegistryCount: EXPANDED_CHAPTERS_REGISTRY.length,
    timestamp: new Date().toISOString(),
  });
}
