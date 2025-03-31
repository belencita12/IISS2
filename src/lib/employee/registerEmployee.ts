import { EMPLOYEE_API } from "../urls";

export const registerEmployee = async (employeeData: FormData, token: string) => {
    try {
        const response = await fetch(EMPLOYEE_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: employeeData,
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw { status: response.status, message: errorData.message || "Error desconocido" };
          }

        return await response.json();
    } catch (error) {
        throw error;
    }
};