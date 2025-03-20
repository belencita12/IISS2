
import { PRODUCT_API} from "@/lib/urls";  

export const registerProduct = async (petData: FormData, token: string) => {
    try {
        const response = await fetch(PRODUCT_API, { 
            method: "POST",
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
