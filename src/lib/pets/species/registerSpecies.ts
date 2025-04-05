import { SPECIES_API } from "@/lib/urls";

export const registerSpecies = async (
    speciesData: { name: string },
    token: string
) => {
    try {
        const response = await fetch(SPECIES_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(speciesData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al registrar la especie");
        }

        return result;
    } catch (error) {
        console.error("Error registering species:", error);
        throw error;
    }
};
