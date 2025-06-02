"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { TableSiswa } from "@/components/tableui/table-siswa";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogSiswaForm } from "@/components/dialogui/siswa-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Kelas {
  id: number;
  nama_kelas: string;
  wali_kelas: string;
  tahun_ajaran: string;
}
const Page = () => {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/siswa", {
        next: {
          tags: ["siswa"],
          revalidate: 0, // Force revalidation
        },
        cache: "no-store", // Disable cache
      });
      const data = await response.json();
      setSiswa(data);
    };

    const fetchDataKelas = async () => {
      const res = await fetch(`/absensiteknomedia/api/kelas`);
      const data = await res.json();
      setKelas(data);
    };

    fetchData();
    fetchDataKelas();
  }, [refresh]);

  const filteredSiswa = useMemo(() => {
    return siswa.filter((s: any) => {
      if (selectedKelas !== "all") {
        const selectedKelasName = kelas.find(
          (k: Kelas) => k.id.toString() === selectedKelas
        )?.nama_kelas;
        if (s.nama_kelas !== selectedKelasName) return false;
      }

      // Then filter by search query
      if (searchQuery) {
        return (
          s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nis.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return true;
    });
  }, [siswa, selectedKelas, kelas, searchQuery]);

  return (
    <section className="px-6 mt-10">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full">
          <h1 className="text-2xl font-bold">Manajemen Data Siswa</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar siswa, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogSiswaForm dataKelas={kelas} onSuccess={refreshData} />
        </CardFooter>
      </Card>

      <div className="flex gap-5 mt-10 mb-5">
        <Input
          placeholder="Cari nama atau NIS siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedKelas} onValueChange={setSelectedKelas}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {kelas.map((k: Kelas) => (
              <SelectItem key={k.id} value={k.id.toString()}>
                {k.nama_kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableSiswa children={filteredSiswa} onDelete={refreshData} />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
