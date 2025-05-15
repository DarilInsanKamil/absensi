"use client";

import { Button } from "@/components/ui/button";
import { SiswaAbsen } from "@/definitions";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TableSiswaAbsen = ({ children }: { children: SiswaAbsen[] }) => {
  return (
    <table className="min-w-full bg-white rounded-lg overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700 relative ">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama Siswa</th>
          <th className="px-4 py-2 text-left">NIS</th>
          <th className="px-4 py-2 text-left">Kelas</th>
          <th className="px-4 py-2 text-left">Tahun Ajaran</th>
          <th className="px-4 py-2 text-left">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {children.map((res, index: number) => (
          <tr
            key={index}
            className="border-b border-gray-300 hover:bg-gray-100 relative bg-white"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{res.nama}</td>
            <td className="px-4 py-2">{res.nis}</td>
            <td className="px-4 py-2">{res.nama_kelas}</td>
            <td className="px-4 py-2">{res.tahun_ajaran}</td>
            <td className="px-4 py-2 flex gap-2">
              <Button size="sm">
                <Pencil />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Page = () => {
  const [siswa, setSiswa] = useState<SiswaAbsen[]>([]);
  const params = useParams();
  const id = decodeURIComponent((params?.id_kelas as string) || " ");

  useEffect(() => {
    async function fetchPosts() {
      console.log(id);
      const getData = await fetch(`/api/input-absen/${id}`);
      const data = await getData.json();
      setSiswa(data);
    }
    fetchPosts();
  }, []);

  return (
    <section>
      <TableSiswaAbsen children={siswa} />
    </section>
  );
};

export default Page;
