import { PROVIDER_API } from "@/lib/urls";
import { Provider } from "@/lib/provider/IProvider";

export const getProviderById = async (providerId: number, token: string): Promise<Provider | null> => {
    try {
      const response = await fetch(`${PROVIDER_API}/${providerId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data as Provider;
      }
  
      return null;
    } catch (error) {
      return null;
    }
  };