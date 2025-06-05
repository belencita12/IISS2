"use client";

import NumericInput from "@/components/global/NumericInput";
import { Label } from "@/components/ui/label";
import { ReceiptFiltersParams } from "@/lib/receipts/IReceipt";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import SearchBar from "@/components/global/SearchBar";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  filters: ReceiptFiltersParams;
  setFilters: (val: ReceiptFiltersParams) => void;
}

export default function ReceiptFilters({ filters, setFilters }: Props) {

  const t = useTranslations();
  const [min, setMin] = useState(filters.fromTotal?.toString() ?? "");
  const [max, setMax] = useState(filters.toTotal?.toString() ?? "");
  const [receipt, setReceipt] = useState(filters.receiptNumber?.toString() ?? "");
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");

  const debouncedMin = useDebounce(min, 500);
  const debouncedMax = useDebounce(max, 500);
  const debouncedReceipt = useDebounce(receipt, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const minNumber = debouncedMin !== "" ? Number(debouncedMin) : undefined;
  const maxNumber = debouncedMax !== "" ? Number(debouncedMax) : undefined;

  const isMaxLessThanMin =
    minNumber !== undefined &&
    maxNumber !== undefined &&
    maxNumber < minNumber;

  const maxAmountError = isMaxLessThanMin
    ? t("filters.priceRange.errorNumericMin")
    : null;

  useEffect(() => {
    if (isMaxLessThanMin) return;

    const fromTotal = minNumber;
    const toTotal = maxNumber;
    const receiptNumber = debouncedReceipt !== "" ? Number(debouncedReceipt) : undefined;

    setFilters({
      ...filters,
      fromTotal,
      toTotal,
      receiptNumber,
      searchTerm: debouncedSearchTerm || undefined,
    });
  }, [debouncedMin, debouncedMax, debouncedReceipt, debouncedSearchTerm]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-2">
          <SearchBar
            placeholder={t("search.searchByNameOrRuc")}
            defaultQuery={filters.searchTerm ?? ""}
            onSearch={(value) => setSearchTerm(value)}
            debounceDelay={300}
          />
        </div>

        <div className="space-y-2">
          <NumericInput
            id="receiptNumber"
            type="formattedNumber"
            value={receipt}
            placeholder={t("search.searchByReceiptNumber")}
            onChange={(e) => setReceipt(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fromTotal">{t("filters.priceRange.minAmount")}</Label>
          <NumericInput
            id="fromTotal"
            type="formattedNumber"
            value={min}
            placeholder={t("placeholder.minAmount")}
            onChange={(e) => setMin(e.target.value)}
            className={clsx(
              "w-full border px-3 py-2 rounded",
              maxAmountError && "border-red-500"
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="toTotal">{t("filters.priceRange.maxAmount")}</Label>
          <NumericInput
            id="toTotal"
            type="formattedNumber"
            value={max}
            placeholder={t("placeholder.maxAmount")}
            onChange={(e) => setMax(e.target.value)}
            className={clsx(
              "w-full border px-3 py-2 rounded",
              maxAmountError && "border-red-500"
            )}
          />
          {maxAmountError && (
            <p className="text-red-600 text-sm mt-1">{maxAmountError}</p>
          )}
        </div>
      </div>
    </div>
  );
}





