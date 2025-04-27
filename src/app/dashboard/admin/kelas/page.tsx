'use client'

import { KelasBoxComponent } from "@/components/kelas-boxcomponents";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogSiswaForm } from "@/components/dialogui/siswa-form";

const Page = () => {

  const [kelas, setKelas] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch("/api/kelas");
        const data = await response.json();
        setKelas(data);
      };
  
      fetchData();
    }, []);



  return (
    <section className="px-6 mt-10 ">
      <Card className="flex flex-row justify-between relative">
        <CardHeader className="w-full ">
          <h1 className="text-2xl font-bold">Manajemen Data Kelas</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar kelas, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <DialogSiswaForm/>
        </CardFooter>
      </Card>
      <div className="flex gap-5 mt-10 mb-5">
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Card>
          <CardContent>
            {kelas.map((item: any) => {
              return (
                <KelasBoxComponent
                  key={item.id}
                  kelas={item.nama_kelas}
                  id={item.id}
                />
              );
            })}
          </CardContent>
        </Card>
      </Suspense>
    </section>
  );
};

export default Page;
