"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getStocks } from "@/lib/stock/getStock";
import { DataList } from "@/components/ui/datalist";
import { StockData } from "@/lib/stock/IStock";

interface Props {
  fromDate: string | undefined;
  toDate: string | undefined;
  setFromDate: (value: string | undefined) => void;
  setToDate: (value: string | undefined) => void;
  isActive: boolean | undefined;
  setIsActive: (value: boolean | undefined) => void;
  stockId: number | undefined;
  setStockId: (value: number | undefined) => void;
  stampedNumber?: string;
  setStampedNumber: (value: string | undefined) => void;
  token: string;
}

export function StampedFilters({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  //isActive,
  //setIsActive,
  //stockId,
  //setStockId,
  stampedNumber,
  setStampedNumber,
  token
}: Props) {

  const [stocks, setStocks] = useState<StockData[]>([]);
  const [stockText, setStockText] = useState<string>("");
  const [addressText] = useState<string>("");
  useEffect(() => {
    const result = async () => {
      const stocks = await getStocks({
        page: 1,
        size: 10,
        name: stockText,
        address: addressText,
      }, token); // Replace with actual token or context
      setStocks(stocks.data);
    }

    if(token) result();
  }, [stockText, addressText, token]);
  
  const t = useTranslations("Stamped");

 /*  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setIsActive(undefined);
    } else {
      setIsActive(value === "true");
    }
  }; */

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <div className="flex-1">
          <Label>{"Deposito"}</Label>
          <DataList datas={stocks.map(stock => ({ text: stock.name, value: stock.id?.toString() ?? "" }))} 
            handleSelect={(value) => {
              //setStockId(value ? parseInt(value) : undefined);
            }}
            placeholder={"Buscar por Deposito"}
            className="w-full"
            onChange={(e) => {
              if(typeof e === "string") {
                //console.log("Input changed:", e);
                setStockText(e);
              }
            }}
            handleReset={() => {
              setStockText("");
              //setStockId(undefined);
            }}
            value={stockText} // Controlled input, can be set to a specific stock ID if needed
            type="text"

          />
        </div>

        {/* <div className="flex-1">
          <Label>{"Direccion"}</Label>
          <DataList datas={stocks.map(stock => ({ text: stock.address, value: stock.id?.toString() ?? "" }))} 
            handleSelect={(value) => {
              
              setStockId(value ? parseInt(value) : undefined);
            }}
            placeholder={"Buscar por direccion del deposito"}
            className="w-full"
            onChange={(e) => { 
              if(typeof e === "string") {
                
                setAddressText(e);
              }
            }}
            handleReset={() => {
              setAddressText("");
              setStockId(undefined);
            }}
            value={addressText} // Controlled input, can be set to a specific stock ID if needed
            type="text"

          />
        </div> */}

        <div className="flex-1">
          <Label>{"Número de Timbrado"}</Label>
          <Input 
            type="text"
            placeholder={"Buscar por número de timbrado"}
            onChange={(e) => {
              const value = e.target.value;
              // Solo permitir números y máximo 8 dígitos
              if (/^\d{0,8}$/.test(value)) {
                setStampedNumber(value || undefined);
              }
            }}
            className="w-full"
            value={stampedNumber || ""} // Controlled input
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            maxLength={8}
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex-1">
          <Label>{t("startDate")}</Label>
          <Input
            type="date"
            value={fromDate || ""}
            onChange={(e) => setFromDate(e.target.value || undefined)}
            max={toDate}
          />
        </div>

        <div className="flex-1">
          <Label>{t("endDate")}</Label>
          <Input
            type="date"
            value={toDate || ""}
            onChange={(e) => setToDate(e.target.value || undefined)}
            min={fromDate}
          />
        </div>

        {/* <div className="flex-1">
          <Label>{t("status")}</Label>
          <Select
            value={isActive === undefined ? "all" : isActive.toString()}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="true">{t("active")}</SelectItem>
              <SelectItem value="false">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
} 