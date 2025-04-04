import { SPECIES_API } from "@/lib/urls";
import { toast } from "@/lib/toast";

export const updateSpecies = async (
    id: number,
    speciesData: { name: string },
    token: string
) => {
    try {
        const response = await fetch(`${SPECIES_API}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(speciesData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al actualizar la especie");
        }

        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast("error", error.message);
        } else {
            toast("error", "Ocurrió un error desconocido al actualizar la especie");
        }
        throw error;
    }
};