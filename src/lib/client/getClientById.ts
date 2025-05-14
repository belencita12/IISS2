//import { toast } from "sonner";
import { toast } from "@/lib/toast";
import { CLIENT_API } from "../urls";
import { IUserProfile } from "./IUserProfile";

export const getClientById = async (clientId: number, token: string) => {
    try {
        const response = await fetch(`${CLIENT_API}/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            toast("error", "Error al obtener cliente.");
            return null;
        }

        const data = await response.json();
        return data as IUserProfile;
    } catch (error) {
        toast("error", "Error al obtener cliente.");
        return null;
    }
};