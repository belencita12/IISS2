"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
}

function LineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
}: Props<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey as string} />
        <YAxis
          width={120}
          tickFormatter={(value) =>
            `Gs. ${Number(value).toLocaleString("es-PY")}`
          }
        />
        <Tooltip
          formatter={(value: number) => [
            `Gs. ${value.toLocaleString("es-PY")}`,
            "Monto",
          ]}
          labelFormatter={(label) => `Mes: ${label}`}
        />
        <Legend formatter={() => "Monto"} />
        <Line type="monotone" dataKey={yKey as string} stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
