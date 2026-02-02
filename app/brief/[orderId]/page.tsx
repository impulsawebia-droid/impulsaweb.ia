"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const pageOptions = [
  { id: "inicio", label: "Inicio / Home" },
  { id: "nosotros", label: "Nosotros / Quienes Somos" },
  { id: "servicios", label: "Servicios" },
  { id: "productos", label: "Productos / Catálogo" },
  { id: "portafolio", label: "Portafolio / Proyectos" },
  { id: "blog", label: "Blog / Noticias" },
  { id: "contacto", label: "Contacto" },
  { id: "faq", label: "Preguntas Frecuentes" },
  { id: "testimonios", label: "Testimonios" },
];

const featureOptions = [
  { id: "whatsapp", label: "Botón de WhatsApp" },
  { id: "formulario", label: "Formulario de contacto" },
  { id: "galeria", label: "Galería de imágenes" },
  { id: "mapa", label: "Mapa de ubicación" },
  { id: "redes", label: "Links a redes sociales" },
  { id: "newsletter", label: "Suscripción a newsletter" },
  { id: "chat", label: "Chat en vivo" },
  { id: "reservas", label: "Sistema de reservas/citas" },
];

const styleOptions = [
  { value: "minimalista", label: "Minimalista y limpio" },
  { value: "corporativo", label: "Corporativo y profesional" },
  { value: "moderno", label: "Moderno y dinámico" },
  { value: "elegante", label: "Elegante y sofisticado" },
  { value: "juvenil", label: "Juvenil y colorido" },
  { value: "clasico", label: "Clásico y tradicional" },
];

export default function BriefPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    targetAudience: "",
    competitors: "",
    colors: "",
    style: "",
    pages: [] as string[],
    features: [] as string[],
    content: "",
    additionalNotes: "",
  });

  // ✅ Si ya existe brief en Sheets, marca como submitted y no lo vuelve a enviar
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/api/brief/${orderId}`, { cache: "no-store" });
        if (res.ok) {
          setSubmitted(true);
        }
      } catch {
        // no pasa nada, simplemente no existe aún
      }
    };
    check();
  }, [orderId]);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handlePageToggle = (pageId: string) => {
    setFormData((prev) => ({
      ...prev,
      pages: prev.pages.includes(pageId)
        ? prev.pages.filter((p) => p !== pageId)
        : [...prev.pages, pageId],
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLoadError(null);

    try {
      const payload = {
        orderId,
        businessName: formData.businessName,
        businessType: formData.businessType,
        targetAudience: formData.targetAudience,
        competitors: formData.competitors,
        colors: formData.colors,
        style: formData.style,
        pages: formData.pages,
        features: formData.features,
        content: formData.content,
        additionalNotes: formData.additionalNotes,
      };

      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        console.error("POST /api/brief error:", data);
        const msg = data?.error || `Error ${res.status} enviando brief`;
        setLoadError(msg);
        alert(`Error al enviar el brief: ${msg}`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || "Error inesperado";
      setLoadError(msg);
      alert(`Error al enviar el brief: ${msg}`);
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background py-12">
          <Card className="max-w-lg mx-4">
            <CardContent className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-foreground">
                ¡Brief completado!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Gracias por completar el brief. Nuestro equipo revisará la
                información y continuará el proceso.
              </p>
              <Button className="mt-6" onClick={() => router.push("/panel")}>
                Ir a Mi Panel
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-foreground">
                Brief del Proyecto
              </h1>
              <span className="text-sm text-muted-foreground">
                Paso {step} de {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            {loadError && (
              <p className="mt-3 text-sm text-red-600">
                Error: {loadError}
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Sobre tu Negocio"}
                {step === 2 && "Estilo y Preferencias"}
                {step === 3 && "Estructura de la Página"}
                {step === 4 && "Contenido y Notas"}
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  "Cuéntanos sobre tu negocio para entender mejor tus necesidades."}
                {step === 2 &&
                  "Define el estilo visual que quieres para tu página."}
                {step === 3 && "Selecciona las páginas y funciones que necesitas."}
                {step === 4 &&
                  "Agrega contenido adicional o instrucciones especiales."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">
                      Nombre de tu negocio o marca
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="Ej: Restaurante El Sabor"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de negocio</Label>
                    <Input
                      id="businessType"
                      placeholder="Ej: Restaurante de comida colombiana"
                      value={formData.businessType}
                      onChange={(e) =>
                        setFormData({ ...formData, businessType: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">¿Quién es tu cliente ideal?</Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="Ej: Familias en Bogotá que buscan..."
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAudience: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors">
                      Competidores o páginas similares (opcional)
                    </Label>
                    <Textarea
                      id="competitors"
                      placeholder="Ej: www.ejemplo.com - me gusta su..."
                      value={formData.competitors}
                      onChange={(e) =>
                        setFormData({ ...formData, competitors: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colores de tu marca</Label>
                    <Input
                      id="colors"
                      placeholder="Ej: Azul, blanco, dorado"
                      value={formData.colors}
                      onChange={(e) =>
                        setFormData({ ...formData, colors: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo que prefieres</Label>
                    <Select
                      value={formData.style}
                      onValueChange={(value) =>
                        setFormData({ ...formData, style: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {styleOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Tip: Comparte ejemplos
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Si hay páginas web que te gustan, escríbelas en las notas.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-3">
                    <Label>¿Qué páginas necesitas?</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {pageOptions.map((page) => (
                        <label
                          key={page.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                            formData.pages.includes(page.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox
                            checked={formData.pages.includes(page.id)}
                            onCheckedChange={() => handlePageToggle(page.id)}
                          />
                          <span className="text-sm">{page.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Funcionalidades especiales</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {featureOptions.map((feature) => (
                        <label
                          key={feature.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                            formData.features.includes(feature.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox
                            checked={formData.features.includes(feature.id)}
                            onCheckedChange={() => handleFeatureToggle(feature.id)}
                          />
                          <span className="text-sm">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      ¿Tienes contenido listo? (textos, fotos, logo)
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Ej: Tengo fotos, logo y textos..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Notas adicionales</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Cualquier instrucción especial..."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalNotes: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="rounded-xl bg-accent/10 border border-accent/20 p-4">
                    <p className="text-sm text-foreground">
                      Después de enviar este brief, te contactaremos por WhatsApp o
                      email para coordinar el envío de archivos.
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}

                {step < totalSteps ? (
                  <Button onClick={() => setStep(step + 1)} className="flex-1" disabled={isSubmitting}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Brief"}
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
