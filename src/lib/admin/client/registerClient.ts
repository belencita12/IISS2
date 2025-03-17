import { AUTH_API } from "@/lib/urls";
import { ClientData } from "./IClient";

export const registerClient = async (clientData: ClientData, token: string) => {
  try {
    const response = await fetch(`${AUTH_API}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    let data = null;
    try {
      data = await response.json();
    } catch (jsonError) {}

    if (!response.ok) {
      return { error: data?.message || `Error HTTP: ${response.status}`, status: response.status };
    }
    return { success: true, status: response.status, data };
  } catch (error) {
    console.error("Error en registerClient:", error);
    throw error;
  }
};