"use client";

import GenericTable, {
  Column,
  GenericTableProps,
  TableAction,
} from "@/components/global/GenericTable";
import { Stamped } from "@/lib/stamped/IStamped";
import { Eye, Pencil, Trash } from "lucide-react";
import React from "react";
import {StampedTableSkeleton} from "./StampedTableSkeleton";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";


export type StampedTableProps = Omit<
  GenericTableProps<Stamped>,
  "actions" | "columns"
> & {
  token: string;
  handleEdit: (tag: Stamped) => void;
  handleDel: (tag: Stamped) => void;
  handleRestore?: (tag: Stamped) => void;
  isRestoring?: boolean;
};

const StampedTable = ({
  handleEdit,
  handleDel,
  handleRestore,
  isRestoring,
  isLoading,
  ...props
}: StampedTableProps) => {

  const t = useTranslations("Stamped");
  
  if (isLoading) return <StampedTableSkeleton />;

  

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
      icon: <Pencil className="w-4 h-4" />,
      label: t("edit"),
      onClick: handleEdit || (() => {}),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      label: t("delete"),
      onClick: handleDel || (() => {}),
    },
  ];

  return (
    <GenericTable
        {...props}
      data={props.data || []}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      emptyMessage={t("noStampedFound")}
    />
  );
} 

export default StampedTable;