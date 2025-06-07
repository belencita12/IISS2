import { STOCK_API } from "@/lib/urls";
import { StockData } from "./IStock";

export async function getStockById(stockId: string, token: string): Promise<StockData> {
  const url = `${STOCK_API}/${stockId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Ocurrió un error. Intenta nuevamente.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
  }
}
