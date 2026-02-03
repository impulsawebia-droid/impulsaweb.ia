// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";

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
    const orderId = searchParams.get("order_id");

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
