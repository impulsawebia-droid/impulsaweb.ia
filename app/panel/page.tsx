// app/panel/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";

type Order = {
  created_at: string;
  order_id: string;
  plan_id: string;
  plan_name: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  pay_method: string;
  pay_type: string;
  amount: number;
  status: "pending_payment" | "paid" | "in_progress" | "review" | "completed";
  notes: string;
};

const statusConfig: Record<
  Order["status"],
  { label: string; color: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: "Pendiente de Pago",
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
  },
  paid: {
    label: "Pago Recibido",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  in_progress: {
    label: "En Desarrollo",
    color: "bg-purple-100 text-purple-800",
    icon: Sparkles,
  },
  review: {
    label: "En Revisión",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  completed: {
    label: "Completado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
};

function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.status] || statusConfig.pending_payment;
  const StatusIcon = status.icon;

  const createdDate = new Date(order.created_at).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{order.plan_name}</CardTitle>
            <CardDescription className="mt-1">
              Pedido: {order.order_id}
            </CardDescription>
          </div>
          <Badge className={status.color}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Fecha del pedido</p>
            <p className="font-medium">{createdDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">
              ${Number(order.amount || 0).toLocaleString("es-CO")} COP
            </p>
          </div>
        </div>

        <Separator />

        <div className="pt-2">
          <Link href={`/panel/pedido/${order.order_id}`}>
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PanelPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmail = (v: string) => v.includes("@") && v.includes(".");
  const isOrderId = (v: string) => v.toUpperCase().startsWith("IW-");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);

    try {
      const q = query.trim();

      const url = new URL("/api/orders", window.location.origin);

      if (q) {
        if (isEmail(q)) url.searchParams.set("email", q);
        else if (isOrderId(q)) url.searchParams.set("order_id", q.toUpperCase());
        else {
          // si escribe algo raro, intentamos como order_id parcial (no recomendado)
          url.searchParams.set("order_id", q);
        }
      }

      const res = await fetch(url.toString(), { method: "GET" });

      // ✅ si algo falla, lee texto primero (evita "Unexpected end of JSON")
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Error consultando pedidos (${res.status})`);
      }

      setOrders(data.orders || []);
      setHasSearched(true);
    } catch (err: any) {
      setOrders([]);
      setHasSearched(true);
      setError(err?.message || "Error consultando pedidos");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi Panel</h1>
            <p className="mt-2 text-muted-foreground">
              Consulta el estado de tus pedidos y proyectos.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Buscar Pedido</CardTitle>
              <CardDescription>
                Ingresa tu email o tu número de pedido (IW-XXXXXX) para ver tus proyectos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Email o número de pedido
                  </Label>
                  <Input
                    id="search"
                    placeholder="tu@email.com o IW-XXXXXX"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </form>

              {error && (
                <p className="mt-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {hasSearched && (
            <>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Tus Pedidos ({orders.length})
                    </h2>
                  </div>

                  <div className="grid gap-6">
                    {orders.map((order) => (
                      <OrderCard key={order.order_id} order={order} />
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      No encontramos pedidos
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      No hay pedidos asociados a ese dato.
                    </p>
                    <Link href="/servicios">
                      <Button className="mt-6">Ver Planes</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!hasSearched && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  Busca tu pedido
                </h3>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                  Ingresa el email que usaste al comprar o el número de pedido para ver el estado.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
