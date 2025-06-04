import { PROVIDER_API } from "@/lib/urls";
import { ProviderQueryParams } from "@/lib/provider/IProvider";

export const getProviders = async (
  token: string,
  params: ProviderQueryParams,
) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") queryParams.append(key, String(value));
  });
  const url = `${PROVIDER_API}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

    if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const message = errorData?.message || `Error HTTP: ${response.status}`;
            throw new Error(message);
        }



  return await response.json();
};