// app/api/brief/[orderId]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";
import { orderIdKey } from "@/lib/orderId";

export async function GET(_req: Request, { params }: { params: { orderId: string } }) {
  try {
    const orderId = String(params.orderId || "").trim();
    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    }

    const values = await getSheetValues("briefs", "A1:Z");
    if (!values || values.length < 2) {
      return NextResponse.json({ ok: true, exists: false, brief: null });
    }

    const headers = values[0].map((h: any) => String(h).trim());
    const rows = values.slice(1);

    const idxOrder = headers.findIndex((h) => h === "order_id");
    if (idxOrder === -1) {
      return NextResponse.json(
        { ok: false, error: "briefs sheet missing column: order_id" },
        { status: 500 }
      );
    }

    const target = orderIdKey(orderId);

    const row = rows.find((r) => orderIdKey(r?.[idxOrder]) === target);

    if (!row) {
      return NextResponse.json({ ok: true, exists: false, brief: null });
    }

    const obj: any = {};
    headers.forEach((h: any, i: number) => {
      obj[h] = row?.[i] ?? "";
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
