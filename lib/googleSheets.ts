// lib/googleSheets.ts
import { google } from "googleapis";

type SheetsClient = ReturnType<typeof google.sheets>;

function normalizeCell(v: any) {
  return String(v ?? "")
    .replace(/\u00A0/g, " ") // non-breaking space
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export async function getSheetsClient(): Promise<SheetsClient> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    throw new Error("Missing Google Sheets env vars");
  }

  // Normaliza saltos de línea de private key
  key = key.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export function getSpreadsheetId(): string {
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

export async function updateRow(
  sheetName: string,
  rowIndex1Based: number,
  values: any[]
) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  // Actualiza desde la columna A hasta lo que tenga el array
  const endColIndex = values.length; // 1=A, 2=B...
  const endColLetter = columnToLetter(endColIndex);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowIndex1Based}:${endColLetter}${rowIndex1Based}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export function columnToLetter(col: number) {
  let temp = col;
  let letter = "";
  while (temp > 0) {
    let mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}

/**
 * Encuentra fila por una columna header (order_id por ejemplo)
 * Devuelve: { headers, rows, rowIndex1Based, row }
 */
export async function findRowByColumn(
  sheetName: string,
  columnHeader: string,
  matchValue: string,
  range = "A:Z"
) {
  const values = await getSheetValues(sheetName, range);
  if (!values || values.length < 2) {
    return { headers: [], rows: [], rowIndex1Based: null as number | null, row: null as any[] | null };
  }

  const headers = values[0].map((h: any) => String(h).trim());
  const rows = values.slice(1);

  const colIndex = headers.findIndex((h) => h.trim() === columnHeader);
  if (colIndex === -1) {
    throw new Error(`${sheetName} missing column: ${columnHeader}`);
  }

  const target = normalizeCell(matchValue);

  const foundIdx = rows.findIndex((r) => normalizeCell(r?.[colIndex]) === target);

  if (foundIdx === -1) {
    return { headers, rows, rowIndex1Based: null, row: null };
  }

  // +2: porque rows arranca en index 0 pero sheet tiene header en fila 1
  const rowIndex1Based = foundIdx + 2;
  const row = rows[foundIdx];

  return { headers, rows, rowIndex1Based, row };
}

/**
 * Upsert por order_id:
 * - si existe: actualiza la fila
 * - si no: append
 * Recibe un objeto que se mapea por headers (para no depender del orden)
 */
export async function upsertByOrderId(
  sheetName: string,
  orderId: string,
  data: Record<string, any>,
  range = "A:Z"
) {
  const { headers, rowIndex1Based } = await findRowByColumn(
    sheetName,
    "order_id",
    orderId,
    range
  );

  if (!headers.length) {
    throw new Error(`${sheetName} has no headers`);
  }

  // Construye la fila EXACTAMENTE en el orden de headers
  const rowValues = headers.map((h) => {
    const key = String(h).trim();
    return data[key] ?? "";
  });

  if (rowIndex1Based) {
    await updateRow(sheetName, rowIndex1Based, rowValues);
    return { updated: true, rowIndex1Based };
  } else {
    await appendRow(sheetName, rowValues);
    return { updated: false, rowIndex1Based: null };
  }
}
