
import { BASE_API_URL } from "../env";
export const getPositionById = async (id: number, token: string)=> {
    try {
        const response = await fetch(`${BASE_API_URL}/work-position/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if(response.status === 404) return null;
        const data = await response.json();
        return { ...data, id };

    } catch (error) {
        throw error;
    }
};