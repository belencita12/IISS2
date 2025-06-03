"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  fromDate: string | undefined;
  toDate: string | undefined;
  setFromDate: (value: string | undefined) => void;
  setToDate: (value: string | undefined) => void;
  isActive: boolean | undefined;
  setIsActive: (value: boolean | undefined) => void;
}

export function StampedFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  isActive,
  setIsActive,
}: Props) {
  const t = useTranslations("Stamped");

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setIsActive(undefined);
    } else {
      setIsActive(value === "true");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>{t("startDate")}</Label>
        <Input
          type="date"
          value={fromDate || ""}
          onChange={(e) => setFromDate(e.target.value || undefined)}
          max={toDate}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("endDate")}</Label>
        <Input
          type="date"
          value={toDate || ""}
          onChange={(e) => setToDate(e.target.value || undefined)}
          min={fromDate}
        />
      </div>

      <div className="space-y-2">
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
      </div>
    </div>
  );
} 