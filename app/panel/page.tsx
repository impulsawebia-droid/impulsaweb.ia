"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
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

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending_payment: { label: "Pendiente de Pago", color: "bg-amber-100 text-amber-800", icon: Clock },
  paid: { label: "Pago Recibido", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  in_progress: { label: "En Desarrollo", color: "bg-purple-100 text-purple-800", icon: Sparkles },
  review: { label: "En Revision", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  completed: { label: "Completado", color: "bg-green-100 text-green-800", icon: CheckCircle },
};

function mapApiOrderToUi(o: any): Order {
  return {
    id: String(o.order_id || ""),
    planId: String(o.plan_id || ""),
    planName: String(o.plan_name || ""),
    customerName: String(o.customer_name || ""),
    customerEmail: String(o.email || ""),
    customerPhone: String(o.phone || ""),
    city: String(o.city || ""),
    paymentMethod: (String(o.pay_method || "nequi") as any),
    payType: String(o.pay_type || ""),
    totalPrice: Number(o.amount || 0),
    createdAt: String(o.created_at || new Date().toISOString()),
    status: (String(o.status || "pending_payment") as any),
    notes: String(o.notes || ""),
    proofUrl: String(o.proof_url || ""),
  };
}

function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const createdDate = new Date(order.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{order.planName}</CardTitle>
            <CardDescription className="mt-1">Pedido: {order.id}</CardDescription>
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
            <p className="font-medium">${order.totalPrice.toLocaleString("es-CO")} COP</p>
          </div>
        </div>

        <Separator />

        {/* Aquí NO hacemos fetch del brief para no disparar muchos requests.
           El detalle del pedido sí lo valida y muestra. */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Estado del Brief:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>Verificar en detalles</span>
            </div>
            <Link href={`/brief/${order.id}`}>
              <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                Completar
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link href={`/panel/pedido/${order.id}`}>
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
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const isEmail = useMemo(() => searchValue.includes("@"), [searchValue]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const q = searchValue.trim();
      const url = q
        ? isEmail
          ? `/api/orders?email=${encodeURIComponent(q)}`
          : `/api/orders?order_id=${encodeURIComponent(q)}`
        : `/api/orders`;

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        console.error("orders fetch failed:", data);
        setOrders([]);
        setHasSearched(true);
        setIsSearching(false);
        return;
      }

      const mapped = (data.orders || []).map(mapApiOrderToUi);
      setOrders(mapped);
      setHasSearched(true);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
      setOrders([]);
      setHasSearched(true);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // No cargamos automáticamente todos los pedidos en producción.
    // El usuario debe buscar por email o pedido.
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mi Panel</h1>
            <p className="mt-2 text-muted-foreground">Consulta el estado de tus pedidos y proyectos.</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Buscar Pedido</CardTitle>
              <CardDescription>Ingresa tu email o número de pedido para ver tus proyectos.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Email o numero de pedido
                  </Label>
                  <Input
                    id="search"
                    placeholder="tu@email.com o IW-XXXXX"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {hasSearched && (
            <>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Tus Pedidos ({orders.length})</h2>
                  </div>

                  <div className="grid gap-6">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">No encontramos pedidos</h3>
                    <p className="mt-2 text-muted-foreground">
                      No hay pedidos asociados a este email o número de pedido.
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
                <h3 className="mt-6 text-lg font-semibold text-foreground">Busca tu pedido</h3>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                  Ingresa el email que usaste al comprar o el número de pedido que te enviamos para ver el estado.
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
