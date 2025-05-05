"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props<T extends Record<string, unknown>> {
  data: T[];
  nameKey: keyof T;
  dataKey: keyof T;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function PieChart<T extends Record<string, unknown>>({ data, nameKey, dataKey }: Props<T>) {
  return (
    <div className="w-full h-72 bg-white p-4 rounded shadow">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={dataKey as string}
            nameKey={nameKey as string}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;
