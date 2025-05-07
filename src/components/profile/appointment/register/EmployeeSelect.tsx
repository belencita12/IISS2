"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeData} from "@/lib/employee/IEmployee";
import { EMPLOYEE_API
 } from "@/lib/urls";
import { useFetch } from "@/hooks/api";

type EmployeeSelectProps = {
  token: string;
  onSelectEmployee: (employee: EmployeeData) => void;
};

type EmployeeResponse = {
  data: EmployeeData[];
};

export default function EmployeeSelect({ token, onSelectEmployee }: EmployeeSelectProps) {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const { data, get } = useFetch<EmployeeResponse>("", token);

  useEffect(() => {
    get(undefined, `${EMPLOYEE_API}?page=1&size=100`);
  }, []);

  useEffect(() => {
    if (data?.data) {
      const vets = data.data.filter((emp) => emp.position.name === "Veterinario" || emp.position.name === "Veterinaria");
      setEmployees(vets);
    }
  }, [data]);

  const handleSelect = (employeeId: string) => {
    const selected = employees.find((e) => e.id === Number(employeeId));
    if (selected) {
      onSelectEmployee(selected);
    }
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un veterinario" />
        </SelectTrigger>
        <SelectContent>
          {employees.map((emp) => (
            <SelectItem key={emp.id} value={String(emp.id)}>
              <div>
                <p>{emp.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {emp.position.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
