
import { STOCK_API } from "@/lib/urls";
import { StockQueryParams, StockResponse } from "./IStock";

export const getStocks = async (
  params: StockQueryParams,
  token: string
): Promise<StockResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") queryParams.append(key, String(value));
  });
  const url = `${STOCK_API}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  return await response.json();
};