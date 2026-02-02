"use client";

import React from "react"

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { plans } from "@/lib/data";
import { saveOrder, generateOrderId } from "@/lib/store";
import type { Order } from "@/lib/types";
import {
  Check,
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  {
    id: "nequi",
    name: "Nequi",
    description: "Pago rapido con tu app Nequi",
    icon: Smartphone,
    instructions: "Numero Nequi: 300 123 4567",
  },
  {
    id: "bancolombia",
    name: "Bancolombia",
    description: "Transferencia o deposito",
    icon: Building,
    instructions: "Cuenta Ahorros: 123-456789-00 | A nombre de: ImpulsaWeb SAS",
  },
  {
    id: "daviplata",
    name: "Daviplata",
    description: "Pago desde tu Daviplata",
    icon: Smartphone,
    instructions: "Numero Daviplata: 300 123 4567",
  },
  {
    id: "card",
    name: "Tarjeta de Credito/Debito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    instructions: "Seras redirigido a nuestra pasarela de pagos segura",
  },
];

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const router = useRouter();
  const plan = plans.find((p) => p.id === planId);

  const [step, setStep] = useState<"info" | "payment" | "confirm">("info");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

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

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order: Order = {
      id: generateOrderId(),
      planId: plan.id,
      planName: plan.name,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      status: "pending_payment",
      paymentMethod: paymentMethod as Order["paymentMethod"],
      briefCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalPrice: plan.price,
    };

    saveOrder(order);
    setIsProcessing(false);
    setStep("confirm");

    // Redirigir al brief despues de 3 segundos
    setTimeout(() => {
      router.push(`/brief/${order.id}`);
    }, 3000);
  };

  const selectedPayment = paymentMethods.find((p) => p.id === paymentMethod);

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
                    <CardTitle>Informacion de Contacto</CardTitle>
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
                          Te enviaremos actualizaciones sobre tu proyecto a este
                          email.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefono / WhatsApp</Label>
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
                    <CardTitle>Metodo de Pago</CardTitle>
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
                            <RadioGroupItem
                              value={method.id}
                              className="mt-1"
                            />
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
                            Despues de realizar el pago, te pediremos el
                            comprobante en el siguiente paso.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep("info")}
                        className="flex-1"
                      >
                        Atras
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
                      Pedido Confirmado!
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Gracias por tu compra, {formData.name.split(" ")[0]}!
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Seras redirigido al formulario de brief para contarnos mas
                      sobre tu proyecto...
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
                    <p className="text-sm font-medium text-foreground">
                      Incluye:
                    </p>
                    <ul className="space-y-1.5">
                      {plan.features.slice(0, 5).map((feature, i) => (
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
                          +{plan.features.length - 5} caracteristicas mas
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
