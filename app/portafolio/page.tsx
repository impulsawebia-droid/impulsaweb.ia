"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta";
import { portfolioItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Layers } from "lucide-react";

const categories = ["Todos", "Landing Page", "Web Profesional", "Tienda Online"];

export default function PortafolioPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredItems =
    activeCategory === "Todos"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Nuestro Portafolio
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Algunos de los proyectos que hemos creado para negocios como el tuyo.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                      <Layers className="h-16 w-16 text-primary/20" />
                    </div>
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                      >
                        Ver Proyecto
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {item.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  No hay proyectos en esta categoria todavia.
                </p>
              </div>
            )}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
