"use client";

import { EmployeeData } from "@/lib/employee/IEmployee";
import { Trash } from "lucide-react";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";

type MovementEmployeeSelectedProps = {
  employee: EmployeeData | null;
  onRemove: () => void;
};

export default function MovementEmployeeSelected({
  employee,
  onRemove,
}: MovementEmployeeSelectedProps) {
  if (!employee) return null;

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
      icon: <Trash className="w-4 h-4 text-red-500" />,
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
