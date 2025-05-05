"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props<T extends { [key: string]: unknown }> {
  data: T[];
  nameKey: keyof T;
  dataKey: keyof T;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57"];

const PieChart = <T extends { [key: string]: unknown }>({
  data,
  nameKey,
  dataKey,
}: Props<T>) => {
  return (
    <div className="w-full h-72 bg-white p-4 rounded shadow flex gap-4">
      <div className="w-2/3 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip
              formatter={(value: number) =>
                `Cantidad: ${value.toLocaleString("es-PY")}`
              }
            />
            <Pie
              data={data}
              dataKey={dataKey as string}
              nameKey={nameKey as string}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda personalizada */}
      <div className="w-1/3 flex flex-col justify-center gap-2 text-sm">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium">{entry[nameKey] as string}</span>
            <span className="text-gray-500 ml-auto">
              {(entry[dataKey] as number).toLocaleString("es-PY")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
