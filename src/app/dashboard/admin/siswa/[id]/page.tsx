"use client";
import Loading from "@/app/dashboard/loading";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Page = () => {
  const [siswa, setSiswa] = useState([]);
  const params = useParams();
  const id: any = params?.id;

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/siswa/" + id);
      const data = await res.json();
      setSiswa(data);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {siswa &&
          siswa?.map((item: any) => {
            return (
              <div key={item.id}>
                <p>{item.nama}</p>
                <p>{item.nis}</p>
                <p>{item.email}</p>
                <p>{item.no_telepon}</p>
                <p>{item.jenis_kelamin}</p>
              </div>
            );
          })}
      </Suspense>
    </div>
  );
};

export default Page;
