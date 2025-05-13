"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APPOINTMENT_API } from "@/lib/urls";
import { useFetch } from "@/hooks/api/useFetch";
import { formatDate, formatTimeUTC } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AppointmentData } from "@/lib/appointment/IAppointment";
import AppointmentsTableSkeleton from "@/components/profile/skeleton/AppointmentsSkeleton";
import { Eye } from "lucide-react";
import GenericTable, {
  Column,
  TableAction,
} from "@/components/global/GenericTable";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";


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
  const [executed, setExecuted] = useState(false);
  const router = useRouter();
  const t = useTranslations("Appointments");
  const e = useTranslations("Error");
  const a= useTranslations("AppointmentTable");
  const b = useTranslations("Button");


  const {
    data: appointmentsResponse,
    loading,
    error: fetchError,
    execute,
  } = useFetch<AppointmentsData>(APPOINTMENT_API, token, { immediate: false });

  useEffect(() => {
    if (ruc && !executed) {
      const url = new URL(APPOINTMENT_API);
      url.searchParams.append("clientRuc", ruc);
      url.searchParams.append("page", "1");
      url.searchParams.append("size", "100");

      execute(undefined, url.toString());
      setExecuted(true);
    }
  }, [ruc, executed, execute]);

  const error = !ruc
    ? e("noGetRuc")
    : fetchError?.message || null;

  const appointments = appointmentsResponse?.data || [];

  const iconFor = (svc: string) => svc.toLowerCase().includes("vacun");

  const statusInfo = (st: AppointmentData["status"]) => {
    switch (st) {
      case "COMPLETED":
        return { txt: a("completed"), style: "bg-green-100 text-green-800" };
      case "CANCELLED":
        return { txt: a("canceled"), style: "bg-red-100 text-red-800" };
      case "IN_PROGRESS":
        return { txt: a("inProgress"), style: "bg-blue-100 text-blue-800" };
      default:
        return { txt: a("pending"), style: "bg-yellow-100 text-yellow-800" };
    }
  };

  // Definir las columnas para la tabla genérica
  const columns: Column<AppointmentData>[] = [
    {
      header: a("pet"),
      accessor: (app) => (
        <div>
          <p className="font-medium">{app.pet.name}</p>
        </div>
      ),
    },
    {
      header: a("service"),
      accessor: (app) => (
        <div className="flex items-center gap-3">
          {iconFor(app.service)}
          <div>
            <p className="font-medium">{app.service}</p>
          </div>
        </div>
      ),
    },
    {
      header: a("employee"),
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
              <p className="text-sm text-gray-500">{e("noAsigned")}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: a("details"),
      accessor: (app) => (
        <div className="flex items-start gap-2">
          <p className="font-medium">{app.details || "Sin detalles"}</p>
        </div>
      ),
    },
    {
      header: a("date"),
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatDate(app.designatedDate)}</p>
        </div>
      ),
    },
    {
      header: a("time"),
      accessor: (app) => (
        <div>
          <p className="font-medium">{formatTimeUTC(app.designatedDate)}</p>
        </div>
      ),
    },
    {
      header: a("status"),
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
      label: b("seeDetails"),
    },
  ];
  
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <section className="w-full px-6 mt-5 bg-white rounded-lg shadow-sm pb-5 min-h-[80vh]">
      <div className="text-center">
        <h3 className="text-3xl font-bold mt-2 text-purple-600">
          {t("appointmentTitle")}
        </h3>
        <p className="text-gray-500 mt-2 text-sm">
          {t("appointmentsDescription")}
        </p>

        <div className="flex gap-4 mt-4 justify-center flex-wrap">
          <Link href="/user-profile/appointment/register">
            <Button className="bg-pink-500 text-white flex items-center gap-2 hover:bg-pink-600">
              <Plus className="w-5 h-5" />
              {b("schedule")}
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
          actionsTitle={a("actions")}
          isLoading={loading}
          emptyMessage="No tienes citas agendadas"
          className="w-full"
        />
        )}
      </div>
    </section>
  );
};