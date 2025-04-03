import { PRODUCT_API } from "@/lib/urls";
import { Product } from "./IProducts";

export async function getProductByTag(tags: string[], token: string): Promise<Product[]> {
  const query = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join("&");
  const url = `${PRODUCT_API}?page=1&${query}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
  }

  const result = await response.json();

  // Retorna los datos solo si son válidos, de lo contrario, devuelve un array vacío.
  return result?.data && Array.isArray(result.data) ? result.data : [];
}
