import { CLIENT_API } from "../urls";
import { IUserProfile } from "./IUserProfile";

export const getClientById = async (clientId: number, token: string) => {
    try {
        const response = await fetch(`${CLIENT_API}/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener el cliente");

        const data = await response.json();
        console.log(data);
        return data as IUserProfile;
    } catch (error) {
        console.error("Error en obtener cliente por id", error);
        throw error;
    }
};