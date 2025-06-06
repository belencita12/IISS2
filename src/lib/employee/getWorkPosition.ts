import { WORK_POSITION_API } from "../urls";

export const getWorkPosition = async (token: string) => {
    try {
        const response = await fetch(`${WORK_POSITION_API}?page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
          }

        const data = await response.json();
        return data?.data || [];
    } catch (error) {
        throw error;
    }
};