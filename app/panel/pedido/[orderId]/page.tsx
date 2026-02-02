"use client";

import React from "react"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrderById, getBriefByOrderId } from "@/lib/store";
import { plans } from "@/lib/data";
import type { Order, Brief } from "@/lib/types";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  MessageCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
} from "lucide-react";

const statusConfig: Record<
  Order["status"],
  { label: string; color: string; icon: React.ElementType; description: string }
> = {
  pending_payment: {
    label: "Pendiente de Pago",
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
    description: "Esperando confirmacion del pago.",
  },
  paid: {
    label: "Pago Recibido",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Tu pago ha sido confirmado. Iniciaremos el proyecto pronto.",
  },
  in_progress: {
    label: "En Desarrollo",
    color: "bg-purple-100 text-purple-800",
    icon: Sparkles,
    description: "Nuestro equipo esta trabajando en tu proyecto.",
  },
  review: {
    label: "En Revision",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
    description: "Tu proyecto esta listo para revision. Te contactaremos pronto.",
  },
  completed: {
    label: "Completado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Tu proyecto ha sido entregado exitosamente!",
  },
};

const paymentMethodLabels: Record<Order["paymentMethod"], string> = {
  nequi: "Nequi",
  bancolombia: "Bancolombia",
  daviplata: "Daviplata",
  card: "Tarjeta de Credito/Debito",
};

const statusSteps: Order["status"][] = [
  "pending_payment",
  "paid",
  "in_progress",
  "review",
  "completed",
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);

  useEffect(() => {
    const orderData = getOrderById(orderId);
    if (orderData) {
      setOrder(orderData);
      const briefData = getBriefByOrderId(orderId);
      if (briefData) {
        setBrief(briefData);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Pedido no encontrado</h1>
            <p className="mt-2 text-muted-foreground">
              Verifica que el numero de pedido sea correcto.
            </p>
            <Button className="mt-4" onClick={() => router.push("/panel")}>
              Ir a Mi Panel
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const plan = plans.find((p) => p.id === order.planId);
  const currentStepIndex = statusSteps.indexOf(order.status);

  const createdDate = new Date(order.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/panel"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mi Panel
          </Link>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Pedido {order.id}
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Creado el {createdDate}
                </p>
              </div>
              <Badge className={`${status.color} text-sm py-1.5 px-3`}>
                <StatusIcon className="h-4 w-4 mr-1.5" />
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progreso del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {statusSteps.map((stepStatus, index) => {
                        const stepConfig = statusConfig[stepStatus];
                        const StepIcon = stepConfig.icon;
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                          <div
                            key={stepStatus}
                            className="relative flex items-start gap-4 pl-10"
                          >
                            <div
                              className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                                isCompleted
                                  ? isCurrent
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <StepIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {stepConfig.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {stepConfig.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brief Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Brief del Proyecto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {brief ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-accent">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Brief completado</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Nombre del negocio</p>
                          <p className="font-medium">{brief.businessName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tipo de negocio</p>
                          <p className="font-medium">{brief.businessType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estilo preferido</p>
                          <p className="font-medium capitalize">{brief.style}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Paginas seleccionadas</p>
                          <p className="font-medium">{brief.pages.length} paginas</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
                      <p className="mt-3 font-medium text-foreground">
                        Brief pendiente
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completa el brief para que podamos empezar tu proyecto.
                      </p>
                      <Link href={`/brief/${order.id}`}>
                        <Button className="mt-4">Completar Brief</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Plan</p>
                    <p className="font-semibold text-foreground">{order.planName}</p>
                  </div>
                  {plan && (
                    <div>
                      <p className="text-muted-foreground text-sm">Tiempo de entrega</p>
                      <p className="font-medium">{plan.deliveryTime}</p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      ${order.totalPrice.toLocaleString("es-CO")} COP
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Tus Datos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{paymentMethodLabels[order.paymentMethod]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{createdDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Necesitas ayuda?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Si tienes preguntas sobre tu proyecto, contactanos por WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/573001234567?text=Hola!%20Tengo%20una%20pregunta%20sobre%20mi%20pedido%20${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full mt-4 gap-2 bg-transparent" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                      Escribir por WhatsApp
                    </Button>
                  </a>
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
