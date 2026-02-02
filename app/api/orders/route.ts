import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSheetsClient, getSpreadsheetId } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      plan_id,
      plan_name,
      customer_name,
      phone,
      email,
      city,
      pay_method, // nequi | bancolombia
      pay_type,   // total | anticipo
      amount,
      notes,
    } = body;

    if (!plan_id || !plan_name || !customer_name || !phone || !pay_method || !pay_type || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order_id = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const created_at = new Date().toISOString();

    const payment_status = "pending";
    const status = "brief_pending";

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "orders!A:O",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          created_at,
          order_id,
          plan_id,
          plan_name,
          customer_name,
          phone,
          email || "",
          city || "",
          pay_method,
          pay_type,
          amount,
          payment_status,
          "", // proof_url
          notes || "",
          status,
        ]],
      },
    });

    return NextResponse.json({ ok: true, order_id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
