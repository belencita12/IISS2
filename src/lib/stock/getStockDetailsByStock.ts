// lib/admin/stock/getStockDetails.ts
import { STOCK_DETAILS_API } from "@/lib/urls";
import { StockDetailsResponse } from "./IStock";

interface FilterParams {
  page?: number;
  size?: number;
  productSearch?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minCost?: string;
  maxCost?: string;
  tags?: string[];
}

export async function getStockDetailsByStock (
  stockId: string,
  token: string,
  filters: FilterParams = {}
): Promise<StockDetailsResponse> {
  const params = new URLSearchParams();

  params.append('stockId', stockId);
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.size) params.append('size', filters.size.toString());
  if (filters.productSearch) params.append('productSearch', filters.productSearch);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.minCost) params.append('minCost', filters.minCost);
  if (filters.maxCost) params.append('maxCost', filters.maxCost);
  if (filters.tags?.length) params.append('tags', filters.tags.join(','));

  const url = `${STOCK_DETAILS_API}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  return json;
};