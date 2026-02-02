import { NextResponse } from "next/server";
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function getSheetsClient() {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyRaw = requiredEnv("GOOGLE_PRIVATE_KEY");
  
  // Convertir \n literales a saltos de linea reales
  let privateKey = privateKeyRaw
    .replace(/\\n/g, "\n")
    .replace(/^["']|["']$/g, "");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, spreadsheetId };
}

function nowISO() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      businessName = "",
      businessType = "",
      targetAudience = "",
      competitors = "",
      colors = "",
      style = "",
      pages = [],
      features = [],
      content = "",
      additionalNotes = "",
    } = body ?? {};

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "orderId es requerido" },
        { status: 400 }
      );
    }

    const submitted_at = nowISO();

    const { sheets, spreadsheetId } = await getSheetsClient();

    // ⚠️ La pestaña debe llamarse EXACTAMENTE "briefs"
    const range = "briefs!A:N";

    const row = [
      submitted_at,                  // A
      orderId,                       // B
      businessName,                  // C
      businessType,                  // D
      targetAudience,                // E
      competitors,                   // F
      colors,                        // G
      style,                         // H
      Array.isArray(pages) ? pages.join(",") : String(pages),           // I
      Array.isArray(features) ? features.join(",") : String(features), // J
      content,                       // K
      additionalNotes,               // L
      "submitted",                   // M status
      submitted_at,                  // N updated_at
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("POST /api/brief failed:", err?.message || err, err?.stack);

    return NextResponse.json(
      { ok: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
