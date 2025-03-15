import { PRODUCT_API } from "@/lib/urls";
import { Product, ProductQueryParams, ProductResponse } from "./IProducts";

export const getProducts = async (
  params: ProductQueryParams,
  token: string
): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, String(value));
  });
  const url = `${PRODUCT_API}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  return await response.json();
};
