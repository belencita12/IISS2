import { PROVIDER_API } from "@/lib/urls";
import { Provider } from "./IProvider";

export async function createProvider(token: string, data: Provider) {
  const response = await fetch(`${PROVIDER_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const data = await response.json();
    const message = data.message || "Error al crear proveedor";
    throw new Error(message);
  }

  return await response.json();
}
