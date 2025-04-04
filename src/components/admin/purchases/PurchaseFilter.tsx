"use client";

import { useEffect, useState } from "react";
import { getProviders } from "@/lib/provider/getProviders";
import { getStocks } from "@/lib/stock/getStock";
import { Provider } from "@/lib/provider/IProvider";
import { StockData } from "@/lib/stock/IStock";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";
interface PurchaseFilterProps {
  provider: string;
  deposito: string;
  token: string;
  onFilterChange: (filters: {
    provider: string;
    deposito: string;
  }) => void;
}

const PurchaseFilter = ({
  provider,
  deposito,
  token,
  onFilterChange,
}: PurchaseFilterProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerResponse = await getProviders(token, { page: 1, size: 100 });
        setProviders(providerResponse.data);

        const stockResponse = await getStocks({ page: 1, size: 100 }, token);
        setStocks(stockResponse.data);
      } catch (error: unknown) {
        if (error instanceof Error) toast("error", error.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Select
        value={provider}
        onValueChange={(value) => onFilterChange({ provider: value, deposito })}
      >
        <SelectTrigger className="border p-2 w-52">
          <SelectValue placeholder="Proveedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {providers.map((prov) => (
            <SelectItem key={prov.id} value={prov.id?.toString() || ""}>
              {prov.businessName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={deposito}
        onValueChange={(value) => onFilterChange({ provider, deposito: value })}
      >
        <SelectTrigger className="border p-2 w-52">
          <SelectValue placeholder="Depósito" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {stocks.map((stock) => (
            <SelectItem key={stock.id} value={stock.id?.toString() || ""}>
              {stock.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  );
};

export default PurchaseFilter;
