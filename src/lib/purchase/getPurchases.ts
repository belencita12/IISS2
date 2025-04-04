import { PURCHASE_API } from "../urls";

interface PurchaseFilters {
  providerId?: string;
  stockId?: string;
}

export const getPurchases = async (
  page: number,
  query: string,
  token: string | null,
  filters?: PurchaseFilters
) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("page", String(page));
    queryParams.append("size", "7"); // Default size

    if (query) {
      queryParams.append("query", encodeURIComponent(query));
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value);
        }
      });
    }

    const url = `${PURCHASE_API}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
     // console.error(`Error HTTP ${response.status}:`, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
   // console.error("Error en obtener compras", error);
    throw error;
  }
};
