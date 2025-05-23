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