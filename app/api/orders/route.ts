// app/api/orders/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizePrivateKey(raw: string) {
  let key = raw.trim();

  // Quitar comillas accidentales al inicio/fin
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Convertir \n literales a saltos reales
  key = key.replace(/\\n/g, "\n");

  // Si parece base64 (no contiene BEGIN pero sí es largo), intentar decodificar
  const looksLikeBase64 =
    !key.includes("BEGIN PRIVATE KEY") &&
    /^[A-Za-z0-9+/=\\s]+$/.test(key) &&
    key.length > 200;

  if (looksLikeBase64) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY")) {
        key = decoded;
      }
    } catch {
      // si falla, seguimos con el valor original
    }
  }

  // Validación básica
  if (!key.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "Invalid GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY format. It must include 'BEGIN PRIVATE KEY'."
    );
  }

  return key;
}

function getGoogleAuth() {
  // Opción 1: credenciales por variables separadas
  const client_email = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const private_key_raw = requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const private_key = normalizePrivateKey(private_key_raw);

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
    requestBody: { values: [values] },
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

    const plan_id = String(body.plan_id || "").trim();
    const plan_name = String(body.plan_name || "").trim();
    const customer_name = String(body.customer_name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const city = String(body.city || "").trim();
    const pay_method = String(body.pay_method || "").trim();
    const pay_type = String(body.pay_type || "total").trim();
    const amount = Number(body.amount || 0);
    const notes = String(body.notes || "").trim();

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
