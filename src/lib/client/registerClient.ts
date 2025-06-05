import { AUTH_API } from "@/lib/urls";
import { FormClient } from "./IUserProfile";

export const registerClient = async (clientData: FormClient, token: string) => {
  try {
    const response = await fetch(`${AUTH_API}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    const data = await response.json().catch(() => null); // parsea solo una vez

    if (!response.ok) {
      const message = data?.message || `Error HTTP: ${response.status}`;
      throw new Error(message);
    }

    return { success: true, status: response.status, data };
  } catch (error) {
    throw error;
  }
};
