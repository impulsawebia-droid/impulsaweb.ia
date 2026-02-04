// app/api/brief/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSheetValues, upsertByOrderId, findRowByColumn } from "@/lib/googleSheets";
import { normalizeOrderId } from "@/lib/orderId";

function nowISO() {
  return new Date().toISOString();
}

/**
 * Devuelve el primer valor existente del body por una lista de keys.
 * Sirve para soportar snake_case y camelCase.
 */
function pick(body: any, keys: string[], fallback = "") {
  for (const k of keys) {
    const v = body?.[k];
    if (v !== undefined && v !== null) return v;
  }
  return fallback;
}

function toCsv(v: any) {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean).join(",");
  return String(v ?? "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1) order_id (normalizado)
    const order_id_raw = pick(body, ["order_id", "orderId"], "");
    const order_id = normalizeOrderId(order_id_raw);

    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    // 2) Leer headers reales de briefs
    const briefsValues = await getSheetValues("briefs", "A1:Z");
    if (!briefsValues || briefsValues.length < 1) {
    throw new Error("No se pudieron leer valores de la hoja briefs (vacío). Verifica spreadsheetId/permisos.");
    }

    const headers = briefsValues[0] || [];
    if (!headers.length) {
      throw new Error("La hoja briefs no tiene headers en la fila 1.");
    }

    const briefsHeaders = briefsValues[0].map((h: any) => String(h).trim());

    // 3) Traer plan_id y plan_name desde orders (source of truth)
    let plan_id = "";
    let plan_name = "";

    // Busca por order_id normalizado
    const orderFound = await findRowByColumn("orders", "order_id", order_id, "A1:Z");

    // Fallback: si hay orders viejos con formato distinto, intenta con el raw
    const orderFoundFinal = orderFound.row
      ? orderFound
      : await findRowByColumn("orders", "order_id", String(order_id_raw || "").trim(), "A1:Z");

    if (orderFoundFinal.row) {
      const oh = orderFoundFinal.headers;
      const or = orderFoundFinal.row;

      const idxPlanId = oh.findIndex((h) => h.trim() === "plan_id");
      const idxPlanName = oh.findIndex((h) => h.trim() === "plan_name");

      plan_id = idxPlanId >= 0 ? String(or[idxPlanId] ?? "") : "";
      plan_name = idxPlanName >= 0 ? String(or[idxPlanName] ?? "") : "";
    }

    // 4) Construir data con mapping robusto para los campos que te faltan
    //    NOTA: content y additional_notes deben venir del frontend;
    //    si no vienen, se guardan vacío (pero ya con este mapping deberían llegar).
    const data: Record<string, any> = {
      created_at: nowISO(),
      order_id,

      // ✅ estos 2 deben quedar SIEMPRE
      plan_id: String(plan_id ?? ""),
      plan_name: String(plan_name ?? ""),

      business_name: String(pick(body, ["business_name", "businessName"], "")),
      business_type: String(pick(body, ["business_type", "businessType"], "")),
      target_audience: String(pick(body, ["target_audience", "targetAudience"], "")),
      colors: String(pick(body, ["colors"], "")),

      pages: toCsv(pick(body, ["pages"], "")),
      features: toCsv(pick(body, ["features"], "")),

      competitors: String(pick(body, ["competitors"], "")),
      style: String(pick(body, ["style"], "")),

      // ✅ LOS QUE TE ESTÁN FALLANDO:
      content: String(pick(body, ["content", "contenido"], "")),
      additional_notes: String(
        pick(body, ["additional_notes", "additionalNotes", "notes"], "")
      ),

      status: String(pick(body, ["status"], "submitted")),
    };

    // 5) (OPCIONAL pero recomendado) Validación fuerte:
    // Si tu brief debe ser obligatorio completo, puedes exigirlos:
    // if (!data.content || !data.additional_notes) { ... }

    // 6) UPSERT usando headers: evita duplicados y respeta el orden real de la hoja
    // upsertByOrderId ya construye la fila por headers, así que no se pierden columnas nuevas.
    const result = await upsertByOrderId("briefs", order_id, data, "A1:Z");

    return NextResponse.json({
      ok: true,
      order_id,
      saved: {
        content: data.content,
        additional_notes: data.additional_notes,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
      },
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
