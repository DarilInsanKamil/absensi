import { ResponseTableAbsensi } from "@/definitions";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteGuru } from "@/app/libs/action";
import { toast } from "sonner";

export function TableAbsensi({
  children,
  onDelete,
}: {
  children: ResponseTableAbsensi[];
  onDelete?: () => void;
}) {
  const handleDelete = async (id: number) => {
    try {
      await useDeleteGuru(id);

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
    <table className="min-w-full bg-white rounded-lg overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700 relative ">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama Siswa</th>
          <th className="px-4 py-2 text-left">Jadwal</th>
          <th className="px-4 py-2 text-left">Nama Guru</th>
          <th className="px-4 py-2 text-left">Tanggal</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Keterangan</th>
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
            <td className="px-4 py-2">{res.nama_siswa}</td>
            <td className="px-4 py-2">{res.jadwal}</td>
            <td className="px-4 py-2">{res.nama_guru}</td>
            <td className="px-4 py-2">{res.tanggal}</td>
            <td className="px-4 py-2">{res.status}</td>
            <td className="px-4 py-2">{res.keterangan}</td>
            <td className="px-4 py-2">{res.waktu_absen}</td>
            <td className="px-4 py-2 flex gap-2">
              <Button
                className="bg-red-400"
                size="icon"
                onClick={() => handleDelete(res.id)}
              >
                <Trash2 />
              </Button>
              <Button size="sm">
                <Pencil />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
