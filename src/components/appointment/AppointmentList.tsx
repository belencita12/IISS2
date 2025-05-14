"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Appointment } from "@/lib/appointment/IAppointment";
import { getAppointmentByPetId } from "@/lib/appointment/getAppointmentByPetId";
import { formatDate } from "@/lib/utils";
import GenericTable, { Column, PaginationInfo, TableAction } from "@/components/global/GenericTable";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AppointmentListSkeleton from "./skeleton/AppointmentListSkeleton";


interface AppointmentListProps {
  petId: number;
  token: string;
}

type AppointmentApiResponse = {
  data: Appointment[];
  total: number;
  size: number;
  prev: boolean;
  next: boolean;
  currentPage: number;
  totalPages: number;
};

export default function AppointmentList({ petId, token }: AppointmentListProps) {
  const router = useRouter();

  const a= useTranslations("AppointmentTable");
  const b= useTranslations("Button");
  const e= useTranslations("Error");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 100,
  });

  const estadoCitaEsp: Record<string, string> = {
    COMPLETED: a("completed"),
    CANCELLED: a("canceled"),
    PENDING: a("pending"),
    IN_PROGRESS: a("inProgress"),
  };

  const fetchAppointments = async (page = 1) => {
    if (!petId || !token) return;
    setLoadingAppointments(true);
    try {
      const data = await getAppointmentByPetId(petId, token, page, pagination.pageSize);
      setAppointments(data);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalItems: data.length,
      }));
      setErrorAppointments(null);
    } catch (error) {
      setErrorAppointments(e("notLoadingAppointments"));
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId, token]);

  const handlePageChange = (page: number) => {
    fetchAppointments(page);
  };

  const appointmentColumns: Column<Appointment>[] = [
    {
      header: a("details"),
      accessor: "details",
    },
    {
      header: a("date"),
      accessor: (a) => formatDate(a.designatedDate),
    },
    {
      header: a("service"),
      accessor: "service",
    },
    {
      header: a("employee"),
      accessor: (a) => a.employees?.map(e => e.name).join(", ") || e("noAsigned"),
    },
    {
      header: a("status"),
      accessor: (a) => estadoCitaEsp[a.status] || a.status,
    },
  ];

  const appointmentActions: TableAction<Appointment>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (appointment: Appointment) => {
        router.push(`/user-profile/appointment/${appointment.id}`);
      },
      label: b("seeDetails"),
    }
  ];

  if (errorAppointments) {
    return <div className="text-red-500">{errorAppointments}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">{a("appointmentTitle")}</h2>
      <GenericTable<Appointment>
        data={appointments}
        columns={appointmentColumns}
        actions={appointmentActions}
        actionsTitle={a("actions")}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={loadingAppointments}
        emptyMessage={e("notFoundAppointments")}
        skeleton={<AppointmentListSkeleton />}
        className="mb-10"
      />
    </div>
  );
}