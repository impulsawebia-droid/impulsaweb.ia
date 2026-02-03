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

type OrderRow = {
  created_at: string;
  order_id: string;
  plan_id: string;
  plan_name: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  pay_method: string;
  pay_type: string;
  amount: number;
  status: string;
  notes: string;
};

function rowToOrder(headers: string[], row: any[]): OrderRow {
  const obj: any = {};
  headers.forEach((h, i) => (obj[h] = row?.[i] ?? ""));
  return {
    created_at: String(obj.created_at || ""),
    order_id: String(obj.order_id || ""),
    plan_id: String(obj.plan_id || ""),
    plan_name: String(obj.plan_name || ""),
    customer_name: String(obj.customer_name || ""),
    email: String(obj.email || ""),
    phone: String(obj.phone || ""),
    city: String(obj.city || ""),
    pay_method: String(obj.pay_method || ""),
    pay_type: String(obj.pay_type || ""),
    amount: Number(obj.amount || 0),
    status: String(obj.status || ""),
    notes: String(obj.notes || ""),
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get("email") || "").trim().toLowerCase();
    const order_id = (url.searchParams.get("order_id") || "").trim();

    const values = await getSheetValues("orders", "A:Z");
    if (values.length < 2) {
      return NextResponse.json({ ok: true, orders: [] });
    }

    const headers = values[0].map((h) => String(h).trim());
    const rows = values.slice(1);

    let orders = rows
      .map((r) => rowToOrder(headers, r))
      .filter((o) => o.order_id);

    if (email) {
      orders = orders.filter((o) => (o.email || "").toLowerCase() === email);
    }

    if (order_id) {
      orders = orders.filter((o) => o.order_id === order_id);
    }

    // opcional: ordenar por fecha desc
    orders.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    return NextResponse.json({ ok: true, orders });
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

    if (
      !plan_id ||
      !plan_name ||
      !customer_name ||
      !email ||
      !phone ||
      !pay_method ||
      !amount
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order_id = generateOrderId();
    const created_at = new Date().toISOString();
    const status = "pending_payment";

    // created_at | order_id | plan_id | plan_name | customer_name | email | phone | city | pay_method | pay_type | amount | status | notes
    await appendRow("orders", [
      created_at,
      order_id,
      plan_id,
      plan_name,
      customer_name,
      email,
      phone,
      city,
      pay_method,
      pay_type,
      amount,
      status,
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
