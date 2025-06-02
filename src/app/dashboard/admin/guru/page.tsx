"use client";

import { DialogGuruForm } from "@/components/dialogui/guru-form";
import { TableGuru } from "@/components/tableui/table-guru";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [guru, setGuru] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/guru");
      const data = await response.json();
      setGuru(data);
    };

    fetchData();
  }, [refresh]);

  // Filter guru based on search query
  const filteredGuru = useMemo(() => {
    return guru.filter((g: any) => {
      if (searchQuery) {
        return (
          g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.nip.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  }, [guru, searchQuery]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Guru</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar guru, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogGuruForm onSuccess={refreshData} />
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input
          placeholder="Cari nama atau NIP guru..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Card>
        <CardContent className="overflow-auto">
          <TableGuru children={filteredGuru} onDelete={refreshData} />
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
