import { EMPLOYEE_API } from "../urls";

export const deleteEmployeeByID = async (token: string, id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${EMPLOYEE_API}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            return null;
        }
        

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return true; 
    } catch (error) {
        console.error("Error en deleteEmployeeByID:", error);
        return false; 
    }
};
