"use client";

import { EmployeeData } from "@/lib/employee/IEmployee";
import { Trash } from "lucide-react";

type MovementEmployeeProps = {
  employee: EmployeeData | null;
  onRemove: () => void;
};

export default function MovementEmployee({
  employee,
  onRemove,
}: MovementEmployeeProps) {
  if (!employee) return null;

  return (
    <div className="w-full border rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="font-semibold">Encargado seleccionado:</p>
        <p>{employee.fullName}</p>
        <p className="text-sm text-gray-500">RUC: {employee.ruc}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 flex items-center gap-1"
      >
        <Trash className="w-4 h-4" />
        Quitar
      </button>
    </div>
  );
}
