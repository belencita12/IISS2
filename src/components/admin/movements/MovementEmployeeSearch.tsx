"use client";

import SearchBar from "@/components/global/SearchBar";
import GenericTable, { Column, TableAction } from "@/components/global/GenericTable";
import { EmployeeData } from "@/lib/employee/IEmployee";  // Asegúrate de tener esta interfaz
import EmployeeTableSkeleton from "@/components/employee/skeleton/EmployeeTableSkeleton";
import { useTranslations } from "next-intl";

type MovementEmployeeSearchProps = {
  searchEmployees: EmployeeData[];
  onSearch: (query: string) => void;
  onSelect: (employee: EmployeeData) => void;
  resetSearch: () => void;
  isLoading?: boolean;
  hasSearched?: boolean;
};

export default function MovementEmployeeSearch({
  searchEmployees,
  onSearch,
  onSelect,
  resetSearch,
  isLoading = false,
  hasSearched = false,
}: MovementEmployeeSearchProps) {

  const em = useTranslations("EmployeeTable");
  const p = useTranslations("Placeholder");
  const e = useTranslations("Error");

  const columns: Column<EmployeeData>[] = [
    { header: em("name"), accessor: "fullName" },
    { header: em("ruc"), accessor: "ruc" },
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      label: p("select"),
      icon: (
        <div className="px-4 py-2 border border-black bg-white text-black rounded-md">
          {p("select")}
        </div>
      ),
      onClick: (employee) => {
        onSelect(employee);
        resetSearch();
      },
    },
  ];

  return (
    <div className="w-full">
      <SearchBar
        onSearch={onSearch}
        debounceDelay={400}
        placeholder={p("getBy", {field: "nombre o ruc del empleado"})}
      />
      {isLoading ? (
        <EmployeeTableSkeleton />
      ) : searchEmployees && searchEmployees.length > 0 ? (
        <GenericTable<EmployeeData>
          data={searchEmployees}
          columns={columns}
          actions={actions}
          actionsTitle=""
          isLoading={false}
          skeleton={<EmployeeTableSkeleton />}
        />
      ) : (
        hasSearched &&
        !isLoading && (
          <p className="text-center mt-4">{e("notFound")}</p>
        )
      )}
    </div>
  );
}