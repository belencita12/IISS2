import { PRODUCT_API } from "@/lib/urls";
import { Product } from "./IProducts";

export async function getProductById(id: string, token: string): Promise<Product> {
  const url = `${PRODUCT_API}/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Ocurrió un error. Intenta nuevamente.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Ocurrió un error. Intenta nuevamente.");
  }
}
