import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Plan } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  featured?: boolean;
}

export function PlanCard({ plan, featured }: PlanCardProps) {
  const isPopular = plan.popular || featured;

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all duration-300 hover:shadow-lg",
        isPopular && "border-primary shadow-md scale-[1.02]"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1">
            <Sparkles className="h-3 w-3" />
            Mas Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pt-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm mt-2">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-foreground">
            {plan.priceFormatted}
          </span>
          <p className="text-sm text-muted-foreground mt-1">pago unico</p>
        </div>

        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/checkout/${plan.id}`} className="w-full">
          <Button
            className="w-full"
            variant={isPopular ? "default" : "outline"}
            size="lg"
          >
            Elegir Plan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
