import type { Plan, PortfolioItem, FAQ, Testimonial } from './types';

export const plans: Plan[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Perfecta para presentar tu negocio o servicio con una pagina de alto impacto.',
    price: 299000,
    priceFormatted: '$299.000 COP',
    deliveryTime: '5-7 dias',
    revisions: 2,
    features: [
      'Diseno personalizado',
      '1 pagina optimizada',
      'Responsive (movil y escritorio)',
      'Formulario de contacto',
      'Optimizacion SEO basica',
      'Integracion WhatsApp',
      'Entrega en 5-7 dias',
      '2 revisiones incluidas',
    ],
  },
  {
    id: 'profesional',
    name: 'Web Profesional',
    description: 'Sitio web completo para negocios que necesitan multiples secciones.',
    price: 599000,
    priceFormatted: '$599.000 COP',
    deliveryTime: '10-14 dias',
    revisions: 3,
    popular: true,
    features: [
      'Diseno premium personalizado',
      'Hasta 5 paginas',
      'Responsive avanzado',
      'Blog integrado',
      'Galeria de proyectos',
      'SEO avanzado',
      'Integracion redes sociales',
      'Google Analytics',
      'Certificado SSL',
      'Entrega en 10-14 dias',
      '3 revisiones incluidas',
    ],
  },
  {
    id: 'ecommerce',
    name: 'Tienda Online',
    description: 'Tu tienda virtual completa para vender productos o servicios online.',
    price: 999000,
    priceFormatted: '$999.000 COP',
    deliveryTime: '15-20 dias',
    revisions: 4,
    features: [
      'Diseno e-commerce profesional',
      'Hasta 50 productos',
      'Carrito de compras',
      'Pasarela de pagos (PSE, tarjetas)',
      'Gestion de inventario',
      'Panel de administracion',
      'Integracion envios',
      'SEO para e-commerce',
      'Certificado SSL',
      'Soporte 30 dias',
      'Entrega en 15-20 dias',
      '4 revisiones incluidas',
    ],
  },
];

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
