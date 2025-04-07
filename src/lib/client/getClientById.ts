import { CLIENT_API } from "../urls";
import { IUserProfile } from "./IUserProfile";

export const getClientById = async (clientId: number, token: string) => {
    try {
        console.log("clientId:", clientId);
        const response = await fetch(`${CLIENT_API}/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Respuesta:", response.status);
        console.log("Respuesta:", response.ok);
        if (response.ok){
            const data = await response.json();
            return data as IUserProfile;
        }
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
};