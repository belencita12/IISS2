export interface PurchaseDetail {
  id: number;
  purchaseId: number;
  unitCost: number;
  partialAmount: number;
  partialAmountVAT: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    code: string;
    cost: number;
    iva: number;
    category: string;
    price: number;
    image?: {
      id: number;
      originalUrl: string;
    };
    quantity: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  };
}