import { NextResponse } from "next/server";
import { getSheetsClient, getSpreadsheetId } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id,
      business_name,
      business_desc,
      target,
      colors,
      sections,
      references,
      competitors,
      domain,
      files_url,
      extra,
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
          business_desc || "",
          target || "",
          colors || "",
          Array.isArray(sections) ? sections.join(", ") : (sections || ""),
          references || "",
          competitors || "",
          domain || "",
          files_url || "",
          extra || "",
        ]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
