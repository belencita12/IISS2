
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
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        return { ...data, id };

    } catch (error) {
        console.error('Error en getPositionById:', error);
        throw error;
    }
};