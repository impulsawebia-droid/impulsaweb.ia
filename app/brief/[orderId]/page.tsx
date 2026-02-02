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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getOrderById, saveBrief, getBriefByOrderId } from "@/lib/store";
import type { Order, Brief } from "@/lib/types";
import { Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const pageOptions = [
  { id: "inicio", label: "Inicio / Home" },
  { id: "nosotros", label: "Nosotros / Quienes Somos" },
  { id: "servicios", label: "Servicios" },
  { id: "productos", label: "Productos / Catalogo" },
  { id: "portafolio", label: "Portafolio / Proyectos" },
  { id: "blog", label: "Blog / Noticias" },
  { id: "contacto", label: "Contacto" },
  { id: "faq", label: "Preguntas Frecuentes" },
  { id: "testimonios", label: "Testimonios" },
];

const featureOptions = [
  { id: "whatsapp", label: "Boton de WhatsApp" },
  { id: "formulario", label: "Formulario de contacto" },
  { id: "galeria", label: "Galeria de imagenes" },
  { id: "mapa", label: "Mapa de ubicacion" },
  { id: "redes", label: "Links a redes sociales" },
  { id: "newsletter", label: "Suscripcion a newsletter" },
  { id: "chat", label: "Chat en vivo" },
  { id: "reservas", label: "Sistema de reservas/citas" },
];

const styleOptions = [
  { value: "minimalista", label: "Minimalista y limpio" },
  { value: "corporativo", label: "Corporativo y profesional" },
  { value: "moderno", label: "Moderno y dinamico" },
  { value: "elegante", label: "Elegante y sofisticado" },
  { value: "juvenil", label: "Juvenil y colorido" },
  { value: "clasico", label: "Clasico y tradicional" },
];

export default function BriefPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<Omit<Brief, "orderId" | "submittedAt">>({
    businessName: "",
    businessType: "",
    targetAudience: "",
    competitors: "",
    colors: "",
    style: "",
    pages: [],
    features: [],
    content: "",
    additionalNotes: "",
  });

  useEffect(() => {
    const orderData = getOrderById(orderId);
    if (orderData) {
      setOrder(orderData);
      // Check if brief already exists
      const existingBrief = getBriefByOrderId(orderId);
      if (existingBrief) {
        setSubmitted(true);
      }
    }
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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const brief: Brief = {
      ...formData,
      orderId,
      submittedAt: new Date().toISOString(),
    };

    saveBrief(brief);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Orden no encontrada</h1>
            <p className="mt-2 text-muted-foreground">
              Verifica que tengas el enlace correcto.
            </p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Ir al Inicio
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                Brief Completado!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Gracias por completar el brief. Nuestro equipo revisara la
                informacion y comenzara a trabajar en tu proyecto.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Te contactaremos pronto para mostrarte los primeros avances.
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Sobre tu Negocio"}
                {step === 2 && "Estilo y Preferencias"}
                {step === 3 && "Estructura de la Pagina"}
                {step === 4 && "Contenido y Notas"}
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  "Cuentanos sobre tu negocio para entender mejor tus necesidades."}
                {step === 2 &&
                  "Define el estilo visual que quieres para tu pagina."}
                {step === 3 && "Selecciona las paginas y funciones que necesitas."}
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
                    <Label htmlFor="targetAudience">
                      Quien es tu cliente ideal?
                    </Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="Ej: Familias de estrato 3-5 en Bogota que buscan almorzar los fines de semana..."
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAudience: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitors">
                      Conoces competidores o paginas similares? (opcional)
                    </Label>
                    <Textarea
                      id="competitors"
                      placeholder="Ej: www.restauranteejemplo.com - me gusta su menu digital..."
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
                    <Label htmlFor="colors">
                      Colores de tu marca o preferidos
                    </Label>
                    <Input
                      id="colors"
                      placeholder="Ej: Azul oscuro, dorado, blanco"
                      value={formData.colors}
                      onChange={(e) =>
                        setFormData({ ...formData, colors: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Si tienes logo, usaremos sus colores como base.
                    </p>
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
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                          Si hay paginas web que te gustan (no tienen que ser de
                          tu industria), compartelas en las notas finales. Nos
                          ayuda mucho a entender tu vision.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-3">
                    <Label>Que paginas necesitas?</Label>
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
                            onCheckedChange={() =>
                              handleFeatureToggle(feature.id)
                            }
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
                      Tienes contenido listo? (textos, fotos, logo)
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Ej: Tengo fotos del local y productos. El logo esta en formato PNG. Los textos los necesito que me ayuden a escribirlos..."
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">
                      Notas adicionales o instrucciones especiales
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Cualquier otra cosa que debamos saber sobre tu proyecto..."
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalNotes: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="rounded-xl bg-accent/10 border border-accent/20 p-4">
                    <p className="text-sm text-foreground">
                      Despues de enviar este brief, te contactaremos por WhatsApp
                      o email para coordinar el envio de archivos (logo, fotos,
                      etc.)
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
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}

                {step < totalSteps ? (
                  <Button onClick={() => setStep(step + 1)} className="flex-1">
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
