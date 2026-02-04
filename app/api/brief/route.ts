// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { findRowByColumn, upsertByOrderId } from "@/lib/googleSheets";

function nowISO() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = String(body.order_id || body.orderId || "").trim();
    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    // 1) Traer plan desde orders (source of truth)
    const orderFind = await findRowByColumn("orders", "order_id", order_id, "A:Z");
    if (!orderFind.row) {
      return NextResponse.json(
        { ok: false, error: "Order not found in orders sheet" },
        { status: 404 }
      );
    }

    const orderHeaders = orderFind.headers;
    const orderRow = orderFind.row;

    const idxPlanId = orderHeaders.findIndex((h) => h.trim() === "plan_id");
    const idxPlanName = orderHeaders.findIndex((h) => h.trim() === "plan_name");

    const plan_id = idxPlanId >= 0 ? String(orderRow[idxPlanId] ?? "") : "";
    const plan_name = idxPlanName >= 0 ? String(orderRow[idxPlanName] ?? "") : "";

    // 2) Preparar data para briefs (por headers)
    // Asegúrate de tener estas columnas en briefs: created_at, order_id, plan_id, plan_name, etc.
    const data: Record<string, any> = {
      created_at: nowISO(),
      order_id,

      // guardar plan en briefs
      plan_id,
      plan_name,

      business_name: String(body.business_name ?? ""),
      business_type: String(body.business_type ?? ""),
      target_audience: String(body.target_audience ?? ""),
      colors: String(body.colors ?? ""),
      pages: Array.isArray(body.pages) ? body.pages.join(", ") : String(body.pages ?? ""),
      features: Array.isArray(body.features) ? body.features.join(", ") : String(body.features ?? ""),
      competitors: String(body.competitors ?? ""),
      style: String(body.style ?? ""),

      content: String(body.content ?? ""),
      additional_notes: String(body.additional_notes ?? ""),

      // Si tienes columna status (en tu screenshot aparece "submitted")
      status: "submitted",
    };

    // 3) UPSERT por order_id
    const result = await upsertByOrderId("briefs", order_id, data, "A:Z");

    return NextResponse.json({
      ok: true,
      order_id,
      plan_id,
      plan_name,
      ...result,
    });
  } catch (err: any) {
    console.error("POST /api/brief error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
