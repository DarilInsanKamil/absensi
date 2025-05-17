"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ExportToPDF from "@/components/ui/export-pdf";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface AbsensiSiswa {
  siswa_id: string;
  nama_siswa: string;
  jumlah_hari_absen: string;
  hadir: string;
  izin: string;
  sakit: string;
  alpha: string;
  nama_kelas: string;
  nama_mapel: string;
}

type DaftarAbsensiSiswa = AbsensiSiswa[];

const Page = () => {
  const [data, setData] = useState<DaftarAbsensiSiswa>([]);
  const searchParams = useSearchParams();

  const kelas_id = searchParams.get("kelas_id");
  const bulan = searchParams.get("bulan");
  const tahun = searchParams.get("tahun");

  if (!kelas_id || !bulan || !tahun) {
    return <div>Parameter tidak lengkap.</div>;
  }

  useEffect(() => {
    const fetchRekap = async (
      kelasId: number,
      bulan: number,
      tahun: number
    ) => {
      const res = await fetch(
        `/api/absensi/rekap?kelas_id=${kelasId}&bulan=${bulan}&tahun=${tahun}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data rekap");
      const datas = await res.json();
      setData(datas);
    };
    fetchRekap(Number(kelas_id), Number(bulan), Number(tahun));
  }, []);
  return (
    <section className="p-6">
      <Card className="mt-5 mb-10">
        <CardHeader>
          <h2 className="text-2xl font-bold">Rekap Absensi</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Kelas: {data[0]?.nama_kelas || "-"}</p>
          <p className="text-gray-600">
            Mata Pelajaran: {data[0]?.nama_mapel || "-"}
          </p>
          <p className="text-gray-600">
            Periode: {bulan}/{tahun}
          </p>
        </CardContent>
        <CardFooter>
          <ExportToPDF
            data={data}
            kelas={data[0]?.nama_kelas}
            mapel={data[0]?.nama_mapel}
            startDate={`${tahun}-${String(bulan).padStart(2, "0")}-01`}
            endDate={`${tahun}-${String(bulan).padStart(2, "0")}-31`}
          />
        </CardFooter>
      </Card>

      {data.length === 0 ? (
        <p>Tidak ada data absensi pada bulan ini.</p>
      ) : (
        <Suspense>
          <table className="w-full border text-left text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">No</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Hadir</th>
                <th className="p-2 border">Izin</th>
                <th className="p-2 border">Sakit</th>
                <th className="p-2 border">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {data.map((siswa, idx) => (
                <tr key={siswa.siswa_id} className="border-t">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{siswa.nama_siswa}</td>
                  <td className="p-2 border">{siswa.hadir}</td>
                  <td className="p-2 border">{siswa.izin}</td>
                  <td className="p-2 border">{siswa.sakit}</td>
                  <td className="p-2 border">{siswa.alpha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Suspense>
      )}
    </section>
  );
};

export default Page;
