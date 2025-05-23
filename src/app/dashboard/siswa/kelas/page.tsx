"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogKelasForm } from "@/components/dialogui/kelas-form";
import { TableKelas } from "@/components/tableui/table-kelas";
import { TableKepsekKelas } from "@/components/tableui/table-kepsek-kelas";

const Page = () => {
  const [kelas, setKelas] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => setRefresh((prev) => !prev);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/kelas", { cache: "no-store" });
      const data = await response.json();
      setKelas(data);
    };

    fetchData();
  }, [refresh]);

  return (
    <section className="px-6 mt-10 ">
      
      <div className="flex gap-5 mt-10 mb-5">
        <Input placeholder="search.." />
        <Button>Search</Button>
      </div>
      <Card>
        <Suspense fallback={<p>Loading...</p>}>
          <CardContent className="overflow-auto">
            <TableKepsekKelas children={kelas} onDelete={refreshData} />
          </CardContent>
        </Suspense>
      </Card>
    </section>
  );
};

export default Page;
