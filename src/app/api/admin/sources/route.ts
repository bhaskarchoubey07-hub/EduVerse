import { NextResponse } from "next/server";
import { OFFICIAL_CONTENT_SOURCES } from "@/lib/data/source-registry";
import { ContentSourceRecord } from "@/types/content-engine";

// Memory registry for live additions in runtime
let registeredSources: ContentSourceRecord[] = [...OFFICIAL_CONTENT_SOURCES];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalCount: registeredSources.length,
    sources: registeredSources,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.board_id || !body.source_name || !body.official_url) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory fields (board_id, source_name, official_url)" },
        { status: 400 }
      );
    }

    const newSource: ContentSourceRecord = {
      id: `src-${body.board_id}-${Date.now().toString(36)}`,
      board_id: body.board_id,
      source_name: body.source_name,
      source_type: body.source_type || "official_board",
      official_url: body.official_url,
      document_url: body.document_url || body.official_url,
      source_category: body.source_category || "curriculum",
      language: body.language || "english",
      class: body.class ? parseInt(body.class, 10) : undefined,
      subject: body.subject,
      academic_year: body.academic_year || "2025-2026",
      syllabus_year: body.syllabus_year || "2025-2026",
      license_status: body.license_status || "GOVERNMENT_OPEN_DATA",
      permission_status: body.permission_status || "verified_public",
      trust_level: body.trust_level || "LEVEL_1",
      last_checked_at: new Date().toISOString(),
      checksum: `sha256-${Date.now().toString(16)}`,
      content_hash: `hash-${body.board_id}-${Date.now()}`,
      status: "active",
      notes: body.notes || "Added via Admin Source Registry API",
    };

    registeredSources.unshift(newSource);

    return NextResponse.json({
      success: true,
      message: "Official content source registered successfully",
      source: newSource,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
