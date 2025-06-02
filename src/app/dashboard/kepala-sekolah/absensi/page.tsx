import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import {
  getKelasAndMapel,
  getKepsekDashboardData,
  getTopAttendingStudents,
} from "@/app/libs/features/queryDashboardKepsek";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { queryLength } from "@/app/libs/features/queryLength";

interface ClassStats {
  attendanceRate: number;
  concerns: string[];
}

function calculateClassStats(mapelList: any[]): ClassStats {
  const stats = mapelList.reduce(
    (acc, curr) => {
      const total =
        curr.jumlah_hadir +
        curr.jumlah_sakit +
        curr.jumlah_izin +
        curr.jumlah_alpha;
      const present = curr.jumlah_hadir;

      // Calculate attendance rate for this subject
      const subjectRate = (present / total) * 100;

      // Add to total for class average
      acc.totalPresent += present;
      acc.totalStudents += total;

      // Check for concerning patterns
      if (subjectRate < 70) {
        acc.concerns.push(
          `${curr.nama_mapel}: Kehadiran ${subjectRate.toFixed(1)}%`
        );
      }
      if (curr.jumlah_alpha > 3) {
        acc.concerns.push(
          `${curr.nama_mapel}: ${curr.jumlah_alpha} siswa alpha`
        );
      }

      return acc;
    },
    { totalPresent: 0, totalStudents: 0, concerns: [] as string[] }
  );

  return {
    attendanceRate: Number(
      ((stats.totalPresent / stats.totalStudents) * 100).toFixed(1)
    ),
    concerns: stats.concerns,
  };
}

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const data = await getKepsekDashboardData();
  const res = await queryLength();
  const topStudents = await getTopAttendingStudents();

  const topClass = [...data].sort(
    (a, b) => (b.kehadiran_persen || 0) - (a.kehadiran_persen || 0)
  )[0];

  // Calculate total problem students
  const totalProblemStudents = data.reduce(
    (acc, curr) => acc + (curr.problem_students_count || 0),
    0
  );

  // Calculate stats
  const stats = data.reduce(
    (acc, curr) => {
      const date = new Date(curr.tanggal);
      const isToday = date.toDateString() === new Date().toDateString();

      if (isToday) {
        acc.presentToday += curr.jumlah_hadir || 0;
        acc.todayAttendance += curr.kehadiran_persen;
        acc.todayClasses++;
      }

      // Add lowAttendanceClasses calculation
      if (curr.kehadiran_persen < 70) {
        acc.lowAttendanceClasses++;
      }

      acc.totalStudents = Math.max(acc.totalStudents, curr.total_siswa);
      acc.monthlyAttendance += curr.kehadiran_persen;
      acc.totalClasses++;

      return acc;
    },
    {
      presentToday: 0,
      todayAttendance: 0,
      todayClasses: 0,
      totalStudents: 0,
      monthlyAttendance: 0,
      totalClasses: 0,
      lowAttendanceClasses: 0,
    }
  );

  const datas = await getKelasAndMapel();

  // Group data by class
  const groupedData = datas.reduce((acc: { [key: string]: any[] }, curr) => {
    if (!acc[curr.nama_kelas]) {
      acc[curr.nama_kelas] = [];
    }
    acc[curr.nama_kelas].push(curr);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Kehadiran</h1>
        {/* <Button onClick={() => window.print()}>Export Laporan</Button> */}
      </div>

      {/* Daily Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Kehadiran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.presentToday} / {res?.siswa}
            </p>
            <p className="text-sm text-muted-foreground">
              {((stats.presentToday / res?.siswa) * 100).toFixed(1)}% Hadir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Kelas Terbaik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{topClass?.nama_kelas}</p>
            <p className="text-sm text-muted-foreground">
              {topClass?.kehadiran_persen}% Kehadiran
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Kelas Bermasalah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.lowAttendanceClasses}</p>
            <p className="text-sm text-muted-foreground">Kehadiran &lt; 70%</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Siswa Bermasalah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProblemStudents}</p>
            <p className="text-sm text-muted-foreground">
              &gt;= 5 Alpha dalam 30 hari
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Siswa Dengan Kehadiran Terbaik</CardTitle>
          {/* <CardDescription>Bulan Ini</CardDescription> */}
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Kelas</th>
                <th className="px-4 py-2 text-center">Total Hadir</th>
                {/* <th className="px-4 py-2 text-center">Persentase</th> */}
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student) => (
                <tr key={student.siswa_id} className="border-b">
                  <td className="px-4 py-2">{student.nama_siswa}</td>
                  <td className="px-4 py-2">{student.nama_kelas}</td>
                  <td className="px-4 py-2 text-center">
                    {student.total_hadir}
                  </td>
                  {/* <td className="px-4 py-2 text-center">
                    <span className="text-green-600 font-medium">
                      {student.kehadiran_persen}%
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Class Rankings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ranking Kehadiran Kelas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Ranking</th>
                <th className="px-4 py-2 text-left">Kelas</th>
                <th className="px-4 py-2 text-center">Kehadiran</th>
                <th className="px-4 py-2 text-center">Siswa Bermasalah</th>
                <th className="px-4 py-2 text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.map((kelas, index) => (
                <tr key={kelas.kelas_id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{kelas.nama_kelas}</td>
                  <td className="px-4 py-2 text-center">
                    {kelas.kehadiran_persen}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    {kelas.problem_students_count}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      href={`/dashboard/kepala-sekolah/absensi/${kelas.kelas_id}/detail`}
                    >
                      <Button variant="noShadow" size="sm">
                        Detail
                      </Button>
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
}
