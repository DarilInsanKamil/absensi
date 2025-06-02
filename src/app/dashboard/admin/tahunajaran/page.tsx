"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TableTahunAjaran } from "@/components/tableui/table-tahunajaran";
import { DialogTahunAjaranForm } from "@/components/dialogui/tahunjaran-form";

const Page = () => {
  const [tahunAjaran, setTahunAjaran] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const refreshData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/tahunajaran", {
        cache: "no-store",
      });
      const data = await response.json();
      setTahunAjaran(data);
    };
    fetchData();
  }, [refresh]);

  const filteredTahunAjaran = useMemo(() => {
    return tahunAjaran.filter((s: any) => {
      // Then filter by search query
      if (searchQuery) {
        return s.nama.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [tahunAjaran, searchQuery]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Tahun Ajaran</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar tahun ajaran, serta informasi penting
            lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogTahunAjaranForm onSuccess={refreshData} />
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input
          placeholder="Cari nama tahun ajaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableTahunAjaran
              children={filteredTahunAjaran}
              onDelete={refreshData}
            />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
