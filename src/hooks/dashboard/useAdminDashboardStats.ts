import { usePaginatedFetch } from "@/hooks/api/usePaginatedFetch";
import { toast } from "@/lib/toast";
import { INVOICE_API, APPOINTMENT_API, SERVICE_TYPE } from "@/lib/urls";
import { Invoice } from "@/lib/invoices/IInvoice";
import { AppointmentData } from "@/lib/appointment/IAppointment";
import { ServiceType } from "@/lib/service-types/IServiceType";

interface MonthlyStat {
  label: string;
  value: number;
  [key: string]: string | number;
}


// Helper para agrupar por mes
const aggregateByMonth = <T>(
  data: T[],
  dateKey: keyof T,
  valueKey?: keyof T
): MonthlyStat[] => {
  const result: Record<string, number> = {};

  data.forEach((item) => {
    const rawDate = item[dateKey];
    if (!rawDate || typeof rawDate !== "string") return;

    const date = new Date(rawDate);
    const label = date.toLocaleString("es-PY", { month: "short", year: "numeric" });
    if (!result[label]) result[label] = 0;

    if (valueKey && typeof item[valueKey] === "number") {
      result[label] += item[valueKey] as number;
    } else {
      result[label] += 1;
    }
  });

  return Object.entries(result).map(([label, value]) => ({ label, value }));
};

export const useAdminDashboardStats = (token: string) => {
  // 📟 Facturas
  const {
    data: invoices,
    loading: invoiceLoading,
    error: invoiceError,
  } = usePaginatedFetch<Invoice>(INVOICE_API, token, {
    initialPage: 1,
    size: 1000,
    autoFetch: true,
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const invoiceCount = invoices.length;
  const monthlyRevenue = aggregateByMonth<Invoice>(invoices, "issueDate", "total");

  // 📅 Citas
  const {
    data: appointments,
    loading: appointmentLoading,
    error: appointmentError,
  } = usePaginatedFetch<AppointmentData>(APPOINTMENT_API, token, {
    initialPage: 1,
    size: 1000,
    autoFetch: true,
  });

  const appointmentCount = appointments.length;
  const monthlyAppointments = aggregateByMonth<AppointmentData>(appointments, "designatedDate");

  // 🣼 Servicios
  const {
    data: services,
    loading: servicesLoading,
    error: servicesError,
  } = usePaginatedFetch<ServiceType>(SERVICE_TYPE, token, {
    initialPage: 1,
    size: 1000,
    autoFetch: true,
  });

  const serviceCount = services.length;

  const loading = invoiceLoading || appointmentLoading || servicesLoading;

  const invoiceTypeDistribution = invoices.reduce<Record<string, number>>((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + 1;
    return acc;
  }, {});

  // 💬 Traducción de tipos de factura
  const invoiceTypeLabels: Record<string, string> = {
    CASH: "Contado",
    CREDIT: "Crédito",
  };

  const invoiceTypeChart = Object.entries(invoiceTypeDistribution).map(
    ([label, value]) => ({
      label: invoiceTypeLabels[label] || label, // ← traducido
      value,
    })
  );


  if (invoiceError || appointmentError || servicesError) {
    toast("error", "Error al cargar estadísticas del dashboard");
  }

  // Contar cuántas veces aparece cada servicio en las citas
  const serviceCountMap = appointments.reduce<Record<string, number>>((acc, appt) => {
    const serviceName = appt.service;
    acc[serviceName] = (acc[serviceName] || 0) + 1;
    return acc;
  }, {});

  // Formatear para el gráfico
  const serviceDistribution = Object.entries(serviceCountMap).map(([label, value]) => ({
    label,
    value,
  }));


  return {
    loading,
    totalRevenue,
    invoiceCount,
    appointmentCount,
    serviceCount,
    services,
    appointments,
    monthlyRevenue,
    monthlyAppointments,
    serviceDistribution,
    invoiceTypeChart,
  };
};
