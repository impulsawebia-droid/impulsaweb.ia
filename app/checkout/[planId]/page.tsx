"use client";

import { useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { plans } from "@/lib/data";

import {
  Check,
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const paymentMethods = [
  {
    id: "nequi",
    name: "Nequi",
    description: "Pago rápido con tu app Nequi",
    icon: Smartphone,
    instructions: "Número Nequi: 300 123 4567",
  },
  {
    id: "bancolombia",
    name: "Bancolombia",
    description: "Transferencia o depósito",
    icon: Building,
    instructions: "Cuenta Ahorros: 123-456789-00 | A nombre de: ImpulsaWeb SAS",
  },
  {
    id: "daviplata",
    name: "Daviplata",
    description: "Pago desde tu Daviplata",
    icon: Smartphone,
    instructions: "Número Daviplata: 300 123 4567",
  },
  {
    id: "card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    instructions: "Serás redirigido a nuestra pasarela de pagos segura",
  },
] as const;

type Step = "info" | "payment" | "confirm";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const router = useRouter();

  const plan = useMemo(() => plans.find((p) => p.id === planId), [planId]);

  const [step, setStep] = useState<Step>("info");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPayment = useMemo(
    () => paymentMethods.find((p) => p.id === paymentMethod),
    [paymentMethod]
  );

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Plan no encontrado</h1>
            <Link href="/servicios">
              <Button className="mt-4">Ver Planes</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);

    try {
      const orderPayload = {
        plan_id: plan.id,
        plan_name: plan.name,
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pay_method: paymentMethod,
        pay_type: "total",
        amount: plan.price,
        city: "", // opcional si luego lo pides
      };

      console.log("[checkout] Sending order:", orderPayload);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        console.error("[checkout] Order create error:", data);
        throw new Error(data?.error || "No se pudo crear la orden");
      }

      const createdOrderId =
        data?.order?.order_id || data?.order_id || data?.orderId || data?.id;

      if (!createdOrderId) {
        console.error("[checkout] Missing order_id in response:", data);
        throw new Error("No se recibió el order_id al crear la orden");
      }

      // (opcional) mostrar confirmación corta antes de redirigir
      setStep("confirm");

      setTimeout(() => {
        router.push(`/brief/${encodeURIComponent(createdOrderId)}`);
      }, 900);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Error al procesar el pedido. Por favor intenta de nuevo.");
      setIsProcessing(false);
      return;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a planes
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {step === "info" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          placeholder="Tu nombre completo"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Te enviaremos actualizaciones sobre tu proyecto a este email.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                        <Input
                          id="phone"
                          placeholder="+57 300 000 0000"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Continuar al Pago
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <label
                            key={method.id}
                            className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={method.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  <Icon className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>

                    {selectedPayment && (
                      <div className="rounded-xl bg-muted/50 p-4">
                        <p className="text-sm font-medium text-foreground mb-2">
                          Instrucciones de pago:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPayment.instructions}
                        </p>
                        {selectedPayment.id !== "card" && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Después de realizar el pago, te pediremos el comprobante
                            en el siguiente paso.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("info")}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        Atrás
                      </Button>
                      <Button
                        onClick={handlePaymentSubmit}
                        disabled={!paymentMethod || isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "confirm" && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-8 w-8" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-foreground">
                      ¡Pedido Confirmado!
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Gracias por tu compra, {formData.name.split(" ")[0] || "!"}
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Serás redirigido al formulario de brief para contarnos más sobre tu proyecto...
                    </p>
                    <div className="mt-6 animate-pulse">
                      <div className="mx-auto h-2 w-32 rounded-full bg-primary/20">
                        <div className="h-full w-1/2 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.deliveryTime} de entrega
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {plan.priceFormatted}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Incluye:</p>
                    <ul className="space-y-1.5">
                      {plan.features.slice(0, 5).map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-sm text-primary">
                          +{plan.features.length - 5} características más
                        </li>
                      )}
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">
                      {plan.priceFormatted}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Pago 100% seguro</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
