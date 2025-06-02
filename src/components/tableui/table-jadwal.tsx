"use client";

import { ResponseTableJadwal } from "@/definitions";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteJadwal, useDeleteSiswa } from "@/app/libs/action";
import { toast } from "sonner";
import { DialogEditJadwalForm } from "../dialogui/jadwal-editform";

export function TableJadwal({
  children,
  onDelete,
}: {
  children: ResponseTableJadwal[];
  onDelete?: () => void;
}) {
  const handleDelete = async (id: number) => {
    try {
      await useDeleteJadwal(id);

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
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Mata Pelajaran</th>
          <th className="px-4 py-2 text-left">Kelas</th>
          <th className="px-4 py-2 text-left">Guru</th>
          <th className="px-4 py-2 text-left">Tahun Ajaran</th>
          <th className="px-4 py-2 text-left">Hari</th>
          <th className="px-4 py-2 text-left">Jam mulai</th>
          <th className="px-4 py-2 text-left">Jam Selesai</th>
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
            <td className="px-4 py-2">{child.mata_pelajaran}</td>
            <td className="px-4 py-2">{child.kelas}</td>
            <td className="px-4 py-2">{child.nama_guru}</td>
            <td className="px-4 py-2">{child.tahun_ajaran}</td>
            <td className="px-4 py-2">{child.hari}</td>
            <td className="px-4 py-2">{child.jam_mulai}</td>
            <td className="px-4 py-2">{child.jam_selesai}</td>
            <td className="px-4 py-2 flex gap-2 items-center">
              <Button
                className="bg-red-400 "
                size="icon"
                variant={"noShadow"}
                onClick={() => handleDelete(child.id)}
              >
                <Trash2 />
              </Button>
              <DialogEditJadwalForm
                id={child.id}
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
