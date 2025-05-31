import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getKelasWaliKelasById,
  getAbsensiByKelas,
} from "@/app/libs/features/queryKelas";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  // Get class details
  const kelasData = await getKelasWaliKelasById(parseInt(id));

  // Get all students attendance data
  const absensiData = await getAbsensiByKelas(parseInt(id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Wali Kelas {kelasData.nama_kelas}
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>Total Siswa</CardHeader>
          <CardContent>{kelasData.total_siswa}</CardContent>
        </Card>
        <Card>
          <CardHeader>Rata-rata Kehadiran</CardHeader>
          <CardContent>85%</CardContent>
        </Card>
        <Card>
          <CardHeader>Mata Pelajaran</CardHeader>
          <CardContent>{kelasData.total_mapel}</CardContent>
        </Card>
      </div>

      {/* Student Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daftar Siswa</h2>
            {/* Add filters here */}
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">NIS</th>
                <th className="px-4 py-2 text-center">Hadir</th>
                <th className="px-4 py-2 text-center">Sakit</th>
                <th className="px-4 py-2 text-center">Izin</th>
                <th className="px-4 py-2 text-center">Alpha</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensiData.map((siswa, index) => (
                <tr key={siswa.siswa_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{siswa.nama}</td>
                  <td className="px-4 py-2">{siswa.nis}</td>
                  <td className="px-4 py-2 text-center">
                    {siswa.total_hadir || 0}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {siswa.total_sakit || 0}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {siswa.total_izin || 0}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {siswa.total_alpha || 0}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      href={`/dashboard/guru/walikelas/${id}/siswa/${siswa.siswa_id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Button variant="noShadow" size="sm">Detail</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
