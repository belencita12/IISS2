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
    throw new Error("Error al crear proveedor");
  }

  return await response.json();
}
