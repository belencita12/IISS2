import { RACE_API } from "../urls";

export const updateRace = async (raceId: number, raceData: { name: string, speciesId: number }, token: string) => {
    try {
        const response = await fetch(`${RACE_API}/${raceId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(raceData),
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en updateRace:", error);
        throw error;
    }
};
