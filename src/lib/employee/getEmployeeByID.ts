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
            const errorText = await response.text();
            console.error(`Error HTTP ${response.status}:`, errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
          }

        const data: EmployeeData = await response.json();
        return data;
    } catch (error) {
        console.error("Error en getEmployeeByID:", error);
        throw error;
    }
};