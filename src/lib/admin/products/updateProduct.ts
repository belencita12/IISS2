
import { PRODUCT_API} from "@/lib/urls";  

export const updateProduct = async (id: string, petData: FormData, token: string) => {
    try {
        const response = await fetch(`${PRODUCT_API}/${id}`, { 
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: petData,
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error en updateProduct:", error);
        throw error;
    }
};
