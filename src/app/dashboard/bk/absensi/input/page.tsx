"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Siswa {
  id: string;
  nis: string;
  nama: string;
  nama_kelas: string;
}

interface Jadwal {
  id: number;
  hari: string;
  jam_mulai: string;
  guru_id: number;
  kelas_id: number;
  mata_pelajaran_id: number;
  jam_selesai: string;
  mata_pelajaran: string;
  nama_guru: string;
  tahun_ajaran: string;
  kelas: string;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [jadwalInfo, setJadwalInfo] = useState<Jadwal | null>(null);

  const kelasId = searchParams.get("kelas");
  const mapelId = searchParams.get("mapel");
  const tanggal = searchParams.get("tanggal");

  const fetchJadwalInfo = async () => {
    try {
      const res = await fetch(`/absensiteknomedia/api/jadwal/siswa?kelas=${kelasId}&mapel=${mapelId}`);
      if (!res.ok) throw new Error("Failed to fetch jadwal");

      const data = await res.json();
      // Get the matching jadwal
      const selectedJadwal = data.find(
        (j: Jadwal) =>
          j.kelas_id === parseInt(kelasId!) &&
          j.mata_pelajaran_id === parseInt(mapelId!)
      );

      setJadwalInfo(selectedJadwal || null);
    } catch (error) {
      console.error("Error fetching jadwal:", error);
      toast.error("Gagal mengambil data jadwal");
    }
  };

  const fetchSiswaList = async () => {
    try {
      const res = await fetch(`/absensiteknomedia/api/siswa/kelas/${kelasId}`);
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      setSiswaList(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Gagal mengambil data siswa");
    }
  };

  useEffect(() => {
    if (kelasId && mapelId && tanggal) {
      fetchJadwalInfo();
      fetchSiswaList();
    }
  }, [kelasId, mapelId, tanggal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jadwalInfo || !tanggal) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      const absensiData = siswaList.map((siswa) => ({
        siswa_id: siswa.id,
        jadwal_id: jadwalInfo.id,
        guru_id: jadwalInfo.guru_id,
        tanggal,
        waktu_absen: new Date().toLocaleTimeString(),
        status: formData.get(`status_${siswa.id}`) as string,
        keterangan: formData.get(`keterangan_${siswa.id}`) as string,
      }));

      const response = await fetch("/absensiteknomedia/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ absensi: absensiData }),
      });

      if (!response.ok) throw new Error("Failed to submit attendance");

      toast.success("Absensi berhasil disimpan");
      router.push("/dashboard/bk/absensi");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Gagal menyimpan absensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!jadwalInfo || siswaList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Input Absensi {jadwalInfo.kelas} - {jadwalInfo.mata_pelajaran}
      </h2>
      <p className="text-gray-600 mb-4">Guru Mapel: {jadwalInfo.nama_guru}</p>

      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">No</th>
              <th className="border p-2">NIS</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {siswaList.map((siswa, index) => (
              <tr key={siswa.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{siswa.nis}</td>
                <td className="border p-2">{siswa.nama}</td>
                <td className="border p-2">
                  <div className="flex gap-4 justify-center">
                    {["hadir", "sakit", "izin", "alpha"].map((status) => (
                      <label key={status} className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`status_${siswa.id}`}
                          value={status}
                          defaultChecked={status === "hadir"}
                          required
                          className="mr-1"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    name={`keterangan_${siswa.id}`}
                    className="w-full p-1 border rounded"
                    placeholder="Optional"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
