import { CLIENT_API } from "../urls";
import { FormClient } from "./IUserProfile";

export async function updateClient(
    clientId: string,
    clientData: FormData,
    token: string
) {
    try {
        // Asegurarnos de que el ID sea un número
        const numericClientId = Number(clientId);
        if (isNaN(numericClientId)) {
            throw new Error("ID de cliente inválido");
        }

        // // Log para depuración
        // console.log("Enviando datos al servidor:", {
        //     url: `${CLIENT_API}/${numericClientId}`,
        //     hasImage: clientData.has("profileImg"),
        //     formDataEntries: Array.from(clientData.entries())
        // });

        const response = await fetch(`${CLIENT_API}/${numericClientId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                // No establecemos Content-Type para que el navegador lo haga automáticamente con el boundary correcto
            },
            body: clientData,
        });

        // // Log de la respuesta
        // console.log("Respuesta del servidor:", {
        //     status: response.status,
        //     statusText: response.statusText
        // });

        const data = await response.json();

        if (!response.ok) {
            //console.error("Error en la respuesta:", data);
            return { error: data.message || "Error al actualizar el cliente" };
        }

        return data;
    } catch (error) {
        //console.error("Error en updateClient:", error);
        return { error: "Error al actualizar el cliente" };
    }
} 