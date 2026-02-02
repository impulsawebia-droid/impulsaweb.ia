import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Listo para impulsar tu negocio?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Comienza hoy y ten tu pagina web profesional lista en dias. Sin
            complicaciones, sin sorpresas.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/servicios">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-8"
              >
                Ver Planes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://wa.me/573001234567?text=Hola!%20Me%20interesa%20una%20pagina%20web"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
              >
                <MessageCircle className="h-4 w-4" />
                Escribenos por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
