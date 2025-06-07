"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getStocks } from "@/lib/stock/getStock";
import { DataList } from "@/components/ui/datalist";
import { StockData } from "@/lib/stock/IStock";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props {
  fromDate: string | undefined;
  toDate: string | undefined;
  setFromDate: (value: string | undefined) => void;
  setToDate: (value: string | undefined) => void;
  stockId: number | undefined;
  setStockId: (value: number | undefined) => void;
  stampedNumber?: string;
  setStampedNumber: (value: string | undefined) => void;
  token: string;
  onResetFilters: () => void;
  hasFilters: boolean
}

export function StampedFilters({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  stockId,
  setStockId,
  stampedNumber,
  setStampedNumber,
  token,
  onResetFilters,
  hasFilters,
}: Props) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [stockText, setStockText] = useState("");

  const t = useTranslations();

  useEffect(() => {
    if(!stockId) setStockText("")
    const fetchStocks = async () => {
      const stocks = await getStocks({ page: 1, size: 5, name: stockText, address: "" }, token);
      setStocks(stocks.data);
    };

    if (token) fetchStocks();
  }, [stockId, stockText, token]);

  return (
    <div className="flex flex-col gap-4">
      {hasFilters && (
        <div className="flex-1 self-end my-[-20px]">
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Limpiar Filtros
          </Button>
        </div>
      )}

      <div className="flex flex-row gap-4 items-center">
        <div className="flex-1">
          <Label>{t("stamped.table.stock")}</Label>
          <DataList
            datas={stocks.map(stock => ({ text: stock.name, value: stock.id?.toString() ?? "" }))}
            handleSelect={(value) => setStockId(value ? parseInt(value) : undefined)}
            placeholder={t("search.searchByStockName")}
            className="w-full"
            onChange={(e) => typeof e === "string" && setStockText(e)}
            handleReset={() => {
              setStockText("");
              setStockId(undefined);
            }}
            value={stockText}
            type="text"
          />
        </div>

        <div className="flex-1">
          <Label>{t("stamped.table.stampedNumber")}</Label>
          <Input 
            type="text"
            placeholder={t("search.searchByStampedNumber")}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,8}$/.test(value)) setStampedNumber(value);
            }}
            className="w-full"
            value={stampedNumber || ""}
            maxLength={8}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <div className="flex-1">
          <Label>{t("stamped.table.startDate")}</Label>
          <Input
            type="date"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value || undefined)}
            max={toDate}
          />
        </div>
        <div className="flex-1">
          <Label>{t("stamped.table.endDate")}</Label>
          <Input
            type="date"
            value={toDate || ""}
            onChange={(e) => setToDate(e.target.value || undefined)}
            min={fromDate}
          />
        </div>
      </div>
    </div>
  );
}