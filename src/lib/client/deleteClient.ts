import { CLIENT_API } from "@/lib/urls";

export const deleteClient = async (token: string, clientId: number) => {
  try {
    const response = await fetch(`${CLIENT_API}/${clientId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = null;
    try {
      data = await response.json();
    } catch (jsonError) {}

    if (!response.ok) {
      throw new Error(data?.message || "Error al eliminar el cliente");
    }
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar el cliente");
  }
}; 