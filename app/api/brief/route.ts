// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = String(body.order_id || "");
    const business_name = String(body.business_name || "");
    const business_type = String(body.business_type || "");
    const target_audience = String(body.target_audience || "");
    const competitors = String(body.competitors || "");
    const colors = String(body.colors || "");
    const style = String(body.style || "");
    const pages = Array.isArray(body.pages) ? body.pages.join(",") : String(body.pages || "");
    const features = Array.isArray(body.features) ? body.features.join(",") : String(body.features || "");
    const content = String(body.content || "");
    const additional_notes = String(body.additional_notes || "");

    if (!order_id) {
      return NextResponse.json(
        { ok: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    const created_at = new Date().toISOString();

    // Asegúrate que tu sheet "briefs" tenga headers:
    // created_at | order_id | business_name | business_type | target_audience | colors | pages | features | competitors | style | content | additional_notes
    await appendRow("briefs", [
      created_at,
      order_id,
      business_name,
      business_type,
      target_audience,
      colors,
      pages,
      features,
      competitors,
      style,
      content,
      additional_notes,
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("POST /api/brief error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
