// lib/types.ts
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "in_progress"
  | "review"
  | "completed";

export type PaymentMethod = "nequi" | "bancolombia" | "daviplata" | "card";

export type Order = {
  id: string;
  planId: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city?: string;
  paymentMethod: PaymentMethod;
  payType?: string;
  totalPrice: number;
  createdAt: string; // ISO
  status: OrderStatus;
  notes?: string;
  proofUrl?: string;
};

export type Brief = {
  order_id: string;
  created_at: string;

  business_name: string;
  business_type: string;
  target_audience: string;

  competitors?: string;

  colors: string;
  style: string;

  pages: string[];     // array
  features: string[];  // array

  has_content?: string; // texto
  notes?: string;       // texto
};
