// app/panel/pedido/[orderId]/page.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

type OrderStatus = "pending_payment" | "paid" | "in_progress" | "review" | "completed";

type Order = {
  created_at?: string;
  order_id: string;
  plan_name: string;
  plan_id?: string;
  customer_name?: string;
  email: string;
  phone?: string;
  city?: string;
  pay_method?: string;
  pay_type?: string;
  amount?: string | number;
  status: string;
  notes?: string;
};

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType; description: string }
> = {
  pending_payment: {
    label: "Pendiente de Pago",
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
    description: "Esperando confirmación del pago.",
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
    description: "Nuestro equipo está trabajando en tu proyecto.",
  },
  review: {
    label: "En Revisión",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
    description: "Tu proyecto está listo para revisión. Te contactaremos pronto.",
  },
  completed: {
    label: "Completado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Tu proyecto ha sido entregado exitosamente!",
  },
};

const paymentMethodLabels: Record<string, string> = {
  nequi: "Nequi",
  bancolombia: "Bancolombia",
  daviplata: "Daviplata",
  card: "Tarjeta de Crédito/Débito",
};

const statusSteps: OrderStatus[] = ["pending_payment", "paid", "in_progress", "review", "completed"];

function normalizeStatus(s: string): OrderStatus {
  const v = (s || "").trim() as OrderStatus;
  return (v in statusConfig ? v : "pending_payment") as OrderStatus;
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { ok: false, error: text || "Invalid JSON" };
  }
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [brief, setBrief] = useState<any>(null);

  useEffect(() => {
    (async () => {
      // 1) Traer orden
      const res = await fetch(`/api/orders?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        setOrder(null);
        return;
      }

      const found = (data.orders || [])[0] as Order | undefined;
      if (!found) {
        setOrder(null);
        return;
      }

      setOrder(found);

      // 2) Traer brief
      const r2 = await fetch(`/api/brief?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const d2 = await safeJson(r2);
      if (r2.ok && d2?.ok) setBrief(d2.brief || null);
      else setBrief(null);
    })();
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Pedido no encontrado</h1>
            <p className="mt-2 text-muted-foreground">Verifica que el número de pedido sea correcto.</p>
            <Button className="mt-4" onClick={() => router.push("/panel")}>
              Ir a Mi Panel
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusKey = normalizeStatus(String(order.status || ""));
  const status = statusConfig[statusKey];
  const StatusIcon = status.icon;

  const createdDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const amountNumber =
    typeof order.amount === "number"
      ? order.amount
      : Number(String(order.amount || "0").replace(/[^\d]/g, "")) || 0;

  const currentStepIndex = statusSteps.indexOf(statusKey);

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
                <h1 className="text-2xl font-bold text-foreground">Pedido {order.order_id}</h1>
                <p className="mt-1 text-muted-foreground">Creado el {createdDate}</p>
              </div>
              <Badge className={`${status.color} text-sm py-1.5 px-3`}>
                <StatusIcon className="h-4 w-4 mr-1.5" />
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
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
                          <div key={stepStatus} className="relative flex items-start gap-4 pl-10">
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
                              <p className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                {stepConfig.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-muted-foreground mt-1">{stepConfig.description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                          <p className="font-medium">{brief.business_name || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tipo de negocio</p>
                          <p className="font-medium">{brief.business_type || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estilo</p>
                          <p className="font-medium">{brief.style || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Páginas</p>
                          <p className="font-medium">{brief.pages || "-"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
                      <p className="mt-3 font-medium text-foreground">Brief pendiente</p>
                      <p className="text-sm text-muted-foreground mt-1">Completa el brief para que podamos empezar.</p>
                      <Link href={`/brief/${order.order_id}`}>
                        <Button className="mt-4">Completar Brief</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                    <p className="font-semibold text-foreground">{order.plan_name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-2xl font-bold text-primary">${amountNumber.toLocaleString("es-CO")} COP</p>
                  </div>
                </CardContent>
              </Card>

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
                    <span>{order.customer_name || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{paymentMethodLabels[String(order.pay_method || "")] || String(order.pay_method || "-")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{createdDate}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    ¿Necesitas ayuda?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Si tienes preguntas sobre tu proyecto, contáctanos por WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/573001234567?text=Hola!%20Tengo%20una%20pregunta%20sobre%20mi%20pedido%20${order.order_id}`}
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
