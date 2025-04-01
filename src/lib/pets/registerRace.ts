import { RACE_API } from "../urls";

export const registerRace = async (raceData: FormData, token: string) => {
    try {
        const response = await fetch(RACE_API, { 
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: raceData,
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en registerRace:", error);
        throw error;
    }
};
