"use client";

import { DollarSign, Users } from "lucide-react";
import LineChart from "@/components/global/LineChart";
import BarChart from "@/components/global/BarChart";
import PieChart from "@/components/global/PieChart";
import { useAdminDashboardStats } from "@/hooks/dashboard/useAdminDashboardStats";

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
  } = useAdminDashboardStats(token);

  if (loading)
    return <p className="text-center mt-10">Cargando estadísticas...</p>;

  return (
    <div className="text-sm sm:text-base flex flex-col gap-3 mt-3">
      <div className="flex md:flex-row flex-col items-center w-full gap-3">
        <StatCard
          label="Total Facturado"
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

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Ingresos mensuales</h2>
            <LineChart data={monthlyRevenue} xKey="label" yKey="value" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Citas por mes</h2>
            <BarChart data={monthlyAppointments} xKey="label" yKey="value" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">
            Distribución de servicios
          </h2>
          <PieChart
            data={serviceDistribution}
            nameKey="label"
            dataKey="value"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Tipo de facturas</h2>
            <PieChart data={invoiceTypeChart} nameKey="label" dataKey="value" />
          </div>
        </div>
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
