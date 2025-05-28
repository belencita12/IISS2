"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import type { AppointmentData } from "@/lib/appointment/IAppointment"
import { getAppointmentByPetId } from "@/lib/appointment/getAppointmentByPetId"
import { formatDate } from "@/lib/utils"
import GenericTable, { type Column, type PaginationInfo, type TableAction } from "@/components/global/GenericTable"
import { useRouter } from "next/navigation"
import AppointmentListSkeleton from "./skeleton/AppointmentListSkeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

interface AppointmentListProps {
  petId: number
  token: string
}

export default function AppointmentList({
  petId,
  token,
}: AppointmentListProps) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  const t = useTranslations();

  const estadoCitaEsp: Record<string, string> = {
    COMPLETED: t("appointmentStatus.completed"),
    CANCELLED: t("appointmentStatus.cancelled"),
    PENDING: t("appointmentStatus.pending"),
    IN_PROGRESS: t("appointmentStatus.inProgress"),
  };

  const estadoColorMap: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const fetchAppointments = async (page = 1) => {
    if (!petId || !token) return;
    setLoadingAppointments(true);
    try {
      const data = await getAppointmentByPetId(
        petId,
        token,
        page,
        pagination.pageSize
      );
      setAppointments(data);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalItems: data.length,
      }));
      setErrorAppointments(null);
    } catch (error:unknown) {
      if(error instanceof Error) setErrorAppointments(error.message)
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

  const appointmentColumns: Column<AppointmentData>[] = [
    {
      header: t("appointmentTable.date"),
      accessor: (a) => formatDate(a.designatedDate),
      className: "font-medium",
    },
    {
      header: t("appointmentTable.services"),
      accessor: (a) => a.service || (a.services && a.services.length > 0 ? a.services.map(s => s.name).join(", ") : t("error.withoutServices")),
    },
    {
      header: t("appointmentTable.details"),
      accessor: (a) => a.details || t("error.noDetails"),
    },
    {
      header: t("appointmentTable.employee"),
      accessor: (a) =>
        (a.employees && a.employees.length > 0) 
          ? a.employees.map((e) => e.name).join(", ") 
          : a.employee 
            ? a.employee.name 
            : t("error.noAsigned"),
    },
    {
      header: t("appointmentTable.status"),
      accessor: (a) => (
        <Badge
          className={`border ${
            estadoColorMap[a.status] ||
            "bg-gray-100 text-gray-800 border-gray-200"
          } hover:bg-none hover:text-inherit hover:shadow-none hover:border-inherit pointer-events-none`}
        >
          {estadoCitaEsp[a.status] || a.status}
        </Badge>
      ),
    },
  ];

  const appointmentActions: TableAction<AppointmentData>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      onClick: (appointment: AppointmentData) => {
        router.push(`/user-profile/appointment/${appointment.id}`);
      },
      label: t("button.seeDetails"),
    },
  ];

  if (errorAppointments) {
    return <div className="text-red-500">{errorAppointments}</div>;
  }

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <GenericTable<AppointmentData>
          data={appointments}
          columns={appointmentColumns}
          actions={appointmentActions}
          actionsTitle={t("appointmentTable.actions")}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={loadingAppointments}
          skeleton={<AppointmentListSkeleton />}
          emptyMessage={t("appointmentTable.emptyMessage")}
          className="mb-0"
        />
      </CardContent>
    </Card>
  );
}