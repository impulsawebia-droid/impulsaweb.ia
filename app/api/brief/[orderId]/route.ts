// app/api/brief/[orderId]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAllRows } from "@/lib/googleSheets";

function findIndex(headers: any[], name: string) {
  return headers.findIndex((h) => String(h).trim() === name);
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    const { headers, rows } = await getAllRows("briefs");
    if (!headers.length) return NextResponse.json({ ok: true, brief: null });

    const idxOrderId = findIndex(headers, "order_id");
    if (idxOrderId === -1) {
      return NextResponse.json(
        { ok: false, error: "Sheet briefs missing header: order_id" },
        { status: 500 }
      );
    }

    const found = rows.find((r) => String(r[idxOrderId] || "") === orderId);
    if (!found) return NextResponse.json({ ok: true, brief: null });

    // construir objeto por headers
    const brief: Record<string, any> = {};
    headers.forEach((h, i) => (brief[String(h)] = found[i] ?? ""));

    return NextResponse.json({ ok: true, brief });
  } catch (err: any) {
    console.error("GET /api/brief/[orderId] error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
