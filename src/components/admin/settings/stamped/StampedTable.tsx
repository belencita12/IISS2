"use client";

import { useTranslations } from "next-intl";
import { Stamped } from "@/lib/stamped/IStamped";
import GenericTable, { Column, PaginationInfo, TableAction } from "@/components/global/GenericTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Pencil, Trash } from "lucide-react";

interface Props {
  stampedData: Stamped[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
  onView?: (stamped: Stamped) => void;
  onEdit?: (stamped: Stamped) => void;
  onDelete?: (stamped: Stamped) => void;
}

export function StampedTable({ 
  stampedData, 
  pagination, 
  onPageChange, 
  loading,
  onView,
  onEdit,
  onDelete 
}: Props) {
  const t = useTranslations("Stamped");

  const columns: Column<Stamped>[] = [
    {
      header: t("stampedNumber"),
      accessor: (stamped) => stamped.stampedNum,
    },
    {
      header: t("deposit"),
      accessor: (stamped) => stamped.stock.name,
    },
    {
      header: t("address"),
      accessor: (stamped) => stamped.stock.address,
    },
    {
      header: t("startDate"),
      accessor: (stamped) => format(new Date(stamped.fromDate), "dd/MM/yyyy", { locale: es }),
    },
    {
      header: t("endDate"),
      accessor: (stamped) => format(new Date(stamped.toDate), "dd/MM/yyyy", { locale: es }),
    },
    {
      header: t("numberRange"),
      accessor: (stamped) => `${stamped.fromNum} - ${stamped.toNum}`,
    },
    {
      header: t("status"),
      accessor: (stamped) => (
        <Badge variant={stamped.isActive ? "default" : "destructive"}>
          {stamped.isActive ? t("active") : t("inactive")}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<Stamped>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: t("view"),
      onClick: onView || (() => {}),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      label: t("edit"),
      onClick: onEdit || (() => {}),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      label: t("delete"),
      onClick: onDelete || (() => {}),
    },
  ];

  return (
    <GenericTable
      data={stampedData}
      columns={columns}
      actions={actions}
      pagination={pagination}
      onPageChange={onPageChange}
      isLoading={loading}
      emptyMessage={t("noStampedFound")}
    />
  );
} 