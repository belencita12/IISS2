export interface Purchase {
  id: number;
  ivaTotal: number;
  total: number;
  date: string;
  provider: {
    id: number;
    businessName: string;
    description: string;
    phoneNumber: string;
    ruc: string;
  };
  stock: {
    name: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: Record<string, never> | null;
  };
}