import { NextResponse } from "next/server";
import { ImportJobRecord } from "@/types/content-engine";

// In-memory import jobs store
let importJobs: ImportJobRecord[] = [
  {
    id: "job-cbse-10-sci-2025-import",
    source_id: "src-cbse-pyq-archive",
    job_type: "document_ingestion",
    board: "cbse",
    class: 10,
    subject: "science",
    year: 2025,
    status: "processing",
    progress: 68,
    documents_found: 3,
    documents_processed: 2,
    documents_failed: 0,
    questions_extracted: 5,
    started_at: "2026-03-24T09:30:00Z",
    error_log: [
      "Page 1-3 extracted: 3 objective MCQs verified against marking key.",
      "Page 4-5 extracted: Question 21 Short Answer verified.",
      "Page 7-9 extracted: Question 34 Long Answer verified.",
      "Pages 10-14 in OCR review queue for chemical reaction subscripts.",
    ],
  },
  {
    id: "job-cbse-10-math-2024-import",
    source_id: "src-cbse-pyq-archive",
    job_type: "document_ingestion",
    board: "cbse",
    class: 10,
    subject: "mathematics",
    year: 2024,
    status: "validating",
    progress: 45,
    documents_found: 2,
    documents_processed: 1,
    documents_failed: 0,
    questions_extracted: 2,
    started_at: "2026-03-23T14:15:00Z",
    error_log: [
      "Set 30/2/1 ingested.",
      "Questions 1-2 verified with marking rubrics.",
      "Questions 3-20 awaiting equation typesetting verification.",
    ],
  },
  {
    id: "job-ncert-rationalized-10-sci",
    source_id: "src-ncert-textbooks",
    job_type: "syllabus_import",
    board: "cbse",
    class: 10,
    subject: "science",
    year: 2025,
    status: "completed",
    progress: 100,
    documents_found: 13,
    documents_processed: 13,
    documents_failed: 0,
    questions_extracted: 168,
    started_at: "2026-03-20T08:00:00Z",
    completed_at: "2026-03-20T08:45:00Z",
    error_log: ["All 13 rationalized chapters successfully ingested with topic bookmarks."],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalCount: importJobs.length,
    jobs: importJobs,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.board || !body.subject || !body.class) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters (board, subject, class)" },
        { status: 400 }
      );
    }

    const newJob: ImportJobRecord = {
      id: `job-${body.board}-${body.subject}-${Date.now().toString(36)}`,
      source_id: body.source_id || "src-cbse-official-portal",
      job_type: body.job_type || "document_ingestion",
      board: body.board,
      class: parseInt(body.class, 10),
      subject: body.subject,
      year: body.year ? parseInt(body.year, 10) : undefined,
      status: "queued",
      progress: 0,
      documents_found: 1,
      documents_processed: 0,
      documents_failed: 0,
      questions_extracted: 0,
      started_at: new Date().toISOString(),
      error_log: ["Job queued in background ingestion pipeline."],
    };

    importJobs.unshift(newJob);

    return NextResponse.json({
      success: true,
      message: "Ingestion job queued successfully",
      job: newJob,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
