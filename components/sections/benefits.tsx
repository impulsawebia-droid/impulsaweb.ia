import React from "react"
import {
  Palette,
  Smartphone,
  Search,
  Headphones,
  Zap,
  Tag,
} from "lucide-react";
import { benefits } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  palette: Palette,
  smartphone: Smartphone,
  search: Search,
  headphones: Headphones,
  zap: Zap,
  tag: Tag,
};

export function Benefits() {
  return (
    <section className="bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Por que elegir ImpulsaWeb?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nos enfocamos en lo que realmente importa: que tu pagina web genere
            resultados para tu negocio.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || Zap;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
