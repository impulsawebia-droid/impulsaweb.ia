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

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const { sheets, spreadsheetId } = await getSheetsClient();

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "briefs!A:Z",
    });

    const rows = resp.data.values || [];
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "No rows" }, { status: 404 });
    }

    // Detecta headers
    const header = rows[0] || [];
    const hasHeaders =
      String(header[0] || "").toLowerCase().includes("created") ||
      String(header[1] || "").toLowerCase().includes("order");

    const dataRows = hasHeaders ? rows.slice(1) : rows;

    const found = dataRows.find((r) => String(r?.[1] || "").trim() === orderId);

    if (!found) {
      return NextResponse.json(
        { ok: false, error: "Brief not found" },
        { status: 404 }
      );
    }

    // Mapea según tu sheet actual
    const brief = {
      created_at: found[0] || "",
      order_id: found[1] || "",
      business_name: found[2] || "",
      business_type: found[3] || "",
      target_audience: found[4] || "",
      colors: found[5] || "",
      pages: found[6] || "",
      features: found[7] || "",
      competitors: found[8] || "",
      style: found[9] || "",
      content: found[10] || "",
      additional_notes: found[11] || "",
    };

    return NextResponse.json({ ok: true, brief });
  } catch (err: any) {
    console.error("GET /api/brief/[orderId] failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
