"use client";

import { ResponseTableMapel } from "@/definitions";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteMatpel } from "@/app/libs/action";
import { toast } from "sonner";
import { DialogEditMatpelForm } from "../dialogui/matpel-editform";

export function TableMatpel({
  children,
  onDelete,
}: {
  children: ResponseTableMapel[];
  onDelete?: () => void;
}) {
  const handleDelete = async (id: number) => {
    try {
      await useDeleteMatpel(id);

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
          <th className="px-4 py-2 text-left">Kode Mapel</th>
          <th className="px-4 py-2 text-left">Nama Mapel</th>
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
            <td className="px-4 py-2">{child.kode_mapel}</td>
            <td className="px-4 py-2">{child.nama_mapel}</td>
            <td className="px-4 py-2 flex gap-2">
              <Button
                className="bg-red-400"
                size="icon" variant="noShadow"
                onClick={() => handleDelete(child.id)}
              >
                <Trash2 />
              </Button>
              <DialogEditMatpelForm
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
