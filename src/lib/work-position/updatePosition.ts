
import { Position } from "./IPosition";
import { BASE_API_URL } from "../env";

export const updatePosition = async (id: number, positionData: Position, token: string) => {
    try {
        const response = await fetch(`${BASE_API_URL}/work-position/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(positionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status}: ${errorText}`);
        }

        return await response.json() as Position;
    } catch (error) {
        console.error('Error en updatePosition:', error);
        throw error;
    }
};