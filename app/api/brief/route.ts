// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow, getSheetValues } from "@/lib/googleSheets";

function toObject(headers: any[], row: any[]) {
  const obj: any = {};
  headers.forEach((h, i) => {
    obj[String(h).trim()] = row?.[i] ?? "";
  });
  return obj;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id") || searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    const values = await getSheetValues("briefs", "A:Z");
    if (!values || values.length < 2) {
      return NextResponse.json({ ok: true, brief: null });
    }

    const headers = values[0];
    const rows = values.slice(1);

    const idxOrder = headers.findIndex(
      (h: any) => String(h).trim() === "order_id"
    );

    if (idxOrder === -1) {
      return NextResponse.json(
        { ok: false, error: "briefs sheet missing column: order_id" },
        { status: 500 }
      );
    }

    const row = rows.find((r: any[]) => String(r?.[idxOrder] || "") === orderId);

    if (!row) return NextResponse.json({ ok: true, brief: null });

    return NextResponse.json({ ok: true, brief: toObject(headers, row) });
  } catch (err: any) {
    console.error("GET /api/brief error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = String(body.order_id || body.orderId || "");
    if (!order_id) {
      return NextResponse.json(
        { ok: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    // Ajusta estos campos a tu formulario real (los dejo robustos)
    const business_name = String(body.business_name || body.businessName || "");
    const business_type = String(body.business_type || body.businessType || "");
    const target_audience = String(body.target_audience || body.targetAudience || "");
    const colors = String(body.colors || "");
    const pages = Array.isArray(body.pages) ? body.pages.join(",") : String(body.pages || "");
    const features = Array.isArray(body.features) ? body.features.join(",") : String(body.features || "");
    const competitors = String(body.competitors || "");
    const style = String(body.style || "");
    const newsletter = String(body.newsletter || "");
    const mapa = String(body.mapa || "");
    const content_ready = String(body.content_ready || body.contentReady || "");
    const notes = String(body.notes || "");

    const created_at = new Date().toISOString();

    // Columnas (según tu screenshot):
    // created_at | order_id | business_name | business_type | target_audience | colors | pages | features | competitors | style
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
      newsletter,
      mapa,
      content_ready,
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
