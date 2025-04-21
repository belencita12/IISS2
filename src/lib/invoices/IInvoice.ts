import { Product } from "@/lib/products/IProducts";

export interface Invoice {
  id: number;
  ruc: string;
  clientName: string;
  invoiceNumber: string;
  stamped: string;
  issueDate: string;
  total: number;
  totalPayed: number;
  totalVat: number;
  type: "CREDIT" | "CASH";
}

export interface InvoiceDetail {
  id: number;
  invoiceId: number;
  product: Product;
  partialAmount: number;
  partialAmountVAT: number;
  quantity: number;
  unitCost: number;
}

export interface InvoiceDetailResponse {
  data: InvoiceDetail[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}

// Interfaz para métodos de pago asociados a una factura
export interface InvoicePaymentMethod {
  id: number;
  method: string; // <= aquí
  invoiceId: number;
}

// Respuesta de la API de métodos de pago
export interface InvoicePaymentMethodResponse {
  data: InvoicePaymentMethod[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}
