"use client";

import { Suspense, useEffect, useState } from "react";
import Loading from "../loading";
import Link from "next/link";
import { TableSiswa } from "@/components/table-siswa";

const Page = () => {
  const [siswa, setSiswa] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/siswa");
      const data = await response.json();
      setSiswa(data);
    };

    fetchData();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <TableSiswa children={siswa}/>
      </div>
    </Suspense>
  );
};

export default Page;
