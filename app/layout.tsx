import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: 'ImpulsaWeb | Diseno Web Profesional para tu Negocio en Colombia',
  description: 'Creamos paginas web profesionales que impulsan tu negocio. Planes desde $299.000 COP. Diseno moderno, optimizado para moviles y listo para vender.',
  keywords: ['diseno web', 'paginas web', 'Colombia', 'landing page', 'tienda online', 'ecommerce'],
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
