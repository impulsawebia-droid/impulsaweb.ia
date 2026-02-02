import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta";
import { faqs } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Preguntas Frecuentes
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Resolvemos tus dudas mas comunes. Si no encuentras lo que buscas,
                contactanos.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-16 mx-auto max-w-xl text-center">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="text-xl font-semibold text-foreground">
                  Tienes mas preguntas?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Estamos aqui para ayudarte. Contactanos y resolvemos todas tus
                  dudas sin compromiso.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contacto">
                    <Button>Contactar</Button>
                  </Link>
                  <a
                    href="https://wa.me/573001234567?text=Hola!%20Tengo%20una%20pregunta%20sobre%20sus%20servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
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
