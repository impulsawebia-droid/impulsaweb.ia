// app/api/brief/route.ts
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
    requestBody: { values: [values] },
  });
}

async function findBriefByOrderId(orderId: string) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Ajusta si tu sheet no está en "briefs"
  const range = "briefs!A:Z";
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];

  if (rows.length <= 1) return null;

  // Se asume header en fila 1
  const header = rows[0];
  const orderIdIndex = header.indexOf("order_id");
  if (orderIdIndex === -1) return null;

  const found = rows.slice(1).find((r) => String(r[orderIdIndex] || "") === orderId);
  if (!found) return null;

  const obj: Record<string, any> = {};
  header.forEach((h, i) => (obj[h] = found[i] ?? ""));
  return obj;
}

// ✅ GET /api/brief?orderId=IW-XXXX
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing orderId" }, { status: 400 });
    }

    const brief = await findBriefByOrderId(orderId);
    return NextResponse.json({ ok: true, brief });
  } catch (err: any) {
    console.error("GET /api/brief error:", err?.message || err);
    return NextResponse.json({ ok: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}

// ✅ POST /api/brief
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const created_at = new Date().toISOString();
    const order_id = String(body.order_id || "");
    const business_name = String(body.business_name || "");
    const business_type = String(body.business_type || "");
    const target_audience = String(body.target_audience || "");
    const colors = String(body.colors || "");
    const pages = Array.isArray(body.pages) ? body.pages.join(",") : String(body.pages || "");
    const features = Array.isArray(body.features) ? body.features.join(",") : String(body.features || "");
    const competitors = String(body.competitors || "");
    const style = String(body.style || "");
    const content = String(body.content || "");
    const additional_notes = String(body.additional_notes || "");

    if (!order_id) {
      return NextResponse.json({ ok: false, error: "Missing order_id" }, { status: 400 });
    }

    // Guarda en sheet "briefs"
    // created_at | order_id | business_name | business_type | target_audience | colors | pages | features | competitors | style | content | additional_notes
    await appendRow("briefs", [
      created_at,
      order_id,
      business_name,
      business_type,
      target_audience,
      colors,
      pages,
      features,
      competitors,
      style,
      content,
      additional_notes,
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("POST /api/brief error:", err?.message || err, err);
    return NextResponse.json({ ok: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}
