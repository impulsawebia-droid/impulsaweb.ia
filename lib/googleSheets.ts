// lib/googleSheets.ts
import { google } from "googleapis";

export const SHEETS_SCOPE = ["https://www.googleapis.com/auth/spreadsheets"];

function normalizePrivateKey(raw?: string) {
  if (!raw) return "";
  let key = raw.trim();

  // Quita comillas si quedaron pegadas por Vercel
  key = key.replace(/^"|"$/g, "");
  key = key.replace(/^'|'$/g, "");

  // Normaliza saltos de línea
  key = key.replace(/\\n/g, "\n");
  key = key.replace(/\r\n/g, "\n");

  return key;
}

function normalizeCell(v: any) {
  return String(v ?? "")
    .replace(/\u00A0/g, " ") // non-breaking space
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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

  return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEETS_SPREADSHEET_ID");
  return id;
}

export async function getSheetValues(sheetName: string, range = "A1:Z") {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  try {
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${range}`,
      majorDimension: "ROWS",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const values = resp.data.values || [];
    return values;
  } catch (err: any) {
    // 🔥 esto te mostrará el error REAL en Vercel logs
    console.error(
      `GoogleSheets getSheetValues failed for ${sheetName}!${range}:`,
      err?.response?.data || err?.message || err,
      err
    );
    throw new Error(`No se pudo leer la hoja "${sheetName}". Revisa permisos, spreadsheetId y nombre.`);
  }
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

function columnToLetter(col: number) {
  let temp = col;
  let letter = "";
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}

export async function updateRow(sheetName: string, rowIndex1Based: number, values: any[]) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const endColLetter = columnToLetter(values.length);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowIndex1Based}:${endColLetter}${rowIndex1Based}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

/**
 * ✅ findRowByColumn
 * Busca una fila comparando por header name y matchValue, con normalización robusta
 */
export async function findRowByColumn(
  sheetName: string,
  columnHeader: string,
  matchValue: string,
  range = "A:Z"
) {
  const values = await getSheetValues(sheetName, range);

  if (!values || values.length < 2) {
    return {
      headers: [] as string[],
      rows: [] as any[][],
      rowIndex1Based: null as number | null,
      row: null as any[] | null,
    };
  }

  const headers = values[0].map((h: any) => String(h).trim());
  const rows = values.slice(1);

  const colIndex = headers.findIndex((h) => h.trim() === columnHeader.trim());
  if (colIndex === -1) {
    throw new Error(`${sheetName} missing column: ${columnHeader}`);
  }

  const target = normalizeCell(matchValue);

  const foundIdx = rows.findIndex((r) => normalizeCell(r?.[colIndex]) === target);

  if (foundIdx === -1) {
    return { headers, rows, rowIndex1Based: null, row: null };
  }

  // +2: header está en fila 1, rows empieza en fila 2
  const rowIndex1Based = foundIdx + 2;
  const row = rows[foundIdx];

  return { headers, rows, rowIndex1Based, row };
}

/**
 * ✅ upsertByOrderId
 * Inserta o actualiza en base al order_id (sin duplicados)
 * Requiere que la hoja tenga header "order_id"
 */
export async function upsertByOrderId(
  sheetName: string,
  orderId: string,
  data: Record<string, any>,
  range = "A:Z"
) {
  // Trae headers y fila existente (si existe)
  const found = await findRowByColumn(sheetName, "order_id", orderId, range);

  if (!found.headers.length) {
    throw new Error(`${sheetName} has no headers`);
  }

  // Construye la fila en el mismo orden del header
  const rowValues = found.headers.map((h) => {
    const key = String(h).trim();
    return data[key] ?? "";
  });

  if (found.rowIndex1Based) {
    await updateRow(sheetName, found.rowIndex1Based, rowValues);
    return { updated: true, rowIndex1Based: found.rowIndex1Based };
  } else {
    await appendRow(sheetName, rowValues);
    return { updated: false, rowIndex1Based: null };
  }
}
