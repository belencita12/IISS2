import { PRODUCT_API } from "@/lib/urls";
import { ProductQueryParams, ProductResponse } from "./IProducts";

export const getProducts = async (
  params: ProductQueryParams,
  token: string
): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, String(value));
  });
  const url = `${PRODUCT_API}?${queryParams.toString()}`;

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
};
