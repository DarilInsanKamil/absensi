"use client";

import { Suspense, useEffect, useState } from "react";
import { TableSiswa } from "@/components/tableui/table-siswa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogSiswaForm } from "@/components/dialogui/siswa-form";

const Page = () => {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [refresh, setRefresh] = useState(false);
  
  const refreshData = () => setRefresh(prev => !prev);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/siswa", { cache: "no-store" });
      const data = await response.json();
      setSiswa(data);
    };
    const fetchDataKelas = async () => {
      const res = await fetch("/api/kelas");
      const data = await res.json();
      setKelas(data);
    };
    fetchData();
    fetchDataKelas();
  }, [refresh]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Siswa</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar siswa, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogSiswaForm dataKelas={kelas} onSuccess={refreshData}/>
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableSiswa children={siswa} onDelete={refreshData}/>
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
