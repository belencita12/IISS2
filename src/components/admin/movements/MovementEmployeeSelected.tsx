"use client";

import { EmployeeData } from "@/lib/employee/IEmployee";
import { Trash } from "lucide-react";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { useTranslations } from "next-intl";

type MovementEmployeeSelectedProps = {
  employee: EmployeeData | null;
  onRemove: () => void;
  isSubmitting ?: boolean;
};

export default function MovementEmployeeSelected({
  employee,
  onRemove,
  isSubmitting = false,
}: MovementEmployeeSelectedProps) {

    const t = useTranslations();

  if (!employee) return null;



  const columns: Column<EmployeeData>[] = [
    {
      header: t("employee.table.name"),
      accessor: "fullName",
    },
    {
      header: t("employee.table.ruc"),
      accessor: "ruc",
    },
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      label: t("button.delete"),
      icon: <Trash className={isSubmitting ? "cursor-not-allowed disabled>opacity-50" : "w-5 h-5"} />,
      onClick: () => onRemove(),
    },
  ];

  return (
    <GenericTable
      data={[employee]}
      columns={columns}
      actions={actions}
      actionsTitle={t("employee.table.actions")}
      emptyMessage={t("error.notFoundEmployee")}
      pagination={undefined}
      className="mt-4"
    />
  );
}
