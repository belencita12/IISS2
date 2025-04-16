"use client";

import { EmployeeData } from "@/lib/employee/IEmployee";
import { Trash } from "lucide-react";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";

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
  if (!employee) return null;

console.log(isSubmitting);

  const columns: Column<EmployeeData>[] = [
    {
      header: "Nombre",
      accessor: "fullName",
    },
    {
      header: "RUC",
      accessor: "ruc",
    },
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      label: "Quitar encargado",
      icon: <Trash className={isSubmitting ? "cursor-not-allowed disabled>opacity-50" : "w-5 h-5"} />,
      onClick: () => onRemove(),
    },
  ];

  return (
    <GenericTable
      data={[employee]}
      columns={columns}
      actions={actions}
      actionsTitle="Acciones"
      emptyMessage="No hay encargado seleccionado"
      pagination={undefined}
      className="mt-4"
    />
  );
}
