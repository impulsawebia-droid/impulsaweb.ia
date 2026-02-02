// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    console.error(`[v0] Missing required environment variable: ${name}`);
    throw new Error(`Configuracion incompleta: falta ${name}`);
  }
  return v;
}

function nowISO() {
  return new Date().toISOString();
}

function generateOrderId() {
  // ejemplo: IW-2502-ABCDE (cámbialo si quieres)
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `IW-${yy}${mm}-${rand}`;
}

async function getSheetsClient() {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyRaw = requiredEnv("GOOGLE_PRIVATE_KEY");

  // ✅ clave: convertir \n a saltos reales
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId };
}

export async function POST(req: Request) {
  console.log("[v0] POST /api/orders - Starting");
  
  try {
    const body = await req.json();
    console.log("[v0] Request body received:", JSON.stringify(body));

    const {
      plan_id,
      plan_name,
      customer_name,
      email,
      phone,
      city = "",
      pay_method,
      pay_type = "total",
      amount,
      notes = "",
    } = body ?? {};

    // Validaciones básicas
    if (!plan_id || !plan_name) {
      return NextResponse.json(
        { ok: false, error: "plan_id y plan_name son requeridos" },
        { status: 400 }
      );
    }
    if (!customer_name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "customer_name, email y phone son requeridos" },
        { status: 400 }
      );
    }
    if (!pay_method) {
      return NextResponse.json(
        { ok: false, error: "pay_method es requerido" },
        { status: 400 }
      );
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { ok: false, error: "amount debe ser un número válido" },
        { status: 400 }
      );
    }

    const order_id = generateOrderId();
    const created_at = nowISO();

    // status recomendado
    const status = "pending_payment";
    const payment_status = "unconfirmed";

    console.log("[v0] Getting Google Sheets client...");
    const { sheets, spreadsheetId } = await getSheetsClient();
    console.log("[v0] Connected to spreadsheet:", spreadsheetId);

    // La pestana debe llamarse EXACTAMENTE "orders"
    const range = "orders!A:O";

    const row = [
      created_at,            // A created_at
      order_id,              // B order_id
      plan_id,               // C plan_id
      plan_name,             // D plan_name
      customer_name,         // E customer_name
      phone,                 // F phone
      email,                 // G email
      city,                  // H city
      pay_method,            // I pay_method
      pay_type,              // J pay_type
      numericAmount,         // K amount
      payment_status,        // L payment_status
      "",                    // M proof_url
      notes,                 // N notes
      status,                // O status
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({
      ok: true,
      order_id,
    });
  } catch (err: any) {
    console.error("POST /api/orders failed:", err?.message || err, err?.stack);

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
