import { EmployeeData } from "@/lib/employee/IEmployee";
import { useTranslations } from "next-intl";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  const a = useTranslations("AppointmentForm");
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p><strong>{a("employeeSelected")}:</strong> {employee.fullName}</p>
      <p><strong>{a("workPosition")}:</strong> {employee.position.name}</p>
    </div>
  );
}
