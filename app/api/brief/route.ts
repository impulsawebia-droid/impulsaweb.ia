import { NextResponse } from "next/server";
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function getSheetsClient() {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyRaw = requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

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

    const created_at = nowISO();

    const { sheets, spreadsheetId } = await getSheetsClient();

    // Asegúrate que la pestaña se llame EXACTAMENTE: briefs
    // Y que tenga columnas como tu screenshot:
    // A created_at | B order_id | C business_name | D business_type | E target_audience | F colors
    // G pages | H features | I competitors | J style | (K content) | (L additional_notes)
    // Si no tienes K/L, igual se van a crear columnas al append.
    const range = "briefs!A:L";

    const row = [
      created_at,                         // A created_at
      orderId,                            // B order_id
      businessName,                       // C business_name
      businessType,                       // D business_type
      targetAudience,                     // E target_audience
      colors,                             // F colors
      Array.isArray(pages) ? pages.join(",") : String(pages),           // G pages
      Array.isArray(features) ? features.join(",") : String(features), // H features
      competitors,                        // I competitors
      style,                              // J style
      content,                            // K content
      additionalNotes,                    // L additional_notes
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
