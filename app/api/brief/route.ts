import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/googleSheets";

// Column indices for briefs sheet (0-indexed)
// A: submitted_at, B: order_id, C: business_name, D: business_type, E: target_audience,
// F: colors, G: style, H: pages, I: features, J: content, K: competitors, L: additional_notes

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "briefs!A:L",
    });

    const rows = response.data.values || [];
    
    // Skip header row if present
    const dataRows = rows.length > 0 && rows[0][0] === "submitted_at" ? rows.slice(1) : rows;

    const briefs = dataRows.map((row) => ({
      submittedAt: row[0] || "",
      orderId: row[1] || "",
      businessName: row[2] || "",
      businessType: row[3] || "",
      targetAudience: row[4] || "",
      colors: row[5] || "",
      style: row[6] || "",
      pages: row[7] ? row[7].split(", ") : [],
      features: row[8] ? row[8].split(", ") : [],
      content: row[9] || "",
      competitors: row[10] || "",
      additionalNotes: row[11] || "",
    }));

    // Filter by orderId if provided
    if (orderId) {
      const brief = briefs.find((b) => b.orderId === orderId);
      return NextResponse.json({ ok: true, brief: brief || null });
    }

    return NextResponse.json({ ok: true, briefs });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      business_name,
      business_type,
      target_audience,
      colors,
      style,
      pages,
      features,
      content,
      competitors,
      additional_notes,
    } = body;

    if (!order_id || !business_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "briefs!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          order_id,
          business_name,
          business_type || "",
          target_audience || "",
          colors || "",
          style || "",
          Array.isArray(pages) ? pages.join(", ") : (pages || ""),
          Array.isArray(features) ? features.join(", ") : (features || ""),
          content || "",
          competitors || "",
          additional_notes || "",
        ]],
      },
    });

    // Update order to mark brief as completed
    const ordersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "orders!A:P",
    });

    const rows = ordersResponse.data.values || [];
    const rowIndex = rows.findIndex((row) => row[1] === order_id);

    if (rowIndex !== -1) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `orders!P${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["true"]],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
