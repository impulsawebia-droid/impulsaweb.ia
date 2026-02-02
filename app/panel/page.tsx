"use client";

import React from "react"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrders, getBriefByOrderId } from "@/lib/store";
import type { Order } from "@/lib/types";
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
    label: "En Revision",
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
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const brief = getBriefByOrderId(order.id);
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
            <CardDescription className="mt-1">
              Pedido: {order.id}
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
              ${order.totalPrice.toLocaleString("es-CO")} COP
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Estado del Brief:</p>
          {brief ? (
            <div className="flex items-center gap-2 text-sm text-accent">
              <CheckCircle className="h-4 w-4" />
              <span>Brief completado</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Brief pendiente</span>
              </div>
              <Link href={`/brief/${order.id}`}>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  Completar
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
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
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Load all orders initially for demo
    const allOrders = getOrders();
    if (allOrders.length > 0) {
      setOrders(allOrders);
      setHasSearched(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      const allOrders = getOrders();
      const filtered = searchEmail
        ? allOrders.filter(
            (o) =>
              o.customerEmail.toLowerCase() === searchEmail.toLowerCase() ||
              o.id.toLowerCase().includes(searchEmail.toLowerCase())
          )
        : allOrders;
      setOrders(filtered);
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
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
                Ingresa tu email o numero de pedido para ver tus proyectos.
              </CardDescription>
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
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
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
                    <h2 className="text-xl font-semibold text-foreground">
                      Tus Pedidos ({orders.length})
                    </h2>
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
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      No encontramos pedidos
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      No hay pedidos asociados a este email o numero de pedido.
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
                  Ingresa el email que usaste al comprar o el numero de pedido
                  que te enviamos para ver el estado de tu proyecto.
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
