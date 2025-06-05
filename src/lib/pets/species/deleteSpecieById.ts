import { SPECIES_API } from "@/lib/urls";
import { toast } from "@/lib/toast";

export const deleteSpeciesById = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${SPECIES_API}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 404){
                toast("error", "La especie ya no existe o no fue encontrada.");
            } else {
                toast("error", result.message || "Error al eliminar la especie");
            }
            return false;
        }

        return true;
    } catch (error: unknown) {
        if (error instanceof Error) toast("error", error.message);
        return false;
    }
};
