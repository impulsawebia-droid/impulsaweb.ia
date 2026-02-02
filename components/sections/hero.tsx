import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const highlights = [
  "Diseno 100% personalizado",
  "Optimizado para moviles",
  "Entrega en tiempo record",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Mas de 100 negocios impulsados en Colombia</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tu pagina web profesional{" "}
            <span className="text-primary">lista para vender</span>
          </h1>

          <p className="mt-6 text-pretty text-lg text-muted-foreground lg:text-xl">
            Creamos sitios web que convierten visitantes en clientes. Diseno
            moderno, optimizado para Google y pensado para hacer crecer tu
            negocio en Colombia.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/servicios">
              <Button size="lg" className="gap-2 px-8">
                Ver Planes y Precios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/portafolio">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Ver Portafolio
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Desde <span className="font-semibold text-foreground">$299.000 COP</span> - Sin costos ocultos
          </p>
        </div>
      </div>
    </section>
  );
}
