import { EmployeeData } from "@/lib/employee/IEmployee";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>Nombre:</strong> {employee.fullName}</p>
      <p><strong>Cargo:</strong> {employee.position.name}</p>
    </div>
  );
}