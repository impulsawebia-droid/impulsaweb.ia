import Link from "next/link";
import { Rocket, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  servicios: [
    { name: "Landing Page", href: "/servicios#landing" },
    { name: "Web Profesional", href: "/servicios#profesional" },
    { name: "Tienda Online", href: "/servicios#ecommerce" },
  ],
  empresa: [
    { name: "Proceso", href: "/proceso" },
    { name: "Portafolio", href: "/portafolio" },
    { name: "FAQ", href: "/faq" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Términos y Condiciones", href: "/politicas/terminos" },
    { name: "Política de Privacidad", href: "/politicas/privacidad" },
    { name: "Política de Servicio", href: "/politicas/servicio" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Rocket className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                ImpulsaWeb
              </span>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Creamos páginas web profesionales que impulsan tu negocio en
              Colombia.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="mailto:hola@impulsaweb.co"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                hola@impulsaweb.co
              </a>

              <a
                href="tel:+573001234567"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                +57 300 123 4567
              </a>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Bogotá, Colombia
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Servicios</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ImpulsaWeb. Todos los derechos
            reservados. Hecho con amor en Colombia.
          </p>
        </div>
      </div>
    </footer>
  );
}
