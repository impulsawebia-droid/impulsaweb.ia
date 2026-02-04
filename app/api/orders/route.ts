// app/api/orders/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow, getSheetValues } from "@/lib/googleSheets";

function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IW-${yy}${mm}-${rand}`;
}

function toObj(headers: string[], row: any[]) {
  const obj: any = {};
  headers.forEach((h, i) => (obj[h] = row?.[i] ?? ""));
  return obj;
}

function normalizeHeaders(values: any[][]) {
  const headers = (values?.[0] || []).map((h: any) => String(h).trim());
  const rows = (values || []).slice(1);
  return { headers, rows };
}

function computeStatus(obj: any) {
  // prioridad: status
  const rawStatus = String(obj.status || "").trim();
  if (rawStatus) return rawStatus;

  // fallback: payment_status
  const ps = String(obj.payment_status || "").trim().toLowerCase();
  if (ps === "paid") return "paid";
  if (ps === "completed") return "completed";

  return "pending_payment";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const order_id = searchParams.get("order_id");

    const values = await getSheetValues("orders", "A:Z");
    if (!values || values.length < 2) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const { headers, rows } = normalizeHeaders(values);

    const results = rows
      .map((r) => {
        const obj = toObj(headers, r);

        // ✅ asegúrate que siempre salga status
        obj.status = computeStatus(obj);

        return obj;
      })
      .filter((o) => {
        if (order_id)
          return String(o.order_id || "").toLowerCase() === order_id.toLowerCase();
        if (email)
          return String(o.email || "").toLowerCase() === email.toLowerCase();
        return true;
      });

    return NextResponse.json({ ok: true, orders: results });
  } catch (err: any) {
    console.error("GET /api/orders error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const plan_id = String(body.plan_id || "");
    const plan_name = String(body.plan_name || "");
    const customer_name = String(body.customer_name || "");
    const email = String(body.email || "");
    const phone = String(body.phone || "");
    const city = String(body.city || "");
    const pay_method = String(body.pay_method || "");
    const pay_type = String(body.pay_type || "total");
    const amount = Number(body.amount || 0);
    const notes = String(body.notes || "");

    if (!plan_id || !plan_name || !customer_name || !email || !phone || !pay_method || !amount) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order_id = generateOrderId();
    const created_at = new Date().toISOString();

    // ✅ status de la app (usa estos valores)
    const status = "pending_payment";

    // IMPORTANTE:
    // Debe coincidir con el ORDEN de columnas de tu sheet.
    // Si tu sheet usa otro orden, ajusta aquí.
    await appendRow("orders", [
      created_at,
      order_id,
      plan_id,
      plan_name,
      customer_name,
      phone,
      email,
      city,
      pay_method,
      pay_type,
      amount,
      "",        // payment_status (si lo tienes)
      "",        // proof_url (si lo tienes)
      status,    // status (recomendado)
      notes,
    ]);

    return NextResponse.json({ ok: true, order_id });
  } catch (err: any) {
    console.error("POST /api/orders error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
