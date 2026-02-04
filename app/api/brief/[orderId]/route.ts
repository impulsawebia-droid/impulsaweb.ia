// app/api/brief/[orderId]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";

function findIndex(headers: string[], name: string) {
  return headers.findIndex((h) => h.trim() === name);
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = String(params.orderId || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const values = await getSheetValues("briefs", "A:Z");
    if (!values || values.length < 2) {
      return NextResponse.json({ ok: true, brief: null });
    }

    const headers = (values[0] || []).map((h: any) => String(h).trim());
    const rows = values.slice(1);

    const idxOrder = findIndex(headers, "order_id");
    if (idxOrder === -1) {
      return NextResponse.json(
        { ok: false, error: "briefs sheet missing column: order_id" },
        { status: 500 }
      );
    }

    const row = rows.find((r) => String(r?.[idxOrder] || "").trim() === orderId);
    if (!row) return NextResponse.json({ ok: true, brief: null });

    const obj: any = {};
    headers.forEach((h: string, i: number) => (obj[h] = row?.[i] ?? ""));

    // parse pages/features si vienen como "a,b,c"
    obj.pages = String(obj.pages || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    obj.features = String(obj.features || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    return NextResponse.json({ ok: true, brief: obj });
  } catch (err: any) {
    console.error("GET /api/brief/[orderId] error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
