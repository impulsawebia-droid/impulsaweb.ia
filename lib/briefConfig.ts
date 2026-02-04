export type PlanKey = "landing" | "web" | "store";

export const STYLE_OPTIONS = [
  "moderno",
  "minimalista",
  "corporativo",
  "elegante",
  "creativo",
  "premium",
  "juvenil",
] as const;

export type StyleOption = (typeof STYLE_OPTIONS)[number];

export const WEB_PAGES_OPTIONS = [
  "inicio",
  "nosotros",
  "servicios",
  "portafolio",
  "blog",
  "contacto",
  "faq",
  "testimonios",
] as const;

export type WebPageOption = (typeof WEB_PAGES_OPTIONS)[number];

export const STORE_MARKET_OPTIONS = [
  "B2C (venta al detalle)",
  "B2B (empresas)",
  "Mayorista",
  "Local (ciudad / región)",
  "Nacional (Colombia)",
  "Internacional",
] as const;

export type StoreMarketOption = (typeof STORE_MARKET_OPTIONS)[number];

export const PLAN_RULES: Record<
  PlanKey,
  {
    key: PlanKey;
    label: string;
    mode: "landing" | "web" | "store";
    maxPages: number;
  }
> = {
  landing: {
    key: "landing",
    label: "Landing Page",
    mode: "landing",
    maxPages: 1,
  },
  web: {
    key: "web",
    label: "Web Profesional",
    mode: "web",
    maxPages: 5,
  },
  store: {
    key: "store",
    label: "Tienda Online",
    mode: "store",
    maxPages: 0,
  },
};