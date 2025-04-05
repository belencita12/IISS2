import { STOCK_API } from "../urls";

export const registerStock = async (stockData: { name: string; address: string }, token: string) => {
    try {
        const response = await fetch(STOCK_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(stockData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al registrar el depósito");
        }
      
        return result;
    } catch (error) {
       // console.error("Error registering stock:", error);
        throw error;
    }
};