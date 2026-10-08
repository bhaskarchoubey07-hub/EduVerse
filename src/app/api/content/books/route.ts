import { NextResponse } from "next/server";
import { STORED_SOURCE_DOCUMENTS } from "@/lib/data/documents-registry";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const board = searchParams.get("board");
  const classLevel = searchParams.get("class");
  const subject = searchParams.get("subject");

  // Filter book-type stored documents
  let books = STORED_SOURCE_DOCUMENTS.filter((d) => d.documentType === "book");

  if (board && board !== "all") {
    books = books.filter((b) => b.board.toLowerCase() === board.toLowerCase());
  }

  if (classLevel) {
    const lvl = parseInt(classLevel, 10);
    if (!isNaN(lvl)) {
      books = books.filter((b) => b.classLevel === lvl);
    }
  }

  if (subject && subject !== "all") {
    books = books.filter((b) => b.subject.toLowerCase() === subject.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    totalCount: books.length,
    books,
    timestamp: new Date().toISOString(),
  });
}
