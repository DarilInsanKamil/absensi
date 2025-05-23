"use client";

import { ResponseTableKelas } from "@/definitions";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteKelas, useDeleteSiswa } from "@/app/libs/action";
import { toast } from "sonner";
import { Suspense } from "react";

export function TableKepsekKelas({
  children,
  onDelete,
}: {
  children: ResponseTableKelas[];
  onDelete?: () => void;
}) {
  const handleDelete = async (id: number) => {
    try {
      await useDeleteKelas(id);

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
          <th className="px-4 py-2 text-left">Tahun Ajaran</th>
          <th className="px-4 py-2 text-left">Wali Kelas</th>
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
              <td className="px-4 py-2">{child.nama_kelas}</td>
              <td className="px-4 py-2">{child.tahun_ajaran}</td>
              <td className="px-4 py-2">{child.wali_kelas}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
