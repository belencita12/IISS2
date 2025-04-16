import { PRODUCT_API } from "@/lib/urls";
import { Product } from "./IProducts";

export async function getProductByTag(tags: string[], token: string): Promise<Product[]> {
  const query = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join("&");
  const url = `${PRODUCT_API}?page=1&${query}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Ocurrió un error. Intenta nuevamente.");
    }

    const result = await response.json();

    return result?.data && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
  }
}
