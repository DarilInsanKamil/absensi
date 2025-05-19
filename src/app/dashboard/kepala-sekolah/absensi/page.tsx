import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import { getKepsekDashboardData } from "@/app/libs/features/queryDashboardKepsek";
import { ClassComparisonChart } from "@/components/bar-chart";
import { AttendanceTrendChart } from "@/components/line-chart";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const data = await getKepsekDashboardData();

  // Calculate overall statistics
  const stats = data.reduce(
    (acc, curr) => {
      const date = new Date(curr.tanggal);
      const isToday = date.toDateString() === new Date().toDateString();

      if (isToday) {
        acc.todayAttendance += curr.kehadiran_persen;
        acc.todayClasses++;
      }

      acc.totalStudents = Math.max(acc.totalStudents, curr.total_siswa);
      acc.monthlyAttendance += curr.kehadiran_persen;
      acc.totalClasses++;

      return acc;
    },
    {
      todayAttendance: 0,
      todayClasses: 0,
      totalStudents: 0,
      monthlyAttendance: 0,
      totalClasses: 0,
    }
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Kepala Sekolah</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Kehadiran Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(stats.todayAttendance / (stats.todayClasses || 1)).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Kehadiran Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(stats.monthlyAttendance / stats.totalClasses).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and detailed stats would go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tren Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceTrendChart data={data} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Perbandingan Antar Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassComparisonChart data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
