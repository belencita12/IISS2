import { STOCK_DETAILS_API } from "@/lib/urls";
import { StockDetailsResponse, StockDetailsData } from "@/lib/stock/IStock";

//traerá solo los productos del depósito seleccionado que tengan al menos una unidad disponible
export const getStockProducts = async (
  stockId: number,
  searchTerm: string,
  token: string
): Promise<StockDetailsData[]> => {
  const url = `${STOCK_DETAILS_API}?productSearch=${encodeURIComponent(
    searchTerm
  )}&stockId=${stockId}&fromAmount=1&page=1`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data: StockDetailsResponse = await response.json();
  return data.data;
};