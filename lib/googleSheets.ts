// lib/googlesheets.ts
import { google } from "googleapis";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

function normalizePrivateKey(raw: string) {
  let key = raw.trim();

  // Quitar comillas accidentales
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Convertir \n literales en saltos reales
  key = key.replace(/\\n/g, "\n");

  // Si viene en base64, intentar decodificar
  const looksLikeBase64 =
    !key.includes("BEGIN PRIVATE KEY") &&
    /^[A-Za-z0-9+/=\\s]+$/.test(key) &&
    key.length > 200;

  if (looksLikeBase64) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf8");
      if (decoded.includes("BEGIN PRIVATE KEY")) {
        key = decoded;
      }
    } catch {
      // ignorar
    }
  }

  if (!key.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "Invalid GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY format"
    );
  }

  return key;
}

export function getSheetsClient() {
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyRaw = requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const privateKey = normalizePrivateKey(privateKeyRaw);

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId() {
  return requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}
