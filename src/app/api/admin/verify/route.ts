import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, targetStatus, reviewerNotes } = body;

    if (!documentId || !targetStatus) {
      return NextResponse.json(
        { success: false, error: "Missing documentId or targetStatus" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "UNVERIFIED",
      "IMPORTING",
      "EXTRACTION_REVIEW",
      "AI_PROCESSED",
      "ADMIN_REVIEW",
      "VERIFIED",
      "PUBLISHED",
      "EXTRACTION_INCOMPLETE",
      "ARCHIVED",
      "REJECTED",
    ];

    if (!validStatuses.includes(targetStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Document ${documentId} status updated to ${targetStatus}`,
      documentId,
      newStatus: targetStatus,
      reviewerNotes: reviewerNotes || "Status verified by Administrator",
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
