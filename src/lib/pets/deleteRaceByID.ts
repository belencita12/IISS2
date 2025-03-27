import { RACE_API } from "../urls";
import { Race } from "./IPet";

export const deleteRaceByID = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${RACE_API}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return true; 
    } catch (error) {
        console.error("Error en deleteRaceByID:", error);
        return false; 
    }
};
