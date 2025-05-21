import type { EmployeeData } from "@/lib/employee/IEmployee";
import { useTranslations } from "next-intl";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  const a = useTranslations("AppointmentForm");
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            {a("employeeSelected")}: {employee.fullName}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
            {a("workPosition")}: {employee.position.name}
          </p>
        </div>
      </div>
    </div>
  );
}