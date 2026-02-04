import type { Plan, PortfolioItem, FAQ, Testimonial } from './types';

// lib/data.ts
export const plans = [
  {
    id: "landing",
    name: "Landing Page",
    price: 299000,
    priceFormatted: "$299.000 COP",
    deliveryTime: "5-7 días",
    features: [
      "Diseño personalizado",
      "1 pagina optimizada",
      "Responsive (movil y escritorio)",
      "Formulario de contacto",
      "Optimización SEO básica",
      "Integración WhatsApp",
      "2 revisiones incluidas",
    ],

    // ✅ Solo opciones permitidas para este plan:
    allowedPages: ["inicio", "servicios", "portafolio", "contacto", "faq"],
    allowedFeatures: ["whatsapp", "formulario_contacto", "mapa", "newsletter"],
    limits: { maxPages: 5 },
  },

  {
    id: "web",
    name: "Web Profesional",
    price: 599000,
    priceFormatted: "$599.000 COP",
    deliveryTime: "10-14 días",
    features: [
      "Diseño premium personalizado",
      "Hasta 5 páginas",
      "Responsive avanzado",
      "Blog integrado",
      "Galería de proyectos",
      "SEO avanzado",
      "Certificado SSL",
      "3 revisiones incluidas",
    ],

    allowedPages: [
      "inicio",
      "nosotros",
      "servicios",
      "portafolio",
      "blog",
      "contacto",
      "faq",
      "testimonios",
    ],
    allowedFeatures: [
      "whatsapp",
      "formulario_contacto",
      "mapa",
      "newsletter",
      "galeria",
      "chat_en_vivo",
    ],
    limits: { maxPages: 8 },
  },

  {
    id: "tienda",
    name: "Tienda Online",
    price: 999000,
    priceFormatted: "$999.000 COP",
    deliveryTime: "15-20 días",
    features: [
      "Diseño e-commerce profesional",
      "Hasta 50 productos",
      "Carrito de compras",
      "Pasarela de pagos (PSE, tarjetas)",
      "Gestión de inventario",
      "Panel de administración",
      "Integración envíos",
      "Soporte 30 días",
    ],

    allowedPages: [
      "inicio",
      "productos",
      "categoria",
      "carrito",
      "checkout",
      "contacto",
      "faq",
      "politicas",
    ],
    allowedFeatures: [
      "whatsapp",
      "formulario_contacto",
      "mapa",
      "newsletter",
      "pasarela_pagos",
      "carrito",
      "envios",
      "inventario",
    ],
    limits: { maxPages: 10 },
  },
] as const;

export type Plan = (typeof plans)[number];


export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Restaurante El Sabor',
    category: 'Landing Page',
    image: '/portfolio/restaurant.jpg',
    description: 'Landing page para restaurante con reservas online y menu digital.',
  },
  {
    id: '2',
    title: 'Clinica Dental Sonrisas',
    category: 'Web Profesional',
    image: '/portfolio/dental.jpg',
    description: 'Sitio web completo con sistema de citas y galeria de tratamientos.',
  },
  {
    id: '3',
    title: 'Moda Urbana Store',
    category: 'Tienda Online',
    image: '/portfolio/fashion.jpg',
    description: 'E-commerce de ropa con mas de 200 productos y envios nacionales.',
  },
  {
    id: '4',
    title: 'Inmobiliaria Premium',
    category: 'Web Profesional',
    image: '/portfolio/realestate.jpg',
    description: 'Portal inmobiliario con busqueda avanzada y tour virtual.',
  },
  {
    id: '5',
    title: 'Gimnasio FitLife',
    category: 'Landing Page',
    image: '/portfolio/gym.jpg',
    description: 'Landing page con planes de membresia y reserva de clases.',
  },
  {
    id: '6',
    title: 'Artesanias Colombia',
    category: 'Tienda Online',
    image: '/portfolio/crafts.jpg',
    description: 'Tienda online de artesanias con envios internacionales.',
  },
];

export const faqs: FAQ[] = [
  {
    question: 'Cuanto tiempo toma crear mi pagina web?',
    answer: 'El tiempo depende del plan elegido. Una Landing Page toma entre 5-7 dias, una Web Profesional entre 10-14 dias, y una Tienda Online entre 15-20 dias habiles. Estos tiempos pueden variar segun la complejidad y la rapidez con que nos envies el contenido.',
  },
  {
    question: 'Que necesito para empezar?',
    answer: 'Solo necesitas completar nuestro formulario de brief despues del pago. Ahi nos cuentas sobre tu negocio, que colores te gustan, que paginas necesitas y cualquier contenido (textos, fotos, logo) que tengas. Si no tienes contenido, podemos ayudarte a crearlo.',
  },
  {
    question: 'Incluyen hosting y dominio?',
    answer: 'El precio incluye el diseno y desarrollo de tu sitio. El hosting tiene un costo adicional de $150.000 COP/ano y el dominio desde $80.000 COP/ano. Te ayudamos con la configuracion completa.',
  },
  {
    question: 'Puedo hacer cambios despues de entregado?',
    answer: 'Si, cada plan incluye un numero de revisiones. Cambios adicionales tienen un costo segun la complejidad. Tambien ofrecemos planes de mantenimiento mensual desde $99.000 COP.',
  },
  {
    question: 'Como es el proceso de pago?',
    answer: 'Aceptamos Nequi, Bancolombia, Daviplata y tarjetas de credito/debito. Para iniciar el proyecto requerimos el 50% de anticipo y el 50% restante al entregar. El pago es 100% seguro.',
  },
  {
    question: 'Que pasa si no me gusta el diseno?',
    answer: 'Antes de empezar a desarrollar, te enviamos una propuesta de diseno para tu aprobacion. Si no te gusta, hacemos ajustes hasta que estes satisfecho. Tu opinion es fundamental en todo el proceso.',
  },
  {
    question: 'Ofrecen soporte despues de la entrega?',
    answer: 'Si, todos los planes incluyen soporte gratuito por un periodo despues de la entrega (7 dias para Landing, 15 dias para Web Profesional, 30 dias para Tienda Online). Despues puedes contratar soporte mensual.',
  },
  {
    question: 'Mi pagina sera visible en Google?',
    answer: 'Si, todas nuestras paginas incluyen optimizacion SEO. Configuramos meta tags, estructura correcta, velocidad optimizada y te registramos en Google Search Console para que tu pagina aparezca en los resultados de busqueda.',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Fernanda Lopez',
    company: 'Boutique Eleganza',
    content: 'Increible trabajo! Mi tienda online quedo hermosa y ya estoy vendiendo mucho mas que antes. El equipo fue muy profesional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Carlos Andres Mejia',
    company: 'Consultoria Mejia & Asociados',
    content: 'Nuestra pagina web nos ha traido muchos clientes nuevos. Muy satisfecho con el resultado y la atencion al cliente.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Laura Patricia Garcia',
    company: 'Restaurante Sabores de Casa',
    content: 'La landing page quedo espectacular. Ahora recibimos reservas online y nuestros clientes pueden ver el menu antes de llegar.',
    rating: 5,
  },
];

export const processSteps = [
  {
    step: 1,
    title: 'Elige tu Plan',
    description: 'Selecciona el plan que mejor se adapte a las necesidades de tu negocio.',
    icon: 'package',
  },
  {
    step: 2,
    title: 'Realiza el Pago',
    description: 'Paga de forma segura con Nequi, Bancolombia, Daviplata o tarjeta.',
    icon: 'credit-card',
  },
  {
    step: 3,
    title: 'Completa el Brief',
    description: 'Cuentanos sobre tu negocio, preferencias y objetivos en nuestro formulario.',
    icon: 'clipboard',
  },
  {
    step: 4,
    title: 'Diseno y Desarrollo',
    description: 'Nuestro equipo crea tu pagina web con dedicacion y atencion al detalle.',
    icon: 'code',
  },
  {
    step: 5,
    title: 'Revision y Ajustes',
    description: 'Te presentamos el resultado para tu aprobacion y hacemos ajustes si es necesario.',
    icon: 'check-circle',
  },
  {
    step: 6,
    title: 'Entrega Final',
    description: 'Tu pagina web queda lista y publicada para que el mundo la vea!',
    icon: 'rocket',
  },
];

export const benefits = [
  {
    title: 'Diseno Profesional',
    description: 'Cada sitio es unico, disenado especialmente para tu marca y objetivos de negocio.',
    icon: 'palette',
  },
  {
    title: '100% Responsive',
    description: 'Tu pagina se vera perfecta en celulares, tablets y computadores.',
    icon: 'smartphone',
  },
  {
    title: 'Optimizado para SEO',
    description: 'Configuramos tu sitio para que aparezca en Google y atraigas mas clientes.',
    icon: 'search',
  },
  {
    title: 'Soporte Incluido',
    description: 'Te acompanamos durante y despues del proyecto para resolver cualquier duda.',
    icon: 'headphones',
  },
  {
    title: 'Entrega Rapida',
    description: 'Cumplimos con los tiempos establecidos para que puedas lanzar tu negocio pronto.',
    icon: 'zap',
  },
  {
    title: 'Precios Justos',
    description: 'Calidad profesional a precios accesibles para emprendedores colombianos.',
    icon: 'tag',
  },
];
