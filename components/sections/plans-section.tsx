import { plans } from "@/lib/data";
import { PlanCard } from "@/components/plan-card";

export function PlansSection() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Planes para cada necesidad
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elige el plan que mejor se adapte a tu negocio. Todos incluyen
            diseno personalizado y soporte.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Necesitas algo diferente?{" "}
            <a
              href="/contacto"
              className="font-medium text-primary hover:underline"
            >
              Contactanos para un presupuesto personalizado
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
