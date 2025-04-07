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

export type ExtendedPurchaseDetail = PurchaseDetail & {
  code?: string;
  name?: string;
};

export type ExtendedPurchase = Omit<Purchase, "details"> & {
  details: ExtendedPurchaseDetail[];
};
