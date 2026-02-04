// app/brief/[orderId]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { plans } from "@/lib/data";
import {
  PLAN_RULES,
  STYLE_OPTIONS,
  WEB_PAGES_OPTIONS,
  STORE_MARKET_OPTIONS,
  type PlanKey,
} from "@/lib/briefConfig";
import { toast } from "@/hooks/use-toast";

type BriefForm = {
  order_id: string;

  // Paso 1
  businessName: string;
  businessType: string;
  targetAudience: string;
  competitors: string;

  // Paso 2
  colors: string;
  style: string; // ahora es select

  // Paso 3 (depende del plan)
  landingType: "" | "producto" | "servicio"; // landing
  pages: string[]; // web (máx 5)
  market: "" | string; // store

  // funcionalidades (opcional por ahora)
  features: string[];

  // Paso 4
  contentReady: string;
  notes: string;
};

const FEATURE_OPTIONS = [
  "boton_whatsapp",
  "formulario_contacto",
  "galeria_imagenes",
  "mapa_ubicacion",
  "links_redes",
  "newsletter",
  "chat_en_vivo",
  "reservas_citas",
] as const;

export default function BriefPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<BriefForm>({
    order_id: orderId || "",
    businessName: "",
    businessType: "",
    targetAudience: "",
    competitors: "",
    colors: "",
    style: "",
    landingType: "",
    pages: [],
    market: "",
    features: [],
    contentReady: "",
    notes: "",
  });

  // 1) cargar orden para saber planId
  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        setLoadingOrder(true);

        // OJO: si tú tienes endpoint de order por id, úsalo.
        // Si no, buscamos por /api/orders?order_id=
        const res = await fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (!res.ok || !data?.ok) throw new Error(data?.error || "No se pudo cargar la orden");
        const found = (data.orders || [])[0];
        if (!found) throw new Error("Orden no encontrada");

        setOrder(found);
      } catch (e) {
        console.error(e);
        setOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [orderId]);

  const planKey = useMemo<PlanKey | null>(() => {
    if (!order) return null;

    // En tu sheet guardas plan_id; en tu UI también.
    // Debe ser: landing | web | store
    const pid = String(order.plan_id || "").trim();
    if (pid === "landing" || pid === "web" || pid === "store") return pid;
    return null;
  }, [order]);

  const planLabel = useMemo(() => {
    if (!order) return "";
    return String(order.plan_name || "");
  }, [order]);

  const rules = planKey ? PLAN_RULES[planKey] : null;

  const canGoNextStep1 = () => {
    return (
      form.businessName.trim() &&
      form.businessType.trim() &&
      form.targetAudience.trim()
    );
  };

  const canGoNextStep2 = () => {
    // style obligatorio en select
    return form.colors.trim() && form.style.trim();
  };

  const canGoNextStep3 = () => {
    if (!rules) return false;

    if (rules.mode === "landing") {
      return form.landingType === "producto" || form.landingType === "servicio";
    }

    if (rules.mode === "web") {
      return form.pages.length >= 1 && form.pages.length <= rules.maxPages;
    }

    if (rules.mode === "store") {
      return !!form.market.trim();
    }

    return false;
  };

  const toggleFeature = (code: string) => {
    setForm((prev) => {
      const exists = prev.features.includes(code);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((x) => x !== code)
          : [...prev.features, code],
      };
    });
  };

  const toggleWebPage = (page: string) => {
    setForm((prev) => {
      const exists = prev.pages.includes(page);

      // si existe, quitar
      if (exists) {
        return { ...prev, pages: prev.pages.filter((p) => p !== page) };
      }

      // si no existe, validar límite
      const max = rules?.maxPages ?? 0;
      if (max > 0 && prev.pages.length >= max) {
        alert(`Este plan permite máximo ${max} páginas.`);
        return prev;
      }

      return { ...prev, pages: [...prev.pages, page] };
    });
  };

  const goNext = () => {
    if (step === 1) {
      if (!canGoNextStep1()) return alert("Completa los campos obligatorios del paso 1.");
      setStep(2);
    } else if (step === 2) {
      if (!canGoNextStep2()) return alert("Selecciona colores y estilo (obligatorio).");
      setStep(3);
    } else if (step === 3) {
      if (!canGoNextStep3()) return alert("Completa las opciones del paso 3 según el plan.");
      setStep(4);
    }
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((prev) => (prev === 2 ? 1 : prev === 3 ? 2 : 3));
  };

  const handleSubmit = async () => {
    if (!canGoNextStep1() || !canGoNextStep2() || !canGoNextStep3()) {
      return alert("Asegúrate de completar todos los pasos obligatorios.");
    }

    setSubmitting(true);
    try {
      // Normalizamos lo que se guarda en "pages" según plan:
      // - landing: pages = ["producto"] o ["servicio"]
      // - web: pages = las seleccionadas
      // - store: pages = [] y market lleno
      const normalizedPages =
        rules?.mode === "landing"
          ? [form.landingType]
          : rules?.mode === "web"
          ? form.pages
          : [];

      const payload = {
        order_id: orderId,

        // paso 1
        business_name: form.businessName,
        business_type: form.businessType,
        target_audience: form.targetAudience,
        competitors: form.competitors,

        // paso 2
        colors: form.colors,
        style: form.style,

        // paso 3
        pages: normalizedPages,
        features: form.features,
        market: rules?.mode === "store" ? form.market : "",

        // ✅ paso 4 (ESTO es lo que faltaba)
        content: form.contentReady,                 // ✅ antes: content_ready
        additional_notes: form.notes,               // ✅ antes: notes

        // ✅ guardar plan también (sale de la orden que ya cargaste)
        plan_id: String(order?.plan_id || ""),      // ✅ landing/web/store
        plan_name: String(order?.plan_name || ""),  // ✅ Landing Page / Web Profesional / etc

        status: "submitted",
      };

      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        console.error("POST /api/brief error:", data);
        alert(data?.error || "Error al enviar el brief. Intenta de nuevo.");
        return;
      }

      router.push(`/panel/pedido/${orderId}`);
    } catch (e) {
      console.error(e);
      alert("Error inesperado enviando el brief.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          Cargando...
        </main>
        <Footer />
      </div>
    );
  }

  if (!order || !rules) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold">Orden no encontrada</h1>
            <p className="text-muted-foreground mt-2">
              Verifica que el enlace sea correcto.
            </p>
            <Button className="mt-4" onClick={() => router.push("/panel")}>
              Ir al Panel
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stepTitle =
    step === 1
      ? "Sobre tu Negocio"
      : step === 2
      ? "Estilo y Preferencias"
      : step === 3
      ? "Estructura del Plan"
      : "Contenido y Notas";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-10">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Brief del Proyecto</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pedido {orderId} • Plan {planLabel} • Paso {step} de 4
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{stepTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre de tu negocio o marca</Label>
                    <Input
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="Ej: Restaurante El Sabor"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de negocio</Label>
                    <Input
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      placeholder="Ej: Restaurante de comida colombiana"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>¿Quién es tu cliente ideal?</Label>
                    <Textarea
                      value={form.targetAudience}
                      onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                      placeholder="Ej: Familias en Bogotá que buscan..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Competidores o páginas similares (opcional)</Label>
                    <Input
                      value={form.competitors}
                      onChange={(e) => setForm({ ...form, competitors: e.target.value })}
                      placeholder="Ej: www.ejemplo.com"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Colores de tu marca</Label>
                    <Input
                      value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      placeholder="Ej: azul, blanco, dorado"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo (obligatorio)</Label>
                    <Select
                      value={form.style}
                      onValueChange={(v) => setForm({ ...form, style: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {STYLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Tip: si tienes sitios de referencia, ponlos en notas al final.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* LANDING: solo Producto o Servicio */}
                  {rules.mode === "landing" && (
                    <div className="space-y-3">
                      <p className="font-medium">¿Tu landing es para…?</p>
                      <RadioGroup
                        value={form.landingType}
                        onValueChange={(v) =>
                          setForm({ ...form, landingType: v as any })
                        }
                        className="space-y-2"
                      >
                        <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                          <RadioGroupItem value="producto" />
                          <span>Producto</span>
                        </label>

                        <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                          <RadioGroupItem value="servicio" />
                          <span>Servicio</span>
                        </label>
                      </RadioGroup>

                      <p className="text-xs text-muted-foreground">
                        Este plan permite escoger solo 1 opción.
                      </p>
                    </div>
                  )}

                  {/* WEB: máximo 5 páginas */}
                  {rules.mode === "web" && (
                    <div className="space-y-3">
                      <p className="font-medium">¿Qué páginas necesitas?</p>
                      <p className="text-xs text-muted-foreground">
                        Este plan permite máximo {rules.maxPages} páginas. Seleccionadas:{" "}
                        {form.pages.length}
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {WEB_PAGES_OPTIONS.map((p) => {
                          const checked = form.pages.includes(p);
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => toggleWebPage(p)}
                              className={`text-left rounded-lg border px-3 py-2 text-sm transition ${
                                checked
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STORE: no páginas, solo mercado */}
                  {rules.mode === "store" && (
                    <div className="space-y-3">
                      <p className="font-medium">¿A qué tipo de mercado va dirigida tu tienda?</p>

                      <Select
                        value={form.market}
                        onValueChange={(v) => setForm({ ...form, market: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de mercado" />
                        </SelectTrigger>
                        <SelectContent>
                          {STORE_MARKET_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <p className="text-xs text-muted-foreground">
                        En Tienda Online no se seleccionan páginas aquí; la estructura es estándar
                        de e-commerce.
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Funcionalidades (si quieres que también dependan del plan, se puede) */}
                  <div className="space-y-3">
                    <p className="font-medium">Funcionalidades especiales (opcional)</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {FEATURE_OPTIONS.map((f) => {
                        const checked = form.features.includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => toggleFeature(f)}
                            className={`text-left rounded-lg border px-3 py-2 text-sm transition ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {f.replaceAll("_", " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>¿Tienes contenido listo? (textos, fotos, logo)</Label>
                    <Textarea
                      value={form.contentReady}
                      onChange={(e) => setForm({ ...form, contentReady: e.target.value })}
                      placeholder="Ej: Tengo logo y textos..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas adicionales</Label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Cualquier instrucción especial..."
                    />
                  </div>

                  <div className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                    Después de enviar este brief, te contactaremos por WhatsApp o email para
                    coordinar el envío de archivos.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={goBack} disabled={step === 1 || submitting}>
                  ← Anterior
                </Button>

                {step < 4 ? (
                  <Button onClick={goNext} disabled={submitting}>
                    Siguiente →
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar Brief"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
