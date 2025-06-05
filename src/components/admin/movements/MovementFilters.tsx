"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetMovementQueryParams } from "@/lib/movements/IMovements";
import SearchBar from "@/components/global/SearchBar";
import { useEffect, useState } from "react";
import { getStocks } from "@/lib/stock/getStock";
import { StockData } from "@/lib/stock/IStock";
import {toast} from "@/lib/toast"
import { useTranslations } from "next-intl";

interface Props {
  token: string;
  filters: GetMovementQueryParams & { managerRuc?: string };
  setFilters: (val: GetMovementQueryParams & { managerRuc?: string }) => void;
  onSearch: () => void;
  resetCounter: number
}

export default function MovementFilters({ token, filters, setFilters, resetCounter }: Props) {
  const handleChange = <K extends keyof Props["filters"]>(
    key: K,
    value: Props["filters"][K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const [stocks, setStocks] = useState<StockData[]>([]);

  const t = useTranslations();

  useEffect(() => {
    getStocks({ page: 1 }, token)
      .then((res) => setStocks(res.data))
      .catch((err) => {
        const message = err?.message || t("error.notGetData");
        toast("error", message);
      });
  }, [token]);


  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-1/2">
          <SearchBar
            placeholder={t("search.searchByEmployeeRuc")}
            defaultQuery={filters.managerRuc ?? ""}
            onSearch={(value) => handleChange("managerRuc", value)}
            debounceDelay={300}
            resetTrigger={resetCounter}
          />
        </div>

        <div className="w-full md:w-1/2">
          <SearchBar
            placeholder={t("search.searchByProductName")}
            defaultQuery={filters.productName ?? ""}
            onSearch={(value) => handleChange("productName", value)}
            debounceDelay={300}
            resetTrigger={resetCounter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>{t("filters.movement.origin")}</Label>
          <Select
            value={
              filters.originStockId !== undefined
                ? filters.originStockId.toString()
                : "ALL"
            }
            onValueChange={(value) =>
              handleChange(
                "originStockId",
                value === "ALL" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholder.select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.all")}</SelectItem>
              {stocks
                .filter((s) => s.id !== undefined)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id!.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t("filters.movement.destination")}</Label>
          <Select
            value={
              filters.destinationStockId !== undefined
                ? filters.destinationStockId.toString()
                : "ALL"
            }
            onValueChange={(value) =>
              handleChange(
                "destinationStockId",
                value === "ALL" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholder.select")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.all")}</SelectItem>
              {stocks
                .filter((s) => s.id !== undefined)
                .map((s) => (
                  <SelectItem key={s.id} value={s.id!.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t("filters.type")}</Label>
          <Select
            value={filters.type ?? "ALL"}
            onValueChange={(value) =>
              handleChange("type", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("placeholder.select")}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("filters.all")}</SelectItem>
              <SelectItem value="INBOUND">{t("movement.type.inbound")}</SelectItem>
              <SelectItem value="OUTBOUND">{t("movement.type.outbound")}</SelectItem>
              <SelectItem value="TRANSFER">{t("movement.type.transfer")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
