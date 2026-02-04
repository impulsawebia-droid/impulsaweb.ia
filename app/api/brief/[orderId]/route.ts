"use client";

import React from "react";
import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { plans } from "@/lib/data";
import { ArrowLeft } from "lucide-react";

// ✅ Tip: ajusta esto si tu Order trae otro campo
type OrderLite = {
  id: string;
  plan_id?: string;
  planId?: string;
  plan_name?: string;
  planName?: string;
};

type BriefPayload = {
  order_id: string;
  created_at: string;

  business_name: string;
  business_type: string;
  target_audience: string;
  competitors: string;

  colors: string;
  style: string;

  pages: string[];        // landing/web
  market?: string;        // tienda

  content_ready: string;
  notes: string;
};

export default function BriefPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState<OrderLite | null>(null);

  // FORM
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitors, setCompetitors] = useState("");

  const [colors, setColors] = useState("");
  const [style, setStyle] = useState("");

  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [market, setMarket] = useState("");

  const [contentReady, setContentReady] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // 1) Cargar order desde API (si tienes endpoint). Si no existe, al menos continuar.
  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        setLoadingOrder(true);

        // Intento 1: buscar por order_id desde /api/orders
        const res = await fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("No se pudo cargar la orden");

        const data = await res.json();
        const found = (data?.orders?.[0] ?? null) as any;

        if (!cancelled) {
          setOrder({
            id: found?.order_id || orderId,
            plan_id: found?.plan_id,
            planId: found?.plan_id,
            plan_name: found?.plan_name,
            planName: found?.plan_name,
          });
        }
      } catch {
        if (!cancelled) {
          setOrder({ id: orderId });
        }
      } finally {
        if (!cancelled) setLoadingOrder(false);
      }
    }

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const plan = useMemo(() => {
    const pid = (order?.plan_id || order?.planId) as any;
    if (pid) return plans.find((p) => p.id === pid) || null;
    return null;
  }, [order]);

  const rules = plan?.briefRules;

  // ✅ Si cambia el plan, limpiamos selecciones incompatibles
  useEffect(() => {
    if (!rules) return;

    if (rules.pagesMode === "none") {
      setSelectedPages([]);
    } else if (rules.pagesMode === "single") {
      // Landing: solo 1 opción
      if (selectedPages.length > 1) setSelectedPages([selectedPages[0]]);
    } else if (rules.pagesMode === "multi") {
      // Web: máximo 5
      if (selectedPages.length > rules.maxPages) {
        setSelectedPages(selectedPages.slice(0, rules.maxPages));
      }
    }
  }, [rules]); // eslint-disable-line react-hooks/exhaustive-deps

  const titlePlan = plan?.name || order?.planName || "Plan";
  const pagesCountText =
    rules?.pagesMode === "multi" ? `(${selectedPages.length}/${rules.maxPages})` : "";

  function canGoNext() {
    // Validaciones obligatorias por paso
    if (step === 1) {
      return (
        businessName.trim() &&
        businessType.trim() &&
        targetAudience.trim()
      );
    }
    if (step === 2) {
      return colors.trim() && style.trim();
    }
    if (step === 3) {
      if (!rules) return false;

      if (rules.pagesMode === "single") {
        return selectedPages.length === 1; // ✅ Landing: EXACTAMENTE 1
      }
      if (rules.pagesMode === "multi") {
        return selectedPages.length >= 1 && selectedPages.length <= rules.maxPages; // ✅ Web: 1..5
      }
      if (rules.pagesMode === "none") {
        return market.trim().length > 0; // ✅ Tienda: mercado obligatorio
      }
    }
    if (step === 4) {
      return contentReady.trim() && notes.trim();
    }
    return true;
  }

  function togglePage(id: string) {
    if (!rules) return;

    if (rules.pagesMode === "single") {
      // Landing -> radio-like: solo 1
      setSelectedPages([id]);
      return;
    }

    if (rules.pagesMode === "multi") {
      setSelectedPages((prev) => {
        const exists = prev.includes(id);
        if (exists) return prev.filter((x) => x !== id);

        // bloquear si ya llegó al máximo
        if (prev.length >= rules.maxPages) return prev;
        return [...prev, id];
      });
      return;
    }
  }

  async function submitBrief() {
    if (!rules) return;

    const payload: BriefPayload = {
      order_id: orderId,
      created_at: new Date().toISOString(),
      business_name: businessName.trim(),
      business_type: businessType.trim(),
      target_audience: targetAudience.trim(),
      competitors: competitors.trim(),

      colors: colors.trim(),
      style: style.trim(),

      pages: rules.pagesMode === "none" ? [] : selectedPages,
      market: rules.pagesMode === "none" ? market : undefined,

      content_ready: contentReady.trim(),
      notes: notes.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        alert(data?.error || "Error al enviar el brief. Por favor intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      // ✅ llevar al panel/detalle
      router.push(`/panel/pedido/${orderId}`);
    } catch (e) {
      alert("Error al enviar el brief. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background py-10">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link
            href="/panel"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Brief del Proyecto</h1>
            <p className="text-muted-foreground mt-1">
              Pedido <b>{orderId}</b> · {loadingOrder ? "Cargando..." : titlePlan} · Paso {step} de 4
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Sobre tu Negocio"}
                {step === 2 && "Estilo y Preferencias"}
                {step === 3 &&
                  (rules?.pagesMode === "none"
                    ? "Mercado Objetivo"
                    : "Estructura de la Página")}
                {step === 4 && "Contenido y Notas"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Cuéntanos tu negocio para entender mejor tus necesidades."}
                {step === 2 && "Define el estilo visual que quieres para tu página."}
                {step === 3 &&
                  (rules?.pagesMode === "none"
                    ? "Selecciona el mercado al que se dirige tu tienda."
                    : "Selecciona las páginas según tu plan.")}
                {step === 4 && "Agrega contenido adicional o instrucciones especiales."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre de tu negocio o marca</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej: Restaurante El Sabor" />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de negocio</Label>
                    <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Ej: Restaurante de comida colombiana" />
                  </div>

                  <div className="space-y-2">
                    <Label>¿Quién es tu cliente ideal?</Label>
                    <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Ej: Familias en Bogotá que buscan..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Competidores o páginas similares (opcional)</Label>
                    <Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="Ej: www.ejemplo.com" />
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Colores de tu marca</Label>
                    <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ej: Azul, blanco, dorado" />
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo (obligatorio)</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {(rules?.styleOptions ?? ["corporativo","moderno","minimalista"]).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  {!rules ? (
                    <div className="text-sm text-muted-foreground">
                      No se pudo detectar el plan. Vuelve a intentar desde el panel.
                    </div>
                  ) : rules.pagesMode === "none" ? (
                    // ✅ TIENDA: NO páginas, solo mercado
                    <div className="space-y-3">
                      <Label>¿Qué tipo de mercado?</Label>
                      <RadioGroup value={market} onValueChange={setMarket} className="space-y-2">
                        {rules.marketOptions.map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer ${
                              market === m.id ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <RadioGroupItem value={m.id} />
                            <span>{m.label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : rules.pagesMode === "single" ? (
                    // ✅ LANDING: SOLO 1 (radio)
                    <div className="space-y-3">
                      <Label>Elige 1 opción (producto o servicio)</Label>
                      <RadioGroup
                        value={selectedPages[0] || ""}
                        onValueChange={(v) => setSelectedPages([v])}
                        className="space-y-2"
                      >
                        {rules.pageOptions.map((p) => (
                          <label
                            key={p.id}
                            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer ${
                              (selectedPages[0] || "") === p.id
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <RadioGroupItem value={p.id} />
                            <span>{p.label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    // ✅ WEB: MÁXIMO 5 (checkbox)
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Páginas seleccionadas {pagesCountText}</Label>
                        <span className="text-xs text-muted-foreground">
                          Máximo {rules.maxPages}
                        </span>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {rules.pageOptions.map((p) => {
                          const checked = selectedPages.includes(p.id);
                          const reachedLimit = !checked && selectedPages.length >= rules.maxPages;

                          return (
                            <label
                              key={p.id}
                              className={`flex items-center gap-3 rounded-lg border p-3 ${
                                reachedLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                if (reachedLimit) return;
                                togglePage(p.id);
                              }}
                            >
                              <Checkbox checked={checked} />
                              <span>{p.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {selectedPages.length === rules.maxPages && (
                        <p className="text-xs text-amber-600">
                          Ya seleccionaste el máximo de páginas permitido por tu plan.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>¿Tienes contenido listo? (textos, fotos, logo)</Label>
                    <Input
                      value={contentReady}
                      onChange={(e) => setContentReady(e.target.value)}
                      placeholder="Ej: Tengo logo, fotos y textos..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notas adicionales</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Cualquier instrucción especial..."
                    />
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                    Después de enviar este brief, te contactaremos por WhatsApp o email para coordinar el envío de archivos.
                  </div>
                </div>
              )}

              <Separator />

              {/* NAV */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1 || submitting}
                >
                  ← Anterior
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canGoNext() || submitting}
                  >
                    Siguiente →
                  </Button>
                ) : (
                  <Button
                    onClick={submitBrief}
                    disabled={!canGoNext() || submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar Brief"}
                  </Button>
                )}
              </div>

              {!canGoNext() && (
                <p className="text-xs text-amber-600">
                  Completa los campos obligatorios para continuar.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
