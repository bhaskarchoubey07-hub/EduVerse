import { NextRequest, NextResponse } from "next/server";
import { EXPANDED_CHAPTERS_REGISTRY } from "@/lib/data/curriculum-registry";
import { CBSE_10_SCIENCE_PAPERS_ARCHIVE, CBSE_10_SCIENCE_QUESTIONS_SAMPLE } from "@/lib/data/cbse-10-science-pilot";
import { ANATOMICAL_STRUCTURES, CELL_ORGANELLES } from "@/lib/data/biology-data";
import { INDIAN_BOARDS_REGISTRY } from "@/lib/data/multi-board-registry";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const board = (searchParams.get("board") || "").toLowerCase().trim();
    const classLevel = searchParams.get("class") ? Number(searchParams.get("class")) : undefined;
    const subject = (searchParams.get("subject") || "").toLowerCase().trim();
    const contentType = (searchParams.get("type") || "all").toLowerCase().trim();

    if (!query && !board && !subject && !classLevel) {
      return NextResponse.json({
        totalResults: 0,
        results: [],
        query: "",
      });
    }

    const results: any[] = [];

    // 1. Search Chapters & Topics
    if (contentType === "all" || contentType === "chapters" || contentType === "syllabus") {
      for (const chapter of EXPANDED_CHAPTERS_REGISTRY) {
        if (board && chapter.boardCode.toLowerCase() !== board) continue;
        if (classLevel && chapter.classLevel !== classLevel) continue;
        if (subject && !chapter.subjectId.toLowerCase().includes(subject)) continue;

        const matchesTitle = query && chapter.title.toLowerCase().includes(query);
        const matchesOverview = query && chapter.overview.toLowerCase().includes(query);
        const matchedTopic = chapter.topics?.find((t) => !query || t.title.toLowerCase().includes(query));

        if (!query || matchesTitle || matchesOverview || matchedTopic) {
          results.push({
            id: chapter.id,
            type: "chapter",
            title: chapter.title,
            snippet: matchedTopic ? `Topic: ${matchedTopic.title}` : chapter.overview.slice(0, 140) + "...",
            metadata: {
              board: chapter.boardCode.toUpperCase(),
              classLevel: chapter.classLevel,
              subject: chapter.subjectId,
              marksWeightage: chapter.marksWeightage,
              route: `/notes/${chapter.id}`,
            },
          });
        }
      }
    }

    // 2. Search Verified Question Papers & Past Papers (Phase 11)
    if (contentType === "all" || contentType === "papers" || contentType === "pyq") {
      for (const paper of CBSE_10_SCIENCE_PAPERS_ARCHIVE) {
        if (board && paper.boardCode.toLowerCase() !== board) continue;
        if (classLevel && paper.classLevel !== classLevel) continue;

        const matchesTitle = !query || paper.title.toLowerCase().includes(query) || paper.paperCode.toLowerCase().includes(query);
        if (matchesTitle) {
          results.push({
            id: paper.paperId,
            type: "question_paper",
            title: paper.title,
            snippet: `Official ${paper.boardCode.toUpperCase()} Class ${paper.classLevel} Examination (${paper.year}) • Paper Code: ${paper.paperCode}`,
            metadata: {
              board: paper.boardCode.toUpperCase(),
              classLevel: paper.classLevel,
              year: paper.year,
              totalMarks: paper.totalMarks,
              durationMinutes: paper.durationMinutes,
              route: `/papers`,
            },
          });
        }
      }

      // Search individual PYQs
      for (const q of CBSE_10_SCIENCE_QUESTIONS_SAMPLE) {
        if (board && q.boardCode.toLowerCase() !== board) continue;
        if (classLevel && q.classLevel !== classLevel) continue;

        const matchesQ = !query || q.questionText.toLowerCase().includes(query);
        if (matchesQ) {
          results.push({
            id: q.id,
            type: "pyq_item",
            title: `[${q.year} Board Exam - ${q.marks}M] Question ${q.questionNumber}`,
            snippet: q.questionText.slice(0, 160) + "...",
            metadata: {
              board: q.boardCode.toUpperCase(),
              classLevel: q.classLevel,
              year: q.year,
              marks: q.marks,
              questionType: q.questionType,
              hasVerifiedAnswerKey: q.isOfficialAnswerVerified,
              route: `/papers`,
            },
          });
        }
      }
    }

    // 3. Search 3D Interactive Models & Organs (Phase 28 & 29)
    if (contentType === "all" || contentType === "3d" || contentType === "biology") {
      for (const structure of ANATOMICAL_STRUCTURES) {
        if (!query || structure.name.toLowerCase().includes(query) || structure.function.toLowerCase().includes(query)) {
          results.push({
            id: structure.id,
            type: "3d_anatomical_model",
            title: structure.name,
            snippet: structure.function.slice(0, 140) + "...",
            metadata: {
              system: structure.system,
              category: structure.category,
              meshName: structure.meshName,
              route: `/learn/biology`,
            },
          });
        }
      }

      for (const organelle of CELL_ORGANELLES) {
        if (!query || organelle.name.toLowerCase().includes(query) || organelle.function.toLowerCase().includes(query)) {
          results.push({
            id: organelle.id,
            type: "3d_cell_organelle",
            title: organelle.name,
            snippet: organelle.function.slice(0, 140) + "...",
            metadata: {
              cellType: organelle.cellType,
              analogy: organelle.analogy,
              route: `/learn/biology`,
            },
          });
        }
      }
    }

    // 4. Search Boards Registry
    if (contentType === "all" || contentType === "boards") {
      for (const b of INDIAN_BOARDS_REGISTRY) {
        if (!query || b.fullName.toLowerCase().includes(query) || b.code.toLowerCase().includes(query) || (b.stateName && b.stateName.toLowerCase().includes(query))) {
          results.push({
            id: b.boardId,
            type: "board_registry",
            title: `${b.shortName} (${b.fullName})`,
            snippet: b.classStructureNotes,
            metadata: {
              jurisdiction: b.jurisdiction,
              supportedClasses: b.supportedClasses,
              officialPortal: b.officialUrls.portal,
              route: `/syllabus`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      totalResults: results.length,
      query,
      filters: { board, classLevel, subject, contentType },
      results: results.slice(0, 40),
    });
  } catch (error) {
    console.error("Global education search error:", error);
    return NextResponse.json({ error: "Failed to perform education search" }, { status: 500 });
  }
}
