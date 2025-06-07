export type PaymentMethod = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  deletedAt: Record<string, never>;
};

export type PaymentMethodResponse = {
  data: PaymentMethod[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
