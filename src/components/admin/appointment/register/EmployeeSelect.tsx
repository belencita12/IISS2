"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { EMPLOYEE_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api";
import useDebounce from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

type EmployeeSelectProps = {
  onSelectEmployee: (employee: EmployeeData) => void;
  token: string;
  userRole?: string; 
};

type EmployeeResponse = {
  data: EmployeeData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export default function EmployeeSelect({
  onSelectEmployee,
  token,
  userRole, 
}: EmployeeSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, get, loading } = useFetch<EmployeeResponse>("", token);

  const p = useTranslations("Placeholder");
  const b = useTranslations("Button");
  const e = useTranslations("Error");

  useEffect(() => {
    if (debouncedSearch) {
      get(undefined, `${EMPLOYEE_API}?query=${encodeURIComponent(debouncedSearch)}&page=1&size=5`);
      setIsCommandOpen(true);
    } else {
      setIsCommandOpen(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (data?.data) {
      setEmployees(data.data);
    }
  }, [data]);

  const handleSelectEmployee = (employee: EmployeeData) => {
    setSearchTerm("");
    onSelectEmployee(employee);
    setIsCommandOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={p("name")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isCommandOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <Command className="rounded-lg border shadow-md">
                <CommandList>
                  <CommandEmpty>
                    {loading ? b("loading") : e("notFoundField", { field: "empleados"})}
                  </CommandEmpty>
                  <CommandGroup>
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        onSelect={() => handleSelectEmployee(employee)}
                        className="cursor-pointer"
                      >
                        <div>
                          <p>{employee.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.position.name}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
        {userRole !== "USER" && (
        <Link
          href={"/dashboard/employee/register"}
          target="_blank"
          className="flex items-center justify-center rounded-md border border-muted bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
        </Link>
        )}
      </div>
    </div>
  );
}
