import { StockData } from "./IStock";
import { STOCK_API } from "@/lib/urls";

export async function setStock({id, name, address}:StockData, token:string) {
    try{
        const response = await fetch(`${STOCK_API}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({name, address}),
        });

        if (!response.ok) {
           throw new Error(`Error al actualizar el depósito: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en setStock:", error);
        throw error;
    }
    
}