import { NextResponse } from "next/server";
import { QUESTION_PAPERS, CHAPTERS, SUBJECTS } from "@/lib/data/mock-db";
import { STORED_SOURCE_DOCUMENTS } from "@/lib/data/documents-registry";
import { ANATOMICAL_STRUCTURES, CELL_ORGANELLES } from "@/lib/data/biology-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const board = searchParams.get("board")?.toLowerCase();
  const classLevel = searchParams.get("class");
  const verifiedOnly = searchParams.get("verifiedOnly") !== "false"; // Default true per Section 23

  if (!query) {
    return NextResponse.json({
      success: true,
      query: "",
      totalResults: 0,
      results: {
        books: [],
        papers: [],
        questions: [],
        chapters: [],
        models3D: [],
      },
    });
  }

  // 1. Search Books
  let books = STORED_SOURCE_DOCUMENTS.filter((b) => {
    if (verifiedOnly && b.verificationStatus !== "OFFICIAL_VERIFIED") return false;
    if (board && board !== "all" && b.board.toLowerCase() !== board) return false;
    if (classLevel && b.classLevel.toString() !== classLevel) return false;
    return (
      b.title.toLowerCase().includes(query) ||
      b.subject.toLowerCase().includes(query) ||
      b.sourceAuthority.toLowerCase().includes(query) ||
      b.licenseNotes.toLowerCase().includes(query)
    );
  });

  // 2. Search Papers
  let papers = QUESTION_PAPERS.filter((p) => {
    if (verifiedOnly && !["OFFICIAL_VERIFIED", "EXTRACTION_INCOMPLETE"].includes(p.contentStatus || "")) return false;
    if (board && board !== "all" && p.boardId.toLowerCase() !== board) return false;
    if (classLevel && p.classLevel.toString() !== classLevel) return false;
    return (
      p.title.toLowerCase().includes(query) ||
      p.paperCode?.toLowerCase().includes(query) ||
      p.year.toString() === query
    );
  });

  // 3. Search Questions
  const matchingQuestions: any[] = [];
  QUESTION_PAPERS.forEach((paper) => {
    if (verifiedOnly && !["OFFICIAL_VERIFIED", "EXTRACTION_INCOMPLETE"].includes(paper.contentStatus || "")) return;
    if (board && board !== "all" && paper.boardId.toLowerCase() !== board) return;
    if (classLevel && paper.classLevel.toString() !== classLevel) return;

    paper.sections?.forEach((sec) => {
      sec.questions?.forEach((q) => {
        if (
          q.text.toLowerCase().includes(query) ||
          q.chapterName?.toLowerCase().includes(query) ||
          q.topicName?.toLowerCase().includes(query) ||
          q.officialAnswer?.toLowerCase().includes(query)
        ) {
          matchingQuestions.push({
            ...q,
            paperTitle: paper.title,
            paperYear: paper.year,
            boardId: paper.boardId,
          });
        }
      });
    });
  });

  // 4. Search Chapters
  let chapters = CHAPTERS.filter((ch) => {
    return (
      ch.title.toLowerCase().includes(query) ||
      ch.description.toLowerCase().includes(query) ||
      ch.topics.some((t) => t.title.toLowerCase().includes(query))
    );
  });

  // 5. Search 3D Models
  const all3DModels = [...ANATOMICAL_STRUCTURES, ...CELL_ORGANELLES];
  let models3D = all3DModels.filter((item: any) => {
    return (
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.functionSummary?.toLowerCase().includes(query)
    );
  });

  const totalResults =
    books.length + papers.length + matchingQuestions.length + chapters.length + models3D.length;

  return NextResponse.json({
    success: true,
    query,
    filters: {
      board: board || "all",
      classLevel: classLevel || "all",
      verifiedOnly,
    },
    totalResults,
    results: {
      books,
      papers,
      questions: matchingQuestions,
      chapters,
      models3D,
    },
    timestamp: new Date().toISOString(),
  });
}
