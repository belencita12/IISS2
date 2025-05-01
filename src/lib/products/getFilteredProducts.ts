import { Product } from "./IProducts";

export interface GetFilteredProductsParams {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minCost?: string;
  maxCost?: string;
  tags?: string[];
}

export interface GetFilteredProductsResponse {
  data: Product[];
  total: number;
  totalPages: number;
}

export const getFilteredProducts = async (
  params: GetFilteredProductsParams,
  token: string
): Promise<GetFilteredProductsResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.name) queryParams.append("name", params.name);
  if (params.category) queryParams.append("category", params.category);
  if (params.minPrice) queryParams.append("minPrice", params.minPrice);
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
  if (params.minCost) queryParams.append("minCost", params.minCost);
  if (params.maxCost) queryParams.append("maxCost", params.maxCost);
  if (params.tags && params.tags.length > 0) queryParams.append("tags", params.tags.join(","));

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/product?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

  return await response.json();
};