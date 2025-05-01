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
import React, { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [guru, setGuru] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => setRefresh((prev) => !prev);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/guru");
      const data = await response.json();
      setGuru(data);
    };

    fetchData();
  }, [refresh]);
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
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableGuru children={guru} onDelete={refreshData}/>
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
