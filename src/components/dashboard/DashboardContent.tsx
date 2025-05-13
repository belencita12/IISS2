"use client";

import { DollarSign, Users } from "lucide-react";
import LineChart from "@/components/global/LineChart";
import BarChart from "@/components/global/BarChart";
import PieChart from "@/components/global/PieChart";
import { useAdminDashboardStats } from "@/hooks/dashboard/useAdminDashboardStats";
import DashboardContentSkeleton from "./skeleton/DashboardContentSkeleton";

interface Props {
  token: string;
}

export default function DashboardContent({ token }: Props) {
  const {
    loading,
    totalRevenue,
    invoiceCount,
    appointmentCount,
    monthlyRevenue,
    monthlyAppointments,
    serviceDistribution,
    invoiceTypeChart,
    groupTopNWithOthers
  } = useAdminDashboardStats(token);

  const groupedServiceData = groupTopNWithOthers(serviceDistribution, 6);

  if (loading) {
    return <DashboardContentSkeleton />;
  }

  return (
    <div className="text-sm sm:text-base flex flex-col gap-6 mt-4 p-4">
      {/* Tarjetas resumen */}
      <div className="flex md:flex-row flex-col items-center w-full gap-3">
        <StatCard
          label="Total facturado"
          value={`Gs. ${totalRevenue.toLocaleString("es-PY")}`}
          icon={<DollarSign size={32} className="text-green-500" />}
        />
        <StatCard
          label="Facturas emitidas"
          value={invoiceCount}
          icon={<Users size={32} className="text-blue-500" />}
        />
        <StatCard
          label="Citas agendadas"
          value={appointmentCount}
          icon={<Users size={32} className="text-purple-500" />}
        />
      </div>

      {/* Pie charts arriba */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Distribución por servicio</h2>
          <PieChart data={groupedServiceData} nameKey="label" dataKey="value" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Distribución por tipo de factura</h2>
          <PieChart data={invoiceTypeChart} nameKey="label" dataKey="value" />
        </div>
      </div>

      {/* Gráfico de líneas */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Ingresos mensuales</h2>
        <LineChart data={monthlyRevenue} xKey="label" yKey="value" />
      </div>

      {/* Gráfico de barras */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Citas por mes</h2>
        <BarChart data={monthlyAppointments} xKey="label" yKey="value" />
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white w-full md:flex-1 p-4 shadow rounded-lg flex items-center justify-between">
    <div>
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    {icon}
  </div>
);
