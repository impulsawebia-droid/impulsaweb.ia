"use client";

import React, { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { plans } from "@/lib/data";

type UiOrder = { order_id: string; plan_id: string; plan_name: string };

const pageLabels: Record<string, string> = {
  inicio: "Inicio / Home",
  nosotros: "Nosotros / Quiénes Somos",
  servicios: "Servicios",
  productos: "Productos / Catálogo",
  portafolio: "Portafolio / Proyectos",
  blog: "Blog / Noticias",
  contacto: "Contacto",
  faq: "Preguntas Frecuentes",
  testimonios: "Testimonios",
  categoria: "Categorías",
  carrito: "Carrito",
  checkout: "Checkout",
  politicas: "Políticas",
};

const featureLabels: Record<string, string> = {
  whatsapp: "Botón de WhatsApp",
  formulario_contacto: "Formulario de contacto",
  galeria: "Galería de imágenes",
  mapa: "Mapa de ubicación",
  newsletter: "Suscripción a newsletter",
  chat_en_vivo: "Chat en vivo",
  sistema_reservas: "Sistema de reservas/citas",
  pasarela_pagos: "Pasarela de pagos",
  carrito: "Carrito de compras",
  envios: "Integración envíos",
  inventario: "Gestión inventario",
};

export default function BriefPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<UiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [competitors, setCompetitors] = useState("");

  const [colors, setColors] = useState("");
  const [style, setStyle] = useState("");

  const [pages, setPages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const [hasContent, setHasContent] = useState("");
  const [notes, setNotes] = useState("");

  const plan = useMemo(() => {
    if (!order) return null;
    return plans.find((p) => p.id === order.plan_id) || null;
  }, [order]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data?.ok || !data.orders?.length) {
          setOrder(null);
          setLoading(false);
          return;
        }

        const o = data.orders[0];
        setOrder({
          order_id: String(o.order_id || orderId),
          plan_id: String(o.plan_id || ""),
          plan_name: String(o.plan_name || ""),
        });

        setLoading(false);
      } catch (e) {
        console.error(e);
        setOrder(null);
        setLoading(false);
      }
    };
    run();
  }, [orderId]);

  const allowedPages = plan?.allowedPages || [];
  const allowedFeatures = plan?.allowedFeatures || [];
  const maxPages = (plan as any)?.limits?.maxPages ?? 999;

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  const nextDisabled = () => {
    if (step === 1) return !businessName || !businessType || !targetAudience;
    if (step === 2) return !colors || !style;
    if (step === 3) return pages.length === 0 || pages.length > maxPages;
    if (step === 4) return false;
    return false;
  };

  const submitBrief = async () => {
    try {
      // Validación final
      if (!order) return alert("Orden no encontrada");
      if (!businessName || !businessType || !targetAudience) return alert("Completa la información del negocio");
      if (!colors || !style) return alert("Completa colores y estilo");
      if (!pages.length) return alert("Selecciona al menos una página");
      if (pages.length > maxPages) return alert(`Este plan permite máximo ${maxPages} páginas`);

      const payload = {
        order_id: order.order_id,
        business_name: businessName,
        business_type: businessType,
        target_audience: targetAudience,
        competitors,
        colors,
        style,
        pages,
        features,
        has_content: hasContent,
        notes,
      };

      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        console.error("brief post error:", data);
        alert(data?.error || "Error al enviar el brief. Intenta de nuevo.");
        return;
      }

      alert("✅ Brief enviado correctamente");
      router.push(`/panel/pedido/${order.order_id}`);
    } catch (e) {
      console.error(e);
      alert("Error inesperado al enviar el brief");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order || !plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold">Orden no encontrada</h1>
            <p className="text-muted-foreground mt-2">Verifica que tengas el enlace correcto.</p>
            <Link href="/panel">
              <Button className="mt-4">Ir al Panel</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-10">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Brief del Proyecto</h1>
            <p className="text-muted-foreground">
              Pedido <b>{order.order_id}</b> • Plan <b>{order.plan_name}</b> • Paso {step} de 4
            </p>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Sobre tu Negocio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Nombre de tu negocio o marca</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej: Restaurante El Sabor" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de negocio</Label>
                  <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Ej: Comida colombiana" />
                </div>
                <div className="space-y-2">
                  <Label>¿Quién es tu cliente ideal?</Label>
                  <Textarea value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Ej: Familias en Bogotá que buscan..." />
                </div>
                <div className="space-y-2">
                  <Label>Competidores o páginas similares (opcional)</Label>
                  <Textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="Ej: www.ejemplo.com - me gusta su..." />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={nextDisabled()}>
                    Siguiente →
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Estilo y Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Colores de tu marca</Label>
                  <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ej: azul, blanco, dorado" />
                </div>
                <div className="space-y-2">
                  <Label>Estilo (obligatorio)</Label>
                  <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ej: moderno, minimalista, corporativo..." />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>← Anterior</Button>
                  <Button onClick={() => setStep(3)} disabled={nextDisabled()}>Siguiente →</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Estructura de la Página</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="font-medium mb-2">¿Qué páginas necesitas?</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allowedPages.map((p) => (
                      <label key={p} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pages.includes(p)}
                          onChange={() => setPages((prev) => toggle(prev, p))}
                        />
                        <span>{pageLabels[p] || p}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Este plan permite máximo <b>{maxPages}</b> páginas. Seleccionadas: <b>{pages.length}</b>
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">Funcionalidades especiales</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allowedFeatures.map((f) => (
                      <label key={f} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={features.includes(f)}
                          onChange={() => setFeatures((prev) => toggle(prev, f))}
                        />
                        <span>{featureLabels[f] || f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>← Anterior</Button>
                  <Button onClick={() => setStep(4)} disabled={nextDisabled()}>Siguiente →</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Contenido y Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>¿Tienes contenido listo? (textos, fotos, logo)</Label>
                  <Textarea value={hasContent} onChange={(e) => setHasContent(e.target.value)} placeholder="Ej: Tengo fotos, logo y textos..." />
                </div>

                <div className="space-y-2">
                  <Label>Notas adicionales</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Cualquier instrucción especial..." />
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  Después de enviar este brief, te contactaremos por WhatsApp o email para coordinar el envío de archivos.
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>← Anterior</Button>
                  <Button onClick={submitBrief}>Enviar Brief</Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
