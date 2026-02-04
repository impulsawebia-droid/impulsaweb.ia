// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = String(body.order_id || "").trim();
    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    const created_at = new Date().toISOString();

    const business_name = String(body.business_name || "").trim();
    const business_type = String(body.business_type || "").trim();
    const target_audience = String(body.target_audience || "").trim();
    const competitors = String(body.competitors || "").trim();

    const colors = String(body.colors || "").trim();
    const style = String(body.style || "").trim();

    const pages = Array.isArray(body.pages) ? body.pages.map(String) : [];
    const features = Array.isArray(body.features) ? body.features.map(String) : [];

    const has_content = String(body.has_content || "").trim();
    const notes = String(body.notes || "").trim();

    // Validación mínima
    if (!business_name || !business_type || !target_audience || !colors || !style || pages.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Brief incomplete: missing required fields" },
        { status: 400 }
      );
    }

    // Orden de columnas recomendado en Sheet "briefs":
    // created_at | order_id | business_name | business_type | target_audience | colors | pages | features | competitors | style | has_content | notes
    await appendRow("briefs", [
      created_at,
      order_id,
      business_name,
      business_type,
      target_audience,
      colors,
      pages.join(","),     // guardamos como string
      features.join(","),  // guardamos como string
      competitors,
      style,
      has_content,
      notes,
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
