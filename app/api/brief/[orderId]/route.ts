// app/api/brief/[orderId]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { findRowByColumn } from "@/lib/googleSheets";

export async function GET(_req: Request, { params }: { params: { orderId: string } }) {
  try {
    const orderId = String(params.orderId || "").trim();
    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    }

    const found = await findRowByColumn("briefs", "order_id", orderId, "A:Z");

    if (!found.row) {
      return NextResponse.json({ ok: true, exists: false, brief: null });
    }

    const obj: any = {};
    found.headers.forEach((h: any, i: number) => {
      obj[String(h).trim()] = found.row?.[i] ?? "";
    });

    return NextResponse.json({ ok: true, exists: true, brief: obj });
  } catch (err: any) {
    console.error("GET /api/brief/[orderId] error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
