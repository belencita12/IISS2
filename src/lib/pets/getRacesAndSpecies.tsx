const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRacesAndSpecies = async () => {
    try {
        const [racesResponse, speciesResponse] = await Promise.all([
            fetch(`${API_URL}/race?page=1`),
            fetch(`${API_URL}/species?page=1`),
        ]);

        if (!racesResponse.ok || !speciesResponse.ok) throw new Error("Error al obtener datos");

        const [racesData, speciesData] = await Promise.all([
            racesResponse.json(),
            speciesResponse.json(),
        ]);

        return {
            races: racesData?.data || [],
            species: speciesData?.data || [],
        };
    } catch (error) {
        console.error("Error en fetchRacesAndSpecies:", error);
        throw error;
    }
};