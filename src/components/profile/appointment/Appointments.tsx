"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APPOINTMENT_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api/useFetch";
import { formatDate, formatTimeUTC } from "@/lib/utils";
import { Plus, Eye } from "lucide-react";
import { AppointmentData } from "@/lib/appointment/IAppointment";
import AppointmentsTableSkeleton from "@/components/profile/skeleton/AppointmentsSkeleton";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { useRouter } from "next/navigation";

interface AppointmentsData {
  data: AppointmentData[];
  total: number;
}

interface AppointmentsProps {
  clientId: number;
  token: string;
  ruc: string | null;
}

export const Appointments = ({ token, ruc }: AppointmentsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [executed, setExecuted] = useState(false);
  const router = useRouter();

  const {
    data: appointmentsResponse,
    loading,
    error: fetchError,
    execute,
  } = useFetch<AppointmentsData>(APPOINTMENT_API, token, { immediate: false });

  useEffect(() => {
    if (ruc && !executed) {
      fetchAppointments(currentPage);
      setExecuted(true);
    }
  }, [ruc, executed]);

  const fetchAppointments = (page: number) => {
    if (!ruc) return;
    
    const url = new URL(APPOINTMENT_API);
    url.searchParams.append("clientRuc", ruc);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", pageSize.toString());

    execute(undefined, url.toString());
    setCurrentPage(page);
  };

  const handlePageChange = (page: number) => {
    fetchAppointments(page);
  };

  const error = !ruc
    ? "No se pudo obtener el RUC del cliente"
    : fetchError?.message || null;

  const appointments = appointmentsResponse?.data || [];
  const totalItems = appointmentsResponse?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const statusInfo = (st: AppointmentData["status"]) => {
    switch (st) {
      case "COMPLETED":
        return { txt: "Completada", style: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { txt: "Cancelada", style: "bg-red-100 text-red-800" };
      case "IN_PROGRESS":
        return { txt: "En progreso", style: "bg-blue-100 text-blue-800" };
      default:
        return { txt: "Pendiente", style: "bg-yellow-100 text-yellow-800" };
    }
  };

  // Definir las columnas para la tabla genérica
  const columns: Column<AppointmentData>[] = [
    {
      header: "Mascota",
      accessor: (app) => (
        <div>
          <p className="font-medium">{app.pet.name}</p>
        </div>
      ),
    },
    {
      header: "Servicio",
      accessor: (app) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{app.service}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Encargado",
      accessor: (app) => (
        <div className="flex items-center gap-2">
          <div>
            {app.employees && app.employees.length > 0 ? (
              app.employees.map((emp, i) => (
                <p
                  key={emp.id}
                  className={i > 0 ? "font-medium" : "font-medium"}
                >
                  {emp.name}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-500">No asignado</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Detalles",
      accessor: (app) => (
        <div className="flex items-start gap-2">
          <p className="font-medium">{app.details || "Sin detalles"}</p>
        </div>
      ),
    },
    {
      header: "Fecha",
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatDate(app.designatedDate)}</p>
        </div>
      ),
    },
    {
      header: "Hora",
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatTimeUTC(app.designatedDate)}</p>
        </div>
      ),
    },
    {
      header: "Estado",
      accessor: (app) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            statusInfo(app.status).style
          }`}
        >
          {statusInfo(app.status).txt}
        </span>
      ),
    },
  ];
  
  const actions: TableAction<AppointmentData>[] = [
    {
      icon: <Eye size={16} />,
      onClick: (item) => router.push(`/user-profile/appointment/${item.id}`),
      label: "Ver detalles",
    },
  ];

  return (
    <section className="w-full px-6 mt-5 bg-white rounded-lg shadow-sm pb-5 min-h-[80vh]">
      <div className="text-center">
        <h3 className="text-3xl font-bold mt-2 text-purple-600">
          Citas Agendadas
        </h3>
        <p className="text-gray-500 mt-2 text-sm">
          Consulta y agenda nuevas citas médicas para tus mascotas
        </p>

        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          <Link href="/user-profile/appointment/register">
            <Button className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600">
              <Plus className="w-5 h-5" />
              Agendar Cita
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        {loading ? (
          <AppointmentsTableSkeleton />
        ) : (
          <GenericTable
            data={appointments}
            columns={columns}
            actions={actions}
            actionsTitle="Acciones"
            isLoading={loading}
            emptyMessage="No tienes citas agendadas"
            className="w-full"
            pagination={{
              currentPage,
              totalPages,
              totalItems,
              pageSize
            }}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};