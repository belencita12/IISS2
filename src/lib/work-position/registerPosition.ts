
import { Position } from "./IPosition";
import { WORK_POSITION_API } from "../urls";

export const registerPosition = async (positionData: Position, token: string) => {
    console.log("Enviando a la API:", JSON.stringify(positionData, null, 2));

    try {
        const response = await fetch(`${WORK_POSITION_API}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(positionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.toLowerCase().includes("ya están en uso")) {
                throw new Error("El puesto ya existe");
            }
            throw new Error("Ocurrió un error. Intenta nuevamente.");
        }

        return await response.json() as Position;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
    }
};
