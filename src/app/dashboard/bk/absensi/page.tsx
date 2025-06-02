import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getActiveClasses,
  getProblemStudents,
} from "@/app/libs/features/queryDashboardKepsek";
import EmergencyAttendanceForm from "@/components/ui/emergency-absen";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const res = await fetch(`${process.env.LOCAL_TEST_API}/api/getFormJadwal`);
  const datas = await res.json();

  // Fetch problematic students and active classes
  const problemStudents = await getProblemStudents();
  const activeClasses = await getActiveClasses();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard BK</h1>
      </div>

      <Tabs defaultValue="problem-students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="problem-students">Siswa Bermasalah</TabsTrigger>
          <TabsTrigger value="emergency-attendance">Input Absensi</TabsTrigger>
        </TabsList>

        {/* Problem Students Tab */}
        <TabsContent value="problem-students">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Daftar Siswa Bermasalah</CardTitle>
                <div className="flex gap-2">
                  <select className="border rounded p-1">
                    <option value="week">Minggu Ini</option>
                    <option value="month">Bulan Ini</option>
                    <option value="semester">Semester Ini</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Kelas</th>
                    <th className="px-4 py-2 text-center">Total Alpha</th>
                    <th className="px-4 py-2 text-left">
                      Mata Pelajaran Sering Alpha
                    </th>
                    <th className="px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {problemStudents.map((student) => (
                    <tr key={student.siswa_id} className="border-b">
                      <td className="px-4 py-2">{student.nama}</td>
                      <td className="px-4 py-2">{student.nama_kelas}</td>
                      <td className="px-4 py-2 text-center">
                        {student.total_alpha}
                      </td>
                      <td className="px-4 py-2">
                        {student.frequently_skipped_subjects.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Link
                          href={`/absensiteknomedia/dashboard/bk/absensi/${student.siswa_id}/detail`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Attendance Tab */}
        <TabsContent value="emergency-attendance">
          <Card>
            {/* <p>{JSON.stringify(mapelData)}</p> */}
            <CardHeader>
              <CardTitle>Input Absensi (Mode Override)</CardTitle>
            </CardHeader>
            <CardContent>
              <EmergencyAttendanceForm
                activeClasses={activeClasses}
                mataPelajaran={datas.mataPelajaran}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
