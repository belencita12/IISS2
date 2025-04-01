import { EMPLOYEE_API } from "../urls";

export const fetchEmployees = async (page: number, query: string, token: string | null) => {
    try {
        const url = query
            ? `${EMPLOYEE_API}?page=${page}&query=${encodeURIComponent(query)}`
            : `${EMPLOYEE_API}?page=${page}&size=7`; 
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en obtener empleados", error);
        throw error;
    }
};
