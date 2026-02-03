// app/api/brief/[orderId]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";

function findIndex(headers: any[], name: string) {
  return headers.findIndex((h) => String(h).trim() === name);
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "Missing orderId" },
        { status: 400 }
      );
    }

    const values = await getSheetValues("briefs", "A:Z");

    if (values.length < 2) {
      return NextResponse.json({ ok: true, brief: null });
    }

    const headers = values[0];
    const rows = values.slice(1);

    const idxOrder = findIndex(headers, "order_id");
    if (idxOrder === -1) {
      return NextResponse.json(
        { ok: false, error: "briefs sheet missing column: order_id" },
        { status: 500 }
      );
    }

    const row = rows.find((r) => String(r?.[idxOrder] || "") === orderId);

    if (!row) {
      return NextResponse.json({ ok: true, brief: null });
    }

    // Convertimos la fila a objeto con headers
    const obj: any = {};
    headers.forEach((h: any, i: number) => (obj[String(h).trim()] = row[i]));

    return NextResponse.json({ ok: true, brief: obj });
  } catch (err: any) {
    console.error("GET /api/brief/[orderId] error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
