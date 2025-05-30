"use client";

import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
  to: string | undefined;
  from: string | undefined;
  setDateTo: (to: string | undefined) => void;
  setDateFrom: (from: string | undefined) => void;
}

export default function DateFilter({
  to,
  from,
  setDateFrom,
  setDateTo,
}: Props) {

  const t = useTranslations();

  const isEndDateBeforeStart = from && to && to < from;
  const toDateError = isEndDateBeforeStart
    ? t("error.errorDate")
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="from">{t("filters.date.from")}</Label>
        <input
          id="from"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
            toDateError && "border-red-500"
          )}
          value={from || ""}
          onChange={(e) => {
            const value = e.target.value;
            setDateFrom(value);
          }}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="to">{t("filters.date.to")}</Label>
        <input
          id="to"
          type="date"
          className={clsx(
            "w-full border px-3 py-2 rounded",
            toDateError && "border-red-500"
          )}
          value={to || ""}
          onChange={(e) => setDateTo(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
        {toDateError && (
          <p className="text-red-600 text-sm mt-1">{toDateError}</p>
        )}
      </div>
    </div>
  );
}
