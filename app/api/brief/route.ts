// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

function mustString(v: any) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = mustString(body.order_id);
    const business_name = mustString(body.business_name);
    const business_type = mustString(body.business_type);
    const target_audience = mustString(body.target_audience);
    const colors = mustString(body.colors);
    const style = mustString(body.style);

    const competitors = mustString(body.competitors);
    const content_ready = mustString(body.content_ready);
    const notes = mustString(body.notes);
    const market = mustString(body.market);

    const pages = Array.isArray(body.pages) ? body.pages.map((x: any) => mustString(x)) : [];
    const features = Array.isArray(body.features)
      ? body.features.map((x: any) => mustString(x))
      : [];

    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    // Campos obligatorios del brief:
    if (!business_name || !business_type || !target_audience || !colors || !style || !content_ready) {
      return NextResponse.json(
        { ok: false, error: "Missing required brief fields" },
        { status: 400 }
      );
    }

    const created_at = new Date().toISOString();

    // 🔧 IMPORTANTE:
    // Asegúrate de que tu sheet "briefs" tenga estas columnas en este orden (o ajusta el orden aquí).
    // created_at | order_id | business_name | business_type | target_audience | colors | pages | features | competitors | style | content_ready | notes | market
    await appendRow("briefs", [
      created_at,
      order_id,
      business_name,
      business_type,
      target_audience,
      colors,
      pages.join(","),      // guardado como texto CSV en sheets
      features.join(","),
      competitors,
      style,
      content_ready,
      notes,
      market,
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
