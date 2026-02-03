// app/api/orders/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getGoogleAuth() {
  const client_email = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");

  let private_key = requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").trim();

  // Quita comillas accidentales
  if (
    (private_key.startsWith('"') && private_key.endsWith('"')) ||
    (private_key.startsWith("'") && private_key.endsWith("'"))
  ) {
    private_key = private_key.slice(1, -1);
  }

  // Convierte \n literales a saltos reales
  private_key = private_key.replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function appendRow(sheetName: string, values: (string | number)[]) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const auth = getGoogleAuth();

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });
}

function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IW-${yy}${mm}-${rand}`;
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
    const status = "pending_payment";

    // ✅ Orden de columnas sugerido (debe coincidir con tu sheet):
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
