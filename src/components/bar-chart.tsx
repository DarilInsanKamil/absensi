"use client";

import { Tooltip } from "@radix-ui/react-tooltip";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer } from "./ui/chart";

interface ClassComparisonProps {
  data: {
    nama_kelas: string;
    total_siswa: number;
    total_hadir: number;
  }[];
}

export function ClassComparisonChart({ data }: ClassComparisonProps) {
  // Process data - calculate attendance percentage per class
  const chartData = data.reduce((acc: any[], curr) => {
    const existing = acc.find((item) => item.name === curr.nama_kelas);
    if (existing) {
      existing.value =
        (existing.value + (curr.total_hadir / curr.total_siswa) * 100) / 2;
    } else {
      acc.push({
        name: curr.nama_kelas,
        value: (curr.total_hadir / curr.total_siswa) * 100,
      });
    }
    return acc;
  }, []);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
