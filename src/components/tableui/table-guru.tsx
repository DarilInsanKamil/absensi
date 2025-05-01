import { ResponseTableGuru } from "@/definitions";
import { formatStatus } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteGuru } from "@/app/libs/action";
import { toast } from "sonner";

export function TableGuru({
  children,
  onDelete,
}: {
  children: ResponseTableGuru[];
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
          <th className="px-4 py-2 text-left">Nama</th>
          <th className="px-4 py-2 text-left">NIP</th>
          <th className="px-4 py-2 text-left">Jenis Kelamin</th>
          <th className="px-4 py-2 text-left">Alamat</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Status</th>
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
            <td className="px-4 py-2">{res.nip}</td>
            <td className="px-4 py-2">{res.jenis_kelamin}</td>
            <td className="px-4 py-2">{res.alamat}</td>
            <td className="px-4 py-2">{res.email}</td>
            <td>
              <div className="bg-green-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                {formatStatus(res.status_aktif)}
              </div>
            </td>
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
