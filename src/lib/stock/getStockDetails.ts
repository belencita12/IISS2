// lib/admin/stock/getStockDetails.ts
import { STOCK_DETAILS_API } from "@/lib/urls";
import { StockDetailsResponse } from "./IStock";

export const getStockDetails = async (
  productId: string,
  token: string
): Promise<StockDetailsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("productId", productId);
  queryParams.append("page", "1");
  queryParams.append("size", "100");
  const url = `${STOCK_DETAILS_API}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  return await response.json();
};