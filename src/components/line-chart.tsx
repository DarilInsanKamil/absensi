"use client";

import { Tooltip } from "@radix-ui/react-tooltip";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface TrendChartProps {
  data: {
    tanggal: string;
    kehadiran_persen: number;
  }[];
}

export function AttendanceTrendChart({ data }: TrendChartProps) {
  // Process data for the chart - get last 14 days
  const chartData = data
    .reduce((acc: any[], curr) => {
      const date = new Date(curr.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      const existing = acc.find((item) => item.name === date);
      if (existing) {
        existing.value = (existing.value + curr.kehadiran_persen) / 2;
      } else {
        acc.push({
          name: date,
          value: curr.kehadiran_persen,
        });
      }
      return acc;
    }, [])
    .slice(-14);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <Line dataKey="value" className="stroke-primary" strokeWidth={2} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
