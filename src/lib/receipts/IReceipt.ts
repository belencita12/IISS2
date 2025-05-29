import { BaseQueryParams } from "../types";
export interface IPaymentMethod {
  method: string;
  amount: number;
}

export interface IReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: number;
  issueDate: string;
  total: number;
  paymentMethods: IPaymentMethod[];
}

export interface IReceiptResponse {
  data: IReceipt[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPage: number;
}

export interface ReceiptFiltersParams extends BaseQueryParams {
  fromIssueDate?: string;
  toIssueDate?: string;
  searchTerm?: string;
  fromTotal?: number;
  toTotal?: number;
  receiptNumber?: number;
}
