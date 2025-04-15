// /lib/invoices/IInvoiceDetail.ts

import { Product } from "@/lib/products/IProducts";
// /lib/invoices/IInvoice.ts

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
  type: "CREDIT" | "DEBIT";
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

/**
 * Si necesitas manejar paginación y filtros, puedes definir la respuesta así:
 */
export interface InvoiceDetailResponse {
  data: InvoiceDetail[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}

/**
 * Y también los parámetros de query si fueran requeridos:
 */
export interface InvoiceDetailQueryParams {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
  includeDeleted?: boolean;
  invoiceNumber?: string;
  fromPartialTotal?: number;
  toPartialTotal?: number;
  fromIssueDate?: string;
  toIssueDate?: string;
  invoiceId?: number; 
}
