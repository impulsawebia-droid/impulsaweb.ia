import type { ReactNode } from "react";
import Link from "next/link";

export default function PoliticasLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Políticas de ImpulsaWeb</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Información legal, privacidad y condiciones del servicio.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
            href="/politicas/terminos"
          >
            Términos
          </Link>
          <Link
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
            href="/politicas/privacidad"
          >
            Privacidad
          </Link>
          <Link
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
            href="/politicas/servicio"
          >
            Servicio
          </Link>
        </div>
      </div>

      {/* Si no tienes Tailwind Typography, igual funciona; solo se verá sin estilos "prose" */}
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        {children}
      </article>
    </main>
  );
}
