import { Product } from "@/lib/products/IProducts";

export interface PurchaseDetail {
  id: number;
  purchaseId: number;
  unitCost: number;
  partialAmount: number;
  partialAmountVAT: number;
  quantity: number;
  product: Product;
}

export interface PurchaseDetailResponse {
  data: PurchaseDetail[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}
