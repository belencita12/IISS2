import { EMPLOYEE_API } from "../urls";
import { EmployeeData } from "./IEmployee";

export const getEmployeeByID = async (token: string, id: number) => {
    try {
        const response = await fetch(`${EMPLOYEE_API}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
            return null;
        }

    if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }



        const data: EmployeeData = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};