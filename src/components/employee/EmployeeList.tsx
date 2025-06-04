"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { fetchEmployees } from "@/lib/employee/getEmployees";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { deleteEmployeeByID } from "@/lib/employee/deleteEmployeeByID";
import { ConfirmationModal } from "../global/Confirmation-modal";
import SearchBar from "../global/SearchBar";
import EmployeeTableSkeleton from "./skeleton/EmployeeTableSkeleton";
import { useTranslations } from "next-intl";

interface EmployeesTableProps {
  token: string | null;
}

export default function EmployeesTable({ token }: EmployeesTableProps) {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<{
    employees: EmployeeData[];
    pagination: PaginationInfo;
  }>({
    employees: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 8 },
  });
  const [loading, setLoading] = useState(false);

  const t = useTranslations();

  const loadEmployees = useCallback(
    async (page: number = 1, query: string = "") => {
      if (!token) return;
      setLoading(true);
      try {
        const results = await fetchEmployees(page, query, token);
        if (!results?.data?.length && query) toast("info", t("error.notFoundEmployees"));
        setData({
          employees: results?.data || [],
          pagination: {
            currentPage: results?.currentPage || 1,
            totalPages: results?.totalPages || 1,
            totalItems: results?.total || 0,
            pageSize: results?.size || 8,
          },
        });
      } catch (error:unknown) {
        if (error instanceof Error) {
          toast("error", error.message)};
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      loadEmployees(data.pagination.currentPage, query);
    }
  }, [token, data.pagination.currentPage, query, loadEmployees]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setData((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: 1 },
    }));
  };
  
  const handlePageChange = (page: number) =>
    setData((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: page },
    }));

    const confirmDelete = (employee: EmployeeData) => {
      setSelectedEmployee(employee);
      setIsModalOpen(true);
    };
    
    const handleDelete = async () => {
      if (!selectedEmployee) return;
      
      const success = selectedEmployee.id !== undefined 
        ? await deleteEmployeeByID(token || "", selectedEmployee.id) 
        : false;
    
      if (success) {
        toast("success", t("success.successDeleteEmployee", {employee: selectedEmployee.fullName}));
        loadEmployees(data.pagination.currentPage);
      } else {
        toast("error", t("error.errorDeleteEmployee"));
      }
    
      setIsModalOpen(false);
      setSelectedEmployee(null);
    };
    

  const columns: Column<EmployeeData>[] = [
    { header: t("employee.table.name"), accessor: "fullName" },
    { header: t("employee.table.email"), accessor: "email" },
    { header: t("employee.table.ruc"), accessor: "ruc" },
    { header: t("employee.table.workPosition"), accessor: (employee) => employee.position.name },
  
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (employee) => {
        if (!employee.id || isNaN(Number(employee.id))) {
          toast("error", t("error.notFoundEmployee"));
          return;
        }
        router.push(`/dashboard/employee/${employee.id}`);
      },
      label: t("button.seeDetails"),
    },
    {
      icon: <Pencil className="w-4 h-4" />,
      onClick: (employee) => {
        if (!employee.id || isNaN(Number(employee.id))) {
          toast("error", t("error.notFoundEmployee"));
          return;
        }
        router.push(`/dashboard/employee/update/${employee.id}`);
      },
      label: t("button.edit"),
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: confirmDelete, 
      label: t("button.delete"),
    },
  ];

  return (
    <div className="p-4 mx-auto">
        <SearchBar onSearch={handleSearch} placeholder={t("search.searchByNameOrRucEmployee")} />
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">{t("employee.table.title")}</h2>
            <Button variant="outline" className="px-6" onClick={() => router.push("/dashboard/employee/register")}>
                    {t("button.register")}
            </Button>
        </div>
        <GenericTable
          data={data.employees}
          columns={columns}
          actions={actions}
          pagination={data.pagination}
          onPageChange={handlePageChange}
          isLoading={loading}
          skeleton={<EmployeeTableSkeleton />}
          emptyMessage={t("employee.table.emptyMessage")}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={t("confirmationModal.employee.titleDelete")}
        message={t("confirmationModal.employee.messageDelete", {employee: selectedEmployee?.fullName ?? ""})}
        confirmText={t("button.delete")}
        cancelText={t("button.cancel")}
        variant="danger"
      />
    </div>
  );
}