import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import { getKelasAbsentDetails } from "@/app/libs/features/queryDashboardKepsek";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const data = await getKelasAbsentDetails(parseInt(id));
  console.log(data);
  const stats =
    data.length > 0
      ? data.reduce(
          (acc, curr) => {
            acc.totalStudentsWithAlpha++;
            acc.totalAlpha += curr.total_alpha;
            if (curr.total_alpha >= 3) acc.criticalCount++;
            return acc;
          },
          {
            totalStudentsWithAlpha: 0,
            totalAlpha: 0,
            criticalCount: 0,
          }
        )
      : {
          totalStudentsWithAlpha: 0,
          totalAlpha: 0,
          criticalCount: 0,
        };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daftar Ketidakhadiran Siswa</h1>
        {data.length > 0 && (
          <p className="text-gray-600 mt-2">Kelas: {data[0].nama_kelas}</p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalStudentsWithAlpha}</p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Ketidakhadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalAlpha}</p>
          </CardContent>
        </Card> */}
        <Card className="bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Siswa Kritis (≥3 Alpha)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.criticalCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      {data.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Tidak ada data ketidakhadiran untuk kelas ini
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detail Ketidakhadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full bg-white rounded-lg overflow-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left">Nama Siswa</th>
                  <th className="px-4 py-2 text-left">NIS</th>
                  <th className="px-4 py-2 text-left">Jumlah Hadir</th>
                  <th className="px-4 py-2 text-left">Jumlah Izin</th>
                  <th className="px-4 py-2 text-left">Jumlah Sakit</th>
                  <th className="px-4 py-2 text-left">Jumlah Alpha</th>
                  {/* <th className="px-4 py-2 text-left">Detail Alpha</th> */}
                </tr>
              </thead>
              <tbody>
                {data.map((student, idx) => (
                  <tr
                    key={idx}
                    className={
                      student.total_alpha >= 3
                        ? "bg-red-50 border-b border-gray-300 hover:bg-gray-100"
                        : "border-b border-gray-300 hover:bg-gray-100 bg-white"
                    }
                  >
                    <td className="px-4 py-2">{student.nama_siswa}</td>
                    <td className="px-4 py-2">{student.nis}</td>
                    <td className="px-4 py-2">{student.total_hadir}</td>
                    <td className="px-4 py-2">{student.total_izin}</td>
                    <td className="px-4 py-2">{student.total_sakit}</td>
                    <td className="px-4 py-2">{student.total_alpha}</td>
                    {/* <td className="px-4 py-2">{student.detail_alpha}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
