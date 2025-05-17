import type { EmployeeData } from "@/lib/employee/IEmployee";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            Empleado: {employee.fullName}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            Puesto: {employee.position.name}
          </p>
        </div>
      </div>
    </div>
  );
}