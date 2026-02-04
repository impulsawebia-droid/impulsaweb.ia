// lib/googleSheets.ts
import { google } from "googleapis";

export const SHEETS_SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];

function normalizePrivateKey(raw?: string) {
  if (!raw) return "";
  // Quita comillas si quedaron pegadas por Vercel (muy común)
  let key = raw.trim();
  key = key.replace(/^"|"$/g, "");
  key = key.replace(/^'|'$/g, "");

  // Normaliza saltos de línea
  key = key.replace(/\\n/g, "\n");
  key = key.replace(/\r\n/g, "\n");

  return key;
}

export async function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !rawKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets env vars");
  }

  const key = normalizePrivateKey(rawKey);

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: SHEETS_SCOPE,
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  return id;
}

export async function getSheetValues(sheetName: string, range = "A:Z") {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${range}`,
    majorDimension: "ROWS",
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  return resp.data.values || [];
}

export async function appendRow(sheetName: string, values: any[]) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}
