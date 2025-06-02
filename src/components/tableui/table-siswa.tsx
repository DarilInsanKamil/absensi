"use client";

import { ResponseTableSiswa } from "@/definitions";
import { formatStatus } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteSiswa } from "@/app/libs/action";
import { toast } from "sonner";
import { DialogSiswaEditForm } from "../dialogui/siswa-editform";
import { useEffect, useState } from "react";

export function TableSiswa({
  children,
  onDelete,
}: {
  children: ResponseTableSiswa[];
  onDelete?: () => void;
}) {
  const [kelas, setKelas] = useState([]);

  useEffect(() => {
    const fetchDataKelas = async () => {
      const res = await fetch("/absensiteknomedia/api/kelas");
      const data = await res.json();
      setKelas(data);
    };
    fetchDataKelas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await useDeleteSiswa(id);

      toast.success("Berhasil", {
        description: "Berhasil Menghapus data siswa.",
      });

      if (onDelete) onDelete();
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat menghapus data siswa.",
      });
    }
  };

  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama</th>
          <th className="px-4 py-2 text-left">NIS</th>
          <th className="px-4 py-2 text-left">Gender</th>
          <th className="px-4 py-2 text-left">Alamat</th>
          <th className="px-4 py-2 text-left">Kelas</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {children.map((child, index) => (
          <tr
            key={index}
            className="border-b border-gray-300 hover:bg-gray-100"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{child.nama}</td>
            <td className="px-4 py-2">{child.nis}</td>
            <td className="px-4 py-2">{child.jenis_kelamin}</td>
            <td className="px-4 py-2">{child.alamat}</td>
            <td className="px-4 py-2">{child.nama_kelas}</td>
            <td className="px-4 py-2">
              <div className="bg-green-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                {formatStatus(child.status_aktif)}
              </div>
            </td>
            <td className="px-4 py-2 flex gap-2 items-center">
              <Button
                className="bg-red-400 "
                size="icon"
                variant="noShadow"
                onClick={() => handleDelete(child.id)}
              >
                <Trash2 />
              </Button>
              <DialogSiswaEditForm
                id={String(child.id)}
                dataKelas={kelas}
                trigger={
                  <Button size="icon" variant="noShadow">
                    <Pencil />
                  </Button>
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
