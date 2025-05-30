"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  const refreshData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/tahunajaran", { cache: "no-store" });
      const data = await response.json();
      setTahunAjaran(data);
    };
    fetchData();
  }, [refresh]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Tahun Ajaran</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar tahun ajaran, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogTahunAjaranForm onSuccess={refreshData} />
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableTahunAjaran children={tahunAjaran} onDelete={refreshData} />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
