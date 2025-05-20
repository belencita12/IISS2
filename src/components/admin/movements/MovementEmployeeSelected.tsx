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

    const em = useTranslations("EmployeeTable");
    const b = useTranslations("Button");
    const e = useTranslations("Error");

  if (!employee) return null;



  const columns: Column<EmployeeData>[] = [
    {
      header: em("name"),
      accessor: "fullName",
    },
    {
      header: em("ruc"),
      accessor: "ruc",
    },
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      label: b("delete"),
      icon: <Trash className={isSubmitting ? "cursor-not-allowed disabled>opacity-50" : "w-5 h-5"} />,
      onClick: () => onRemove(),
    },
  ];

  return (
    <GenericTable
      data={[employee]}
      columns={columns}
      actions={actions}
      actionsTitle={b("actions")}
      emptyMessage={e("noSelect", {field: "empleado"})}
      pagination={undefined}
      className="mt-4"
    />
  );
}
