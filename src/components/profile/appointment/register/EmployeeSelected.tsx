import type { EmployeeData } from "@/lib/employee/IEmployee"
import { User } from "lucide-react"

type EmployeeSelectedProps = {
  employee: EmployeeData
}

export default function EmployeeSelected({ employee }: EmployeeSelectedProps) {
  return (
    <div className="flex items-center p-3">
      <div className="bg-white p-2 rounded-full mr-3">
        <User className="h-5 w-5 text-myPurple-secondary" />
      </div>
      <div>
        <p className="font-medium text-myPurple-focus">{employee.fullName}</p>
        <p className="text-gray-600">{employee.position.name}</p>
      </div>
    </div>
  )
}
