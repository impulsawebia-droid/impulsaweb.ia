// Para comparar: elimina guiones y espacios, lower
export function orderIdKey(id: any) {
  return String(id ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/-/g, "");
}

// Para guardar: fuerza formato con guion si viene tipo IW2602-XXXX
export function normalizeOrderId(id: any) {
  const raw = String(id ?? "").trim().toUpperCase();

  // Caso ya correcto: IW-2602-XXXX
  if (/^IW-\d{4}-[A-Z0-9]{3,}$/.test(raw)) return raw;

  // Caso viejo: IW2602-XXXX  -> IW-2602-XXXX
  const m = raw.match(/^IW(\d{4})-([A-Z0-9]{3,})$/);
  if (m) return `IW-${m[1]}-${m[2]}`;

  // Si llega cualquier otra cosa, lo devolvemos “como venga”
  return raw;
}
