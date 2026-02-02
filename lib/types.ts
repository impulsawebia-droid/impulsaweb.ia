export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFormatted: string;
  features: string[];
  popular?: boolean;
  deliveryTime: string;
  revisions: number;
}

export interface Order {
  id: string;
  planId: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending_payment' | 'paid' | 'in_progress' | 'review' | 'completed';
  paymentMethod: 'nequi' | 'bancolombia' | 'daviplata' | 'card';
  paymentProof?: string;
  briefCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
}

export interface Brief {
  orderId: string;
  businessName: string;
  businessType: string;
  targetAudience: string;
  competitors: string;
  colors: string;
  style: string;
  pages: string[];
  features: string[];
  content: string;
  logo?: string;
  additionalNotes: string;
  submittedAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  url?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}
