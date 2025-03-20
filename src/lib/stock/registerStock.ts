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

        if (!response.ok) {
            const errorData = await response.json();
            throw { response: { status: response.status, data: errorData } };
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};