// lib/orderId.ts

/**
 * Normaliza un orderId a un formato consistente:
 * - Trim
 * - Uppercase
 * - Extrae ID si viene en URL
 * - Elimina query params
 * - Quita comillas
 * - Devuelve match tipo IW-YYMM-XXXX si existe
 */
export function normalizeOrderId(input: unknown): string {
  if (input === null || input === undefined) return "";

  let s = String(input).trim();
  if (!s) return "";

  // Si viene como URL o path, toma el último segmento
  if (s.includes("/")) {
    const parts = s.split("/").filter(Boolean);
    s = parts[parts.length - 1] || s;
  }

  // Si viene con query params
  if (s.includes("?")) {
    s = s.split("?")[0].trim();
  }

  // Quita comillas alrededor
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }

  // Quita espacios internos y pasa a mayúsculas
  s = s.replace(/\s+/g, "").toUpperCase();

  // Intenta extraer un ID válido dentro del string
  const m = s.match(/IW-\d{4}-[A-Z0-9]{4}/);
  if (m?.[0]) return m[0];

  return s;
}

/**
 * Alias para compatibilidad con código viejo:
 * orderIdKey() = normalizeOrderId()
 */
export function orderIdKey(input: unknown): string {
  return normalizeOrderId(input);
}

/**
 * Valida formato esperado: IW-YYMM-XXXX
 */
export function isValidOrderId(orderId: unknown): boolean {
  const id = normalizeOrderId(orderId);
  return /^IW-\d{4}-[A-Z0-9]{4}$/.test(id);
}

/**
 * Genera un nuevo orderId: IW-YYMM-XXXX
 */
export function generateOrderId(prefix = "IW"): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${yy}${mm}-${rand}`;
}
