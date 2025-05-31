"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogTahunAjaranForm } from "@/components/dialogui/tahunjaran-form";
import { TableMatpel } from "@/components/tableui/table-matpel";
import { DialogMatpelForm } from "@/components/dialogui/matpel-form";

const Page = () => {
  const [mapel, setMapel] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/matpel", { cache: "no-store" });
      const data = await response.json();
      setMapel(data);
    };
    fetchData();
  }, [refresh]);

  const filteredMapel = useMemo(() => {
    return mapel.filter((m: any) => {
      if (searchQuery) {
        return (
          m.kode_mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  }, [mapel, searchQuery]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Mata Pelajaran</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar mata pelajaran, serta informasi penting
            lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogMatpelForm onSuccess={refreshData} />
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input
          placeholder="Cari kode atau nama mapel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableMatpel children={filteredMapel} onDelete={refreshData} />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
