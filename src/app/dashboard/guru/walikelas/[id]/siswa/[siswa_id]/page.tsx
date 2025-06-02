import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSiswaById } from "@/app/libs/features/querySiswa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSiswaAbsenceHistory,
  getSiswaAttendanceBySubject,
} from "@/app/libs/features/queryWaliKelas";

interface PageProps {
  params: Promise<{
    id: string; // kelas_id
    siswa_id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id: kelasId, siswa_id } = await params;

  // Get student details
  const siswaData = await getSiswaById(siswa_id);

  // Get attendance breakdown by subject
  const subjectAttendance = await getSiswaAttendanceBySubject(siswa_id);

  // Get chronological absence history
  const absenceHistory = await getSiswaAbsenceHistory(siswa_id);

  return (
    <div className="p-6 mt-5">
      {/* Student Info Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div>
            <h1 className="text-2xl font-bold">{siswaData.nama}</h1>
            <p className="text-gray-600">NIS: {siswaData.nis}</p>
            <p className="text-gray-600">Kelas: {siswaData.nama_kelas}</p>
          </div>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="by-subject" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-subject">Per Mata Pelajaran</TabsTrigger>
          <TabsTrigger value="history">Riwayat Ketidakhadiran</TabsTrigger>
        </TabsList>

        {/* Subject-wise breakdown */}
        <TabsContent value="by-subject">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Kehadiran per Mata Pelajaran
              </h2>
            </CardHeader>
            <CardContent className="overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2">Mata Pelajaran</th>
                    <th className="px-4 py-2 text-center">Hadir</th>
                    <th className="px-4 py-2 text-center">Sakit</th>
                    <th className="px-4 py-2 text-center">Izin</th>
                    <th className="px-4 py-2 text-center">Alpha</th>
                    <th className="px-4 py-2 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectAttendance.map((subject) => (
                    <tr key={subject.mapel_id} className="border-b">
                      <td className="px-4 py-2">{subject.nama_mapel}</td>
                      <td className="px-4 py-2 text-center">{subject.hadir}</td>
                      <td className="px-4 py-2 text-center">{subject.sakit}</td>
                      <td className="px-4 py-2 text-center">{subject.izin}</td>
                      <td className="px-4 py-2 text-center">{subject.alpha}</td>
                      <td className="px-4 py-2 text-center">
                        {subject.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Absence History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Riwayat Ketidakhadiran</h2>
            </CardHeader>
            <CardContent className="overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2">Tanggal</th>
                    <th className="px-4 py-2">Mata Pelajaran</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {absenceHistory.map((absence) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
