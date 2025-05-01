"use client";

import { DialogJadwalForm } from "@/components/dialogui/jadwal-form";
import { TableJadwal } from "@/components/tableui/table-jadwal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResponseTableJadwal } from "@/definitions";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [jadwal, setJadwal] = useState<ResponseTableJadwal[]>([]);
  const [refresh, setRefresh] = useState(false);
  
  const refreshData = () => setRefresh(prev => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/jadwal");
      const data = await response.json();

      setJadwal(data);
    };

    fetchData();
  }, [refresh]);

  return (
    <section className="px-6 mt-10 ">
      <Card className="flex md:flex-row flex-col justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Jadwal</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola jadwal, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogJadwalForm onSuccess={refreshData}/>
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Card className="overflow-y-scroll">
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableJadwal children={jadwal} onDelete={refreshData}/>
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};
export default Page;
