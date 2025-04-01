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
        const errorText = await response.text();
        console.error(`Error HTTP ${response.status}:`, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar el depósito:", error);
    return false;
  }
};
