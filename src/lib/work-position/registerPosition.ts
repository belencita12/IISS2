
import { Position } from "./IPosition";
import { BASE_API_URL } from "../env";

export const registerPosition = async (positionData: Position, token: string) => {
    console.log("Enviando a la API:", JSON.stringify(positionData, null, 2));

    try {
        const response = await fetch(`${BASE_API_URL}/work-position`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(positionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json() as Position;
    } catch (error) {
        console.error('Error en createWorkPosition:', error);
        throw error;
    }
};
