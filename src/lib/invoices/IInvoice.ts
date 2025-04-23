import { Product } from "@/lib/products/IProducts";
import { BaseQueryParams } from "../types";

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

export interface GetInvoiceQueryParams extends BaseQueryParams {
  ruc?: string;
  stockId?: number;
  fromTotal?: number;
  toTotal?: number;
  type?: "CREDIT" | "CASH";
  fromIssueDate?: string;
  toIssueDate?: string;
}

export type InvoiceForm = {
  clientId: number;
  stockId: number;
  invoiceNumber: string;
  stamped: string;
  issueDate: string;
  totalPayed: number;
  type: "CREDIT" | "CASH";
  paymentMethods: {
    methodId: number;
    amount: number;
  }[];
  details: {
    quantity: number;
    productId: number;
  }[];
  services: {
    quantity: number;
    productId: number;
  }[];
};