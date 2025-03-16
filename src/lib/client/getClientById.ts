import { CLIENT_API } from "../urls";
import { IUserProfile } from "./IUserProfile";

export const getClientById = async (clientId: number, token: string) => {
    try {
        const response = await fetch(`${CLIENT_API}/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok){
            const data = await response.json();
            return data as IUserProfile;
        }
    } catch (error) {
        return null;
    }
};