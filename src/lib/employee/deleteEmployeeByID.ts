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
        
    if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }

        return true; 
    } catch (error) {
        throw error; 
    }
};
