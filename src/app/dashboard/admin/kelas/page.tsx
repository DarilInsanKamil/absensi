"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogKelasForm } from "@/components/dialogui/kelas-form";
import { TableKelas } from "@/components/tableui/table-kelas";

const Page = () => {
  const [kelas, setKelas] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = () => setRefresh((prev) => !prev);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/kelas", { cache: "no-store" });
      const data = await response.json();
      setKelas(data);
    };

    fetchData();
  }, [refresh]);

  const filteredKelas = useMemo(() => {
    return kelas.filter((k: any) => {
      if (searchQuery) {
        return k.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [kelas, searchQuery]);
  
  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row flex-col justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Kelas</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar kelas, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogKelasForm onSuccess={refreshData} />
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
            <TableKelas children={filteredKelas} onDelete={refreshData} />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
