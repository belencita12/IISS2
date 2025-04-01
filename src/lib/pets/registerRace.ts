import { RACE_API } from "../urls";
export const registerRace = async (raceData: { name: string; speciesId: number }, token: string) => {
    try {
        const response = await fetch(RACE_API, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(raceData),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Error al registrar la raza");
        }
        return result;
    
    } catch (error) {
        throw error;
    }
};

