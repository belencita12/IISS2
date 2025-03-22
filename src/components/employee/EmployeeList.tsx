"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import GenericTable, { Column, TableAction, PaginationInfo } from "@/components/global/GenericTable";
import { fetchEmployees } from "@/lib/employee/getEmployees";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { EmployeeData } from "@/lib/employee/IEmployee";
import { deleteEmployeeByID } from "@/lib/employee/deleteEmployeeByID";
import { ConfirmationModal } from "../global/Confirmation-modal";

interface EmployeesTableProps {
  token: string | null;
}

export default function EmployeesTable({ token }: EmployeesTableProps) {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{
    employees: EmployeeData[];
    pagination: PaginationInfo;
  }>({
    employees: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 8 },
  });
  const [loading, setLoading] = useState(false);

  const loadEmployees = useCallback(
    async (page: number = 1, query: string = "") => {
      if (!token) return;
      setLoading(true);
      try {
        const results = await fetchEmployees(page, query, token);
        if (!results?.data?.length && query) toast("info", "No se encontraron empleados!");
        setData({
          employees: results?.data || [],
          pagination: {
            currentPage: results?.currentPage || 1,
            totalPages: results?.totalPages || 1,
            totalItems: results?.total || 0,
            pageSize: results?.size || 8,
          },
        });
      } catch (error) {
        toast("error", "Error al cargar empleados");
        console.error("Error cargando empleados:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) loadEmployees(data.pagination.currentPage);
  }, [token, data.pagination.currentPage, loadEmployees]);

  const handleSearch = (query: string) => loadEmployees(1, query);
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
        toast("success", "Empleado eliminado correctamente.");
        loadEmployees(data.pagination.currentPage);
      } else {
        toast("error", "No se pudo eliminar el empleado.");
      }
    
      setIsModalOpen(false);
      setSelectedEmployee(null);
    };
    

  const columns: Column<EmployeeData>[] = [
    { header: "Nombre", accessor: "fullName" },
    { header: "Correo", accessor: "email" },
    { header: "Cargo", accessor: (employee) => employee.position.name },
  
  ];

  const actions: TableAction<EmployeeData>[] = [
    {
      icon: <Pencil className="w-4 h-4" />, 
      onClick: (employee) => console.log("Editar", employee), 
      label: "Editar",
    },
    {
      icon: <Trash className="w-4 h-4" />,
      onClick: confirmDelete, 
      label: "Eliminar",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between space-x-3 items-center mb-4">
        <Input
          className="w-full"
          placeholder="Buscar un empleado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex"> 
          <Button onClick={() => handleSearch(search)}>Buscar</Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 space-y-3">
        <h1 className="text-2xl font-semibold">Empleados</h1>
        <Button 
          className="bg-white text-black border border-gray-300 hover:bg-gray-100"
          onClick={() => router.push("/dashboard/employee/register")}
        >
          Agregar
        </Button>
      </div>
      <GenericTable
        data={data.employees}
        columns={columns}
        actions={actions}
        pagination={data.pagination}
        onPageChange={handlePageChange}
        isLoading={loading}
        emptyMessage="No se encontraron empleados"
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Empleado"
        message={`¿Seguro que quieres eliminar a ${selectedEmployee?.fullName}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}