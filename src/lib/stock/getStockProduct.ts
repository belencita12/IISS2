import { STOCK_DETAILS_API } from "@/lib/urls";
import { Product } from "@/lib/products/IProducts";

export interface StockProduct {
  stockId: number;
  product: Product;
  amount: number;
}

export interface StockDetailResponse {
  data: StockProduct[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
}

export const getStockProducts = async (
  stockId: number,
  searchTerm: string,
  token: string
): Promise<StockProduct[]> => {
  const url = `${STOCK_DETAILS_API}?productSearch=${encodeURIComponent(
    searchTerm
  )}&stockId=${stockId}&fromAmount=1&page=1&size=5`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al buscar productos por depósito");
  }

  const data: StockDetailResponse = await res.json();
  return data.data;
};
