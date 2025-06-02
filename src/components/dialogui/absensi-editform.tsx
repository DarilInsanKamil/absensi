"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AbsensiData {
  absensi_id: string;
  siswa_id: string;
  status: string;
  keterangan: string;
  nama_siswa: string;
  nis: string;
  nama_kelas: string;
  nama_mapel: string;
}

export function EditAbsensiForm({
  initialData,
  kelasId,
}: {
  initialData: AbsensiData[];
  kelasId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = initialData.map((siswa) => ({
        absensi_id: siswa.absensi_id,
        status: formData.get(`status_${siswa.siswa_id}`),
        keterangan: formData.get(`keterangan_${siswa.siswa_id}`) || undefined,
      }));

      const response = await fetch("/absensiteknomedia/api/absensi/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update attendance");
      }

      toast.success("Absensi berhasil diupdate");
      router.push(`/dashboard/guru/absensi/${kelasId}/history`);
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengupdate absensi");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting} variant="noShadow">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">Nama Siswa</th>
            {/* <th className="px-4 py-2">NIS</th> */}
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {initialData.map((siswa, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{siswa.nama_siswa}</td>
              {/* <td className="px-4 py-2">{siswa.nis}</td> */}
              <td className="px-4 py-2">
                <div className="flex gap-4">
                  {["hadir", "sakit", "izin", "alpha"].map((status) => (
                    <label key={status} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`status_${siswa.siswa_id}`}
                        value={status}
                        defaultChecked={siswa.status === status}
                        required
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  name={`keterangan_${siswa.siswa_id}`}
                  defaultValue={siswa.keterangan}
                  className="w-full p-1 border rounded"
                  placeholder="Optional"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}
