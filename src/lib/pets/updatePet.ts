import { PET_API } from "@/lib/urls";  

export const updatePet = async (petId: number, petData: FormData, token: string) => {
    try {
        console.log("Enviando petición PATCH a:", `${PET_API}/${petId}`);
        console.log("Datos del formulario:", Object.fromEntries(petData.entries()));
        console.log("Token recibido:", token);
        
        const response = await fetch(`${PET_API}/${petId}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: petData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Error en la respuesta:", errorData);
            throw new Error(`Error HTTP: ${response.status} - ${errorData?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);
        return data;
    } catch (error) {
        console.error("Error en updatePet:", error);
        throw error;
    }
};
