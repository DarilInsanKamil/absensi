"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminAbsensiTable } from "@/components/tableui/table-absensi";
import { useState, useEffect } from "react";
import { AdminFilter } from "@/components/admin-fiter";

interface AbsensiData {
  id: string;
  tanggal: string;
  nama_siswa: string;
  nis: string;
  nama_kelas: string;
  nama_mapel: string;
  nama_guru: string;
  status: string;
  keterangan?: string;
}

const Page = () => {
  const [data, setData] = useState<AbsensiData[]>([]);
  const [filteredData, setFilteredData] = useState<AbsensiData[]>([]);
  const [classList, setClassList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/absensi/admin");
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData);

      const classes = [
        ...new Set(jsonData.map((item: AbsensiData) => item.nama_kelas)),
      ];
      setClassList(classes as string[]);
    };

    fetchData();
  }, []);
  console.log(data);
  const handleFilterChange = ({
    startDate,
    endDate,
    kelas,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    kelas: string | null;
  }) => {
    let filtered = [...data];

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.tanggal);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    if (kelas) {
      filtered = filtered.filter((item) => item.nama_kelas === kelas);
    }

    setFilteredData(filtered);
  };

  // Calculate summary from filtered data
  const summary = filteredData.reduce(
    (acc: any, curr) => {
      acc.total++;
      acc[curr.status]++;
      return acc;
    },
    { total: 0, hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Data Absensi</h1>
      </div>

      <AdminFilter classList={classList} onFilterChange={handleFilterChange} />

      {/* ...existing summary cards... */}

      <AdminAbsensiTable data={filteredData} />
    </div>
  );
};

export default Page;
