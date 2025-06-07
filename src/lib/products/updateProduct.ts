
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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // fallback si no es JSON
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
