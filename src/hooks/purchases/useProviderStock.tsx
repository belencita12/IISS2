import { useEffect, useState } from "react";
import { getProviders } from "@/lib/provider/getProviders";
import { getStocks } from "@/lib/stock/getStock";
import { Provider } from "@/lib/provider/IProvider";
import { StockData } from "@/lib/stock/IStock";

export const useInitialData = (token: string) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [providerRes, stockRes] = await Promise.all([
        getProviders(token, { page: 1, size: 100 }),
        getStocks({ page: 1, size: 100}, token),
      ]);
      setProviders(providerRes.data);
      setStocks(stockRes.data);
    };

    fetchData();
  }, [token]);

  return { providers, stocks };
};
