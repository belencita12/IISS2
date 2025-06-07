import { PET_API } from "@/lib/urls";  

export const updatePet = async (petId: number, petData: FormData, token: string) => {
    try {
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
            throw new Error(`Error HTTP: ${response.status} - ${errorData?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
