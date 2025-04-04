import { SPECIES_API } from "../urls";

export const deleteSpeciesById = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${SPECIES_API}/${id}`, {
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
        console.error("Error en deleteSpeciesById:", error);
        return false;
    }
};
