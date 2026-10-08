import { NextResponse } from "next/server";
import { INDIAN_BOARDS_REGISTRY } from "@/lib/data/multi-board-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classFilter = searchParams.get("class");
  const jurisdiction = searchParams.get("jurisdiction");

  let boards = INDIAN_BOARDS_REGISTRY;

  if (classFilter) {
    const classNum = parseInt(classFilter, 10);
    if (!isNaN(classNum)) {
      boards = boards.filter((b) => b.supportedClasses.includes(classNum as any));
    }
  }

  if (jurisdiction) {
    boards = boards.filter((b) => b.jurisdiction.toLowerCase() === jurisdiction.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    totalCount: boards.length,
    boards,
    timestamp: new Date().toISOString(),
  });
}
