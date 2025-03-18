import { WORK_POSITION_API } from "../urls";

export const getWorkPosition = async (token: string) => {
    try {
        const response = await fetch(`${WORK_POSITION_API}?page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
          }

        const data = await response.json();
        return data?.data || [];
    } catch (error) {
        console.error("Error en getWorkPosition:", error);
        throw error;
    }
};