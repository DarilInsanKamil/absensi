import { getStudentDetails } from "@/app/libs/features/queryDashboardKepsek";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const studentData = await getStudentDetails(id);

  if (!studentData) return notFound();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{studentData.nama}</h1>
          <p className="text-gray-600">Kelas {studentData.nama_kelas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Total Alpha</dt>
                <dd className="text-2xl font-bold text-red-600">
                  {studentData.total_alpha}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Total Izin/Sakit</dt>
                <dd className="text-2xl font-bold">
                  {studentData.total_izin + studentData.total_sakit}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Subject Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle>Mata Pelajaran Bermasalah</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Mata Pelajaran</th>
                  <th className="text-center">Alpha</th>
                </tr>
              </thead>
              <tbody>
                {studentData.subject_breakdown.map((subject) => (
                  <tr key={subject.mapel_id} className="border-b">
                    <td className="py-2">{subject.nama_mapel}</td>
                    <td className="text-center">{subject.alpha_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Absence History Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Riwayat Ketidakhadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Mata Pelajaran</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {studentData.absence_history.map((absence) => (
                  <tr key={absence.id} className="border-b">
                    <td className="px-4 py-2">
                      {new Date(absence.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-2">{absence.nama_mapel}</td>
                    <td className="px-4 py-2">{absence.status}</td>
                    <td className="px-4 py-2">{absence.keterangan || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
