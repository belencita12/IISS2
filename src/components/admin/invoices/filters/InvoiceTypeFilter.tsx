"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GetInvoiceQueryParams } from "@/lib/invoices/IInvoice";
import { useTranslations } from "next-intl";

interface InvoiceTypeFilterProps {
  filters: GetInvoiceQueryParams;
  setFilters: (filters: GetInvoiceQueryParams) => void;
}

const InvoiceTypeFilter: React.FC<InvoiceTypeFilterProps> = ({
  filters,
  setFilters,
}) => {
  const handleChange = (value: string) => {
    setFilters({
      ...filters,
       type: value === "ALL" ? undefined : (value as GetInvoiceQueryParams["type"]),
    });
  };

  const t = useTranslations();
  return (
    <div className="space-y-2">
      <Label>{t("filters.invoices.type")}</Label>
      <Select
        value={filters.type ?? "ALL"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="max-w-full ">
          <SelectValue placeholder={t("placeholder.select")}/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t("filters.all")}</SelectItem>
          <SelectItem value="CASH">{t("invoices.type.cash")}</SelectItem>
          <SelectItem value="CREDIT">{t("invoices.type.credit")}</SelectItem>
       
        </SelectContent>
      </Select>
    </div>
  );
};

export default InvoiceTypeFilter;
