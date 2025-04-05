import { PRODUCT_API } from "@/lib/urls";
import { Product } from "./IProducts";

export async function getProductById(id: string, token: string): Promise<Product> {
  const url = `${PRODUCT_API}/${id}`;
  console.log(url);
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return await response.json();
}
