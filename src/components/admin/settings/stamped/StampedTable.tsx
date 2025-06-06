"use client";

import GenericTable, {
  Column,
  GenericTableProps,
  TableAction,
} from "@/components/global/GenericTable";
import { Stamped } from "@/lib/stamped/IStamped";
import { Pencil, Trash } from "lucide-react";
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

  const t = useTranslations();
  
  if (isLoading) return <StampedTableSkeleton />;

  

  const columns: Column<Stamped>[] = [
    {
      header: t("stamped.table.stampedNumber"),
      accessor: (stamped) => stamped.stampedNum,
    },
    {
      header: t("stamped.table.stock"),
      accessor: (stamped) => stamped.stock.name,
    },
    {
      header: t("stamped.table.address"),
      accessor: (stamped) => stamped.stock.address,
    },
    {
      header: t("stamped.table.startDate"),
      accessor: (stamped) => format(new Date(stamped.fromDate), "dd/MM/yyyy", { locale: es }),
    },
    {
      header: t("stamped.table.endDate"),
      accessor: (stamped) => format(new Date(stamped.toDate), "dd/MM/yyyy", { locale: es }),
    },
    {
      header: t("stamped.table.numberRange"),
      accessor: (stamped) => `${stamped.fromNum} - ${stamped.toNum}`,
    },
    {
      header: t("stamped.table.status"),
      accessor: (stamped) => (
        <Badge variant={stamped.isActive ? "default" : "destructive"}>
          {stamped.isActive ? t("stamped.status.active") : t("stamped.status.inactive")}
        </Badge>
      ),
    },
  ];

  const actions: TableAction<Stamped>[] = [
    {
      icon: <Pencil className="w-4 h-4" />,
      label: t("button.edit"),
      onClick: handleEdit || (() => {}),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      label: t("button.delete"),
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
      emptyMessage={t("stamped.table.emptyMessage")}
    />
  );
} 

export default StampedTable;