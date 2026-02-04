// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { findRowByColumn, upsertByOrderId } from "@/lib/googleSheets";
import { normalizeOrderId } from "@/lib/orderId";

function nowISO() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ normaliza SIEMPRE para guardarlo igual que orders
    const order_id = normalizeOrderId(body.order_id || body.orderId);

    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    // 1) Traer plan desde orders (source of truth)
    // OJO: este findRowByColumn compara literal; si tienes orders viejos sin guion, igual funciona
    // porque aquí ya normalizamos a IW-....
    // Si quieres hacerlo 100% robusto también para orders viejos, te lo ajusto luego.
    const orderFound = await findRowByColumn("orders", "order_id", order_id, "A:Z");

    // Si no lo encuentra, intentamos fallback: buscar con order_id original
    if (!orderFound.row) {
      const fallbackId = String(body.order_id || body.orderId || "").trim();
      const orderFound2 = await findRowByColumn("orders", "order_id", fallbackId, "A:Z");

      if (!orderFound2.row) {
        return NextResponse.json(
          { ok: false, error: "Order not found in orders sheet" },
          { status: 404 }
        );
      }

      // reasignar found
      (orderFound as any).headers = orderFound2.headers;
      (orderFound as any).row = orderFound2.row;
    }

    const headers = orderFound.headers;
    const row = orderFound.row!;

    const idxPlanId = headers.findIndex((h) => h.trim() === "plan_id");
    const idxPlanName = headers.findIndex((h) => h.trim() === "plan_name");

    const plan_id = idxPlanId >= 0 ? String(row[idxPlanId] ?? "") : "";
    const plan_name = idxPlanName >= 0 ? String(row[idxPlanName] ?? "") : "";

    // 2) Armar data para briefs (por headers)
    const data: Record<string, any> = {
      created_at: nowISO(),
      order_id,      // ✅ se guarda normalizado con guion
      plan_id,       // ✅ nuevo
      plan_name,     // ✅ nuevo

      business_name: String(body.business_name ?? ""),
      business_type: String(body.business_type ?? ""),
      target_audience: String(body.target_audience ?? ""),
      colors: String(body.colors ?? ""),

      // pages/features a string csv (como ya lo tienes)
      pages: Array.isArray(body.pages) ? body.pages.join(",") : String(body.pages ?? ""),
      features: Array.isArray(body.features) ? body.features.join(",") : String(body.features ?? ""),

      competitors: String(body.competitors ?? ""),
      style: String(body.style ?? ""),
      content: String(body.content ?? ""),
      additional_notes: String(body.additional_notes ?? ""),

      status: "submitted",
    };

    // 3) UPSERT por order_id (evita duplicados)
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
