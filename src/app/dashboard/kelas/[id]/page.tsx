"use client";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../loading";
import { TableSiswa } from "@/components/table-siswa";
import { TableAbsenSiswa } from "@/components/table-absen-siswa";

const Page = () => {
  const [siswa, setSiswa] = useState([]);
  const params = useParams();
  const id: any = params?.id;

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/kelas/" + id);
      const data = await res.json();
      setSiswa(data);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {siswa.length !== 0 ? <TableAbsenSiswa children={siswa} /> : <Loading />}
      </Suspense>
    </div>
  );
};

export default Page;
