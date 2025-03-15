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
            const errorData = await response.json(); // Obtener detalles del error
            throw { response: { status: response.status, data: errorData } }; // Lanzar error formateado
          }

        return await response.json();
    } catch (error) {
        console.error("Error en registerEmployee:", error);
        throw error;
    }
};