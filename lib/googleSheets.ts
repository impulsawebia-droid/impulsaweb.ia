// lib/googleSheets.ts
import { google } from "googleapis";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizePrivateKey(raw: string) {
  let key = raw.trim();

  // Quita comillas accidentales
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Convierte \n literales a saltos reales
  key = key.replace(/\\n/g, "\n");
  return key;
}

export function getSpreadsheetId() {
  // ✅ Una sola env var para toda la app
  return requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}

export function getSheetsClient() {
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(
    requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY")
  );

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendRow(sheetName: string, values: (string | number)[]) {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function getSheetValues(sheetName: string, range = "A:Z") {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${range}`,
  });

  return res.data.values || [];
}
