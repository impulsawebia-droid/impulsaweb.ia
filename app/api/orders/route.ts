// app/api/orders/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { appendRow, getSheetValues } from "@/lib/googleSheets";

function nowISO() {
  return new Date().toISOString();
}

function genOrderId() {
  // ejemplo: IW-2602-ABCD
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IW-${yy}${mm}-${rand}`;
}

function headerIndex(headers: any[], name: string) {
  return headers.findIndex((h) => String(h || "").trim() === name);
}

function normalize(v: any) {
  return String(v ?? "").trim().toLowerCase();
}

// ✅ GET /api/orders?email= o ?order_id=
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const orderId = url.searchParams.get("order_id");

    const values = await getSheetValues("orders", "A:Z");
    if (!values || values.length < 2) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const headers = values[0];
    const rows = values.slice(1);

    const idxEmail = headerIndex(headers, "email");
    const idxOrder = headerIndex(headers, "order_id");

    if (idxEmail === -1 || idxOrder === -1) {
      return NextResponse.json(
        { ok: false, error: "orders sheet missing required columns" },
        { status: 500 }
      );
    }

    let filtered = rows;

    if (orderId) {
      const target = normalize(orderId);
      filtered = rows.filter((r) => normalize(r?.[idxOrder]) === target);
    } else if (email) {
      const target = normalize(email);
      filtered = rows.filter((r) => normalize(r?.[idxEmail]) === target);
    } else {
      // por defecto no devolvemos todo
      filtered = [];
    }

    // map a objeto por headers
    const orders = filtered.map((row) => {
      const obj: any = {};
      headers.forEach((h: any, i: number) => {
        obj[String(h).trim()] = row?.[i] ?? "";
      });
      return obj;
    });

    return NextResponse.json({ ok: true, orders });
  } catch (err: any) {
    console.error("GET /api/orders error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/orders (crea una orden)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const plan_id = String(body.plan_id || body.planId || "").trim();
    const plan_name = String(body.plan_name || body.planName || "").trim();

    const customer_name = String(body.customer_name || body.customerName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const city = String(body.city || "").trim();

    const pay_method = String(body.pay_method || body.paymentMethod || "nequi").trim();
    const pay_type = String(body.pay_type || body.payType || "").trim();
    const amount = Number(body.amount || body.totalPrice || 0);

    if (!plan_id || !plan_name || !email) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (plan_id, plan_name, email)" },
        { status: 400 }
      );
    }

    const order_id = genOrderId();

    // OJO: payment_status es la columna correcta (según tu resumen)
    const row = [
      nowISO(),          // created_at
      order_id,          // order_id
      plan_id,           // plan_id
      plan_name,         // plan_name
      customer_name,     // customer_name
      phone,             // phone
      email,             // email
      city,              // city
      pay_method,        // pay_method
      pay_type,          // pay_type
      amount,            // amount
      "pending_payment", // payment_status
      "",                // proof_url
    ];

    await appendRow("orders", row);

    return NextResponse.json({
      ok: true,
      order: {
        created_at: row[0],
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
        payment_status: "pending_payment",
        proof_url: "",
      },
    });
  } catch (err: any) {
    console.error("POST /api/orders error:", err?.message || err, err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
