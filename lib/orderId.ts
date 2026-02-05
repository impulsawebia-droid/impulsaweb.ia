// lib/orderId.ts
export function normalizeOrderId(v: any) {
  return String(v ?? "").trim();
}


// Para comparar: elimina guiones y espacios, lower
export function orderIdKey(id: any) {
  return String(id ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/-/g, "");
}


