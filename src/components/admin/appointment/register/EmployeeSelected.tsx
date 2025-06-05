import { EmployeeData } from "@/lib/employee/IEmployee";
import { useTranslations } from "next-intl";

type EmployeeSelectedProps = {
  employee: EmployeeData;
};

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  const t = useTranslations();
  return (
    <div className="mt-2 p-3 border rounded-md bg-slate-50 text-black text-sm">
      <p> {t("appointmentForm.employeeSelectedd.employee", {employee: employee.fullName})} </p> 
      <p>{t("appointmentForm.employeeSelectedd.workPosition", {workPosition: employee.position.name})}</p>
    </div>
  );
}
