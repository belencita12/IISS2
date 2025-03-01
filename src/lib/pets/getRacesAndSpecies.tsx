const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRacesAndSpecies = async (token: string) => {
    try {
        const [racesResponse, speciesResponse] = await Promise.all([
            fetch(`${BASE_URL}/race?page=1`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${BASE_URL}/species?page=1`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
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
        console.error("Error en getRacesAndSpecies:", error);
        throw error;
    }
};
