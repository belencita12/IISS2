import type { EmployeeData } from "@/lib/employee/IEmployee"
import { User } from "lucide-react"

type EmployeeSelectedProps = {
  employee: EmployeeData
}

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  return (
    <div className="mt-2 p-4 border border-myPurple-tertiary/50 rounded-lg bg-slate-50 text-black text-sm flex items-start gap-3">
      <div className="bg-myPurple-secondary/20 p-2 rounded-full">
        <User className="h-5 w-5 text-myPurple-primary" />
      </div>
      <div>
        <p className="font-medium text-base text-myPurple-focus">{employee.fullName}</p>
        <p className="text-gray-600">{employee.position.name}</p>
      </div>
    </div>
  )
}
