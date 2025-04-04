export interface Purchase {
  providerId: number;
  stockId: number;
  date: string;
  details: PurchaseDetail[];
}

export interface PurchaseDetail {
  productId: number;
  quantity: number;
}
