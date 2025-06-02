"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Siswa {
  id: number;
  nama: string;
  nis: string;
}

interface Jadwal {
  id: number;
  kelas: string;
  mata_pelajaran: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

interface AbsensiData {
  siswa_id: number;
  jadwal_id: number;
  guru_id: number;
  tanggal: string;
  waktu_absen: string;
  status: string;
  keterangan: string;
}

interface AbsensiPageProps {
  jadwal: Jadwal[];
  siswaList: Siswa[];
  guruId: number;
}

const AbsensiPage: React.FC<AbsensiPageProps> = ({
  jadwal,
  siswaList,
  guruId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      // Create array to hold all attendance records
      const absensiData: AbsensiData[] = [];
      // Get current date and time
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toLocaleTimeString();

      // Process each student's attendance
      for (const siswa of siswaList) {
        const status = (formData.get(`status_${siswa.id}`) as string) || "";
        const keterangan =
          (formData.get(`keterangan_${siswa.id}`) as string) || "";

        absensiData.push({
          siswa_id: siswa.id,
          jadwal_id: jadwal[0]?.id,
          guru_id: guruId,
          tanggal: currentDate,
          waktu_absen: currentTime,
          status,
          keterangan,
        });
      }
      if (!absensiData.length) {
        throw new Error("No attendance data to submit");
      }

      // Send to API
      const response = await fetch("/absensiteknomedia/api/absensi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ absensi: absensiData }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance");
      }

      console.log(response.json());

      toast.success("Absensi berhasil disimpan");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Gagal menyimpan absensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Absensi Kelas {jadwal[0].kelas} - {jadwal[0].mata_pelajaran}
      </h2>

      <Form action={handleSubmit}>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {siswaList.map((siswa: any, index: number) => (
              <tr key={siswa.id} className="text-center border">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border text-left">{siswa.nama}</td>
                <td className="p-2 border">
                  {["hadir", "sakit", "izin", "alpha"].map((status) => (
                    <label key={status} className="mr-4">
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
                </td>
                <td className="p-2 border">
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
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
        </button>
      </Form>
    </div>
  );
};

export default AbsensiPage;
