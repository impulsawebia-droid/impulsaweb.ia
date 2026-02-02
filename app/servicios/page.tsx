import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlanCard } from "@/components/plan-card";
import { plans } from "@/lib/data";
import { Check, X, HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CTA } from "@/components/sections/cta";

const comparisonFeatures = [
  {
    feature: "Paginas incluidas",
    landing: "1",
    profesional: "Hasta 5",
    ecommerce: "Ilimitadas",
  },
  {
    feature: "Diseno personalizado",
    landing: true,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Responsive (moviles)",
    landing: true,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Formulario de contacto",
    landing: true,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "SEO basico",
    landing: true,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "SEO avanzado",
    landing: false,
    profesional: true,
    ecommerce: true,
    tooltip: "Incluye optimizacion de velocidad, schema markup y sitemap XML",
  },
  {
    feature: "Blog integrado",
    landing: false,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Galeria/Portafolio",
    landing: false,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Google Analytics",
    landing: false,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Integracion WhatsApp",
    landing: true,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Redes sociales",
    landing: false,
    profesional: true,
    ecommerce: true,
  },
  {
    feature: "Certificado SSL",
    landing: false,
    profesional: true,
    ecommerce: true,
    tooltip: "Conexion segura HTTPS para proteger los datos de tus visitantes",
  },
  {
    feature: "Carrito de compras",
    landing: false,
    profesional: false,
    ecommerce: true,
  },
  {
    feature: "Pasarela de pagos",
    landing: false,
    profesional: false,
    ecommerce: true,
    tooltip: "PSE, tarjetas de credito/debito, Nequi, Daviplata",
  },
  {
    feature: "Gestion de inventario",
    landing: false,
    profesional: false,
    ecommerce: true,
  },
  {
    feature: "Panel de administracion",
    landing: false,
    profesional: false,
    ecommerce: true,
  },
  { feature: "Productos", landing: "-", profesional: "-", ecommerce: "50" },
  {
    feature: "Revisiones",
    landing: "2",
    profesional: "3",
    ecommerce: "4",
  },
  {
    feature: "Tiempo de entrega",
    landing: "5-7 dias",
    profesional: "10-14 dias",
    ecommerce: "15-20 dias",
  },
  {
    feature: "Soporte post-entrega",
    landing: "7 dias",
    profesional: "15 dias",
    ecommerce: "30 dias",
  },
];

function FeatureValue({ value, tooltip }: { value: boolean | string; tooltip?: string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-accent mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
    );
  }
  return <span className="text-foreground font-medium">{value}</span>;
}

export default function ServiciosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Nuestros Planes
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Soluciones web profesionales para cada etapa de tu negocio. Elige el plan
                que mejor se adapte a tus necesidades.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} id={plan.id}>
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Compara los planes
              </h2>
              <p className="mt-4 text-muted-foreground">
                Revisa en detalle lo que incluye cada plan para tomar la mejor decision.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-background">
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[280px] font-semibold text-foreground">
                        Caracteristica
                      </TableHead>
                      <TableHead className="text-center font-semibold text-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <span>Landing Page</span>
                          <span className="text-primary font-bold">$299.000</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-foreground bg-primary/5">
                        <div className="flex flex-col items-center gap-1">
                          <span>Web Profesional</span>
                          <span className="text-primary font-bold">$599.000</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold text-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <span>Tienda Online</span>
                          <span className="text-primary font-bold">$999.000</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonFeatures.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {item.feature}
                            {item.tooltip && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{item.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <FeatureValue value={item.landing} />
                        </TableCell>
                        <TableCell className="text-center bg-primary/5">
                          <FeatureValue value={item.profesional} />
                        </TableCell>
                        <TableCell className="text-center">
                          <FeatureValue value={item.ecommerce} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
