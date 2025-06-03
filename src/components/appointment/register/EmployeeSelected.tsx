import type { EmployeeData } from "@/lib/employee/IEmployee";
import { useTranslations } from "next-intl";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  const t = useTranslations();
  return (
    <div className="mt-3 p-4 rounded-md bg-gray-100 border border-gray-200 text-myPurple-focus text-sm shadow-sm">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-myPurple-focus/70 mt-1">
            {t("appointmentForm.employeeSelectedd.employee", {employee : employee.fullName})}
          </p>
          <p className="text-myPurple-focus/70 mt-1">
             {t("appointmentForm.employeeSelectedd.workPosition", {workPosition: employee.position.name})}
          </p>
        </div>
      </div>
    </div>
  );
}