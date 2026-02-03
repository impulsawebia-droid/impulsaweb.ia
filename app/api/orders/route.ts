import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getSheetValues } from "@/lib/googleSheets"; // 👈 si tu helper lo tiene

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const order_id = searchParams.get("order_id");

    const values = await getSheetValues("orders", "A:Z");
    if (!values || values.length < 2) return NextResponse.json({ ok: true, orders: [] });

    const headers = values[0].map((h: any) => String(h).trim());
    const rows = values.slice(1);

    const idxOrderId = headers.indexOf("order_id");
    const idxEmail = headers.indexOf("email");

    const filtered = rows
      .map((r: any[]) => {
        const obj: any = {};
        headers.forEach((h: string, i: number) => (obj[h] = r?.[i] ?? ""));
        return obj;
      })
      .filter((o: any) => {
        if (order_id) return String(o.order_id || "").toLowerCase() === order_id.toLowerCase();
        if (email) return String(o.email || "").toLowerCase() === email.toLowerCase();
        return true;
      });

    return NextResponse.json({ ok: true, orders: filtered });
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
