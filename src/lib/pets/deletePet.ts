import { PET_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import { notFound } from "next/navigation";

export const deletePet = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${PET_API}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            notFound();
        }

        if (!response.ok) {
            const errorData = await response.json();
            toast("error", errorData.message || "Error al eliminar la mascota");
            return false;
        }

        return true;
    } catch (error) {
        toast("error", "Error inesperado al eliminar la mascota");
        return false;
    }
}; 