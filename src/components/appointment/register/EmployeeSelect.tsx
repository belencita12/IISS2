"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import SearchBar from "@/components/global/SearchBar";
import type { EmployeeData } from "@/lib/employee/IEmployee";
import { useFetch } from "@/hooks/api";
import { EMPLOYEE_API } from "@/lib/urls";
import { toast } from "@/lib/toast";
import useDebounce from "@/hooks/useDebounce";

type EmployeeSelectProps = {
  token: string;
  onSelectEmployee: (employee: EmployeeData) => void;
};

interface EmployeeApiResponse {
  data: EmployeeData[];
  currentPage: number;
  totalPages: number;
  total: number;
  size: number;
}

export default function EmployeeSelect({
  token,
  onSelectEmployee,
}: EmployeeSelectProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  // Reducir el tiempo de debounce para una mejor experiencia de usuario
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { data, loading: isLoading, get } = useFetch<EmployeeApiResponse>(EMPLOYEE_API, token);

  // Manejar datos que vienen de la API
  useEffect(() => {
    if (data?.data) {
      const vets = data.data.filter(
        (emp) =>
          emp.position?.name === "Veterinario" ||
          emp.position?.name === "Veterinaria"
      );
      setEmployees(vets);
      setIsSearching(false);
    }
  }, [data]);

  const fetchEmployees = async (search?: string) => {
    try {
      const url = search 
        ? `${EMPLOYEE_API}?page=1&query=${encodeURIComponent(search)}` 
        : `${EMPLOYEE_API}?page=1`;
      
      await get(undefined, url);
    } catch (err) {
      toast("error", "Error al cargar empleados");
      setIsSearching(false);
    }
  };

  // Cargar empleados al inicio
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Efecto para manejar la búsqueda debounceada
  useEffect(() => {
    // Evitamos búsquedas innecesarias al inicio
    if (debouncedSearchQuery !== searchQuery) {
      setIsSearching(true);
    }
    
    fetchEmployees(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Indicamos que estamos en proceso de búsqueda
    if (query !== debouncedSearchQuery) {
      setIsSearching(true);
    }
  };

  const handleSelectEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    onSelectEmployee(employee);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-11 justify-between border-myPurple-tertiary focus:ring-myPurple-primary focus:border-myPurple-primary transition-all duration-200"
          >
            {selectedEmployee ? (
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-start">
                {selectedEmployee.fullName}
              </div>
            ) : (
              <span>Selecciona un empleado</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 shadow-lg border-myPurple-tertiary/30 w-[var(--radix-popover-trigger-width)] max-w-[95vw]"
          align="start"
          side="bottom"
          sideOffset={5}
          avoidCollisions={false}
        >
          <Command>
            <div className="flex items-center border-b px-2 pt-2 sticky top-0 bg-white z-10">
              <div className="w-full pb-2">
                <SearchBar
                  onSearch={handleSearchChange}
                  placeholder="Buscar por nombre..."
                  defaultQuery={searchQuery}
                />
              </div>
            </div>

            {isLoading || isSearching ? (
              <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                {isSearching ? "Buscando..." : "Cargando empleados..."}
              </div>
            ) : (
              <>
                <CommandEmpty>No se encontraron empleados</CommandEmpty>
                <CommandGroup>
                  <CommandList className="max-h-[250px] overflow-y-auto">
                    {employees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={employee.fullName}
                        onSelect={() => handleSelectEmployee(employee)}
                        className="px-4 py-2 cursor-pointer hover:bg-myPurple-disabled/50"
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex items-center w-full">
                            <span className="font-medium truncate">{employee.fullName}</span>
                            {selectedEmployee?.id === employee.id && (
                              <Check className="ml-auto h-4 w-4 text-myPurple-primary" />
                            )}
                          </div>
                          {employee.position?.name && (
                            <span className="text-sm text-muted-foreground truncate">
                              {employee.position.name}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}