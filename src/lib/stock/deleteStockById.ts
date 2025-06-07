import { STOCK_API } from "../urls";

export const deleteStockById = async (stockId: number, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${STOCK_API}/${stockId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }


    return true;
  } catch (error) {
    throw error;
  }
};
