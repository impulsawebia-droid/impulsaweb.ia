import React from "react"
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta";
import { processSteps } from "@/lib/data";
import {
  Package,
  CreditCard,
  ClipboardList,
  Code,
  CheckCircle,
  Rocket,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  "credit-card": CreditCard,
  clipboard: ClipboardList,
  code: Code,
  "check-circle": CheckCircle,
  rocket: Rocket,
};

export default function ProcesoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Como Trabajamos
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Un proceso simple y transparente para que tengas tu pagina web
                lista sin complicaciones.
              </p>
            </div>

            <div className="mt-16 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block -translate-x-1/2" />

              <div className="space-y-12 lg:space-y-0">
                {processSteps.map((step, index) => {
                  const Icon = iconMap[step.icon] || CheckCircle;
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={step.step}
                      className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                        index > 0 ? "lg:mt-16" : ""
                      }`}
                    >
                      <div
                        className={`${isEven ? "lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}
                      >
                        <div
                          className={`flex items-start gap-6 ${
                            !isEven ? "lg:flex-row-reverse lg:text-right" : ""
                          }`}
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-primary">
                                Paso {step.step}
                              </span>
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-foreground">
                              {step.title}
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-1/2 top-4 hidden lg:block -translate-x-1/2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {step.step}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-12">
                Que necesitas para empezar?
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Informacion basica
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- Nombre de tu negocio o marca</li>
                    <li>- Descripcion de tus productos/servicios</li>
                    <li>- Datos de contacto</li>
                    <li>- Redes sociales (si tienes)</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Contenido visual
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- Logo (si tienes, si no podemos ayudarte)</li>
                    <li>- Fotos de productos o servicios</li>
                    <li>- Colores que te gustan</li>
                    <li>- Ejemplos de paginas que te inspiran</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Objetivos claros
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- Que quieres lograr con tu pagina</li>
                    <li>- Quien es tu cliente ideal</li>
                    <li>- Que accion quieres que tomen los visitantes</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    No te preocupes si...
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>- No tienes logo, te ayudamos a crearlo</li>
                    <li>- No tienes fotos, usamos bancos de imagenes</li>
                    <li>- No sabes que escribir, te guiamos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
