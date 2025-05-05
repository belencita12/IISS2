"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
}

function BarChart<T extends Record<string, unknown>>({ data, xKey, yKey }: Props<T>) {
  return (
    <div className="w-full h-72 bg-white p-4 rounded shadow">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey={xKey as string} />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey={yKey as string} fill="#82ca9d" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;