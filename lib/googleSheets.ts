import { google } from "googleapis";

function normalizePrivateKey(key?: string) {
  if (!key) return "";

  let k = String(key).trim();

  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }

  k = k.replace(/\\n/g, "\n");
  k = k.replace(/\r\n/g, "\n");

  k = k.replace(/-----BEGIN PRIVATE KEY-----\s*/g, "-----BEGIN PRIVATE KEY-----\n");
  k = k.replace(/\s*-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----");

  return k;
}

export function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("Missing env GOOGLE_SHEETS_SPREADSHEET_ID");
  return id;
}

export async function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  if (!email) throw new Error("Missing env GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!privateKey) throw new Error("Missing env GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await auth.authorize();

  return google.sheets({ version: "v4", auth });
}

export async function getSheetValues(sheetName: string, range = "A1:Z") {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const finalRange = `${sheetName}!${range}`;

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: finalRange,
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
    range: `${sheetName}!A1:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}

export async function findRowByColumn(
  sheetName: string,
  columnName: string,
  value: string,
  range = "A1:Z"
) {
  const values = await getSheetValues(sheetName, range);

  if (!values || values.length < 1) {
    return { headers: [], row: null as any, rowNumber: null as any };
  }

  const headers = (values[0] || []).map((h: any) => String(h || "").trim());
  const rows = values.slice(1);

  const idx = headers.findIndex((h) => h === columnName);
  if (idx === -1) {
    throw new Error(`${sheetName} missing column: ${columnName}`);
  }

  const target = String(value || "").trim();
  let foundIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    const cell = String(rows[i]?.[idx] ?? "").trim();
    if (cell === target) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    return { headers, row: null, rowNumber: null };
  }

  const rowNumber = 2 + foundIndex;
  return { headers, row: rows[foundIndex], rowNumber };
}

async function updateRowByNumber(sheetName: string, rowNumber: number, values: any[]) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const startCol = "A";
  const endCol = String.fromCharCode("A".charCodeAt(0) + Math.max(values.length - 1, 0));
  const range = `${sheetName}!${startCol}${rowNumber}:${endCol}${rowNumber}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function upsertByOrderId(
  sheetName: string,
  orderId: string,
  data: Record<string, any>,
  range = "A1:Z"
) {
  const found = await findRowByColumn(sheetName, "order_id", orderId, range);

  if (!found.headers.length) {
    throw new Error(`${sheetName} has no headers`);
  }

  const headers = found.headers;
  const rowValues = headers.map((h) => {
    const v = data[h];
    return v === undefined || v === null ? "" : String(v);
  });

  if (found.rowNumber) {
    await updateRowByNumber(sheetName, found.rowNumber, rowValues);
    return { action: "updated", rowNumber: found.rowNumber };
  } else {
    await appendRow(sheetName, rowValues);
    return { action: "inserted" };
  }
}
