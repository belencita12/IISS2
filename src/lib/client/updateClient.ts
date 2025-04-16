import { CLIENT_API } from "../urls";
import { FormClient } from "./IUserProfile";

export async function updateClient(
    clientId: string,
    clientData: FormClient,
    token: string
) {
    try {
        const response = await fetch(`${CLIENT_API}/${clientId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(clientData),
        });

        const data = await response.json();

        if (!response.ok) {
           // toast("error", data.message || "Error al actualizar el cliente");
            return { error: data.message || "Error al actualizar el cliente" };
        }

        return data;
    } catch (error) {
       // toast("error", "Error al actualizar el cliente");
        return { error: "Error al actualizar el cliente" };
    }
} 