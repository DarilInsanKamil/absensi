"use client";

import { TableKepsekGuru } from "@/components/tableui/table-kepsek-guru";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [guru, setGuru] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => setRefresh((prev) => !prev);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/absensiteknomedia/api/guru");
      const data = await response.json();
      setGuru(data);
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
        <CardContent className="overflow-auto">
          <TableKepsekGuru children={guru} onDelete={refreshData} />
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
