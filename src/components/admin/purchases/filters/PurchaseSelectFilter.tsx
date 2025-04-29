"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetPurchaseQueryParams } from "@/lib/purchases/IPurchase";
import { StockData } from "@/lib/stock/IStock";
import { getStocks } from "@/lib/stock/getStock";
import { Provider } from "@/lib/provider/IProvider";
import { getProviders } from "@/lib/provider/getProviders";
import { toast } from "@/lib/toast";

interface Props {
  token: string;
  filters: GetPurchaseQueryParams;
  setFilters: (val: GetPurchaseQueryParams) => void;
}

export default function PurchaseSelectFilter({
  token,
  filters,
  setFilters
}: Props) {
    const handleChange = <K extends keyof Props["filters"]>(
        key: K,
        value: Props["filters"][K]
      ) => {
        setFilters({ ...filters, [key]: value });
      };

      const [stocks, setStocks] = useState<StockData[]>([]);
      const [providers, setProviders] = useState<Provider[]>([]);
      

      useEffect(() => {
        getStocks({ page: 1, size: 100 }, token)
          .then((res) => setStocks(res.data))
          .catch((err:unknown) => toast("error", err instanceof Error ? err.message : "Error inesperado"));

          getProviders(token, { page: 1, size: 100 })
          .then((res) => setProviders(res.data))
          .catch((err) => toast("error", err instanceof Error ? err.message : "Error inesperado"));
      
      }, [token]);

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
          <Label>Proveedor</Label>
          <Select
            value={filters.providerId?.toString() ?? "ALL"}
            onValueChange={(value) =>
              handleChange("providerId", value === "ALL" ? undefined : Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {Array.isArray(providers) &&
                providers.map((p) => (
                    <SelectItem key={p.id} value={p.id?.toString() || ""}>
                    {p.businessName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Depósito</Label>
          <Select
            value={filters.stockId?.toString() ?? "ALL"}
            onValueChange={(value) =>
              handleChange("stockId", value === "ALL" ? undefined : Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione depósito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {stocks.map((s) => (
        <SelectItem key={s.id} value={s.id?.toString() || ""}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
  );
}