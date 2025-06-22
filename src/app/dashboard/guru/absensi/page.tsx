export const dynamic = "force-dynamic";

import { getKelasByGuruId } from "@/app/libs/features/queryJadwal";
import RekapForm from "@/components/dialogui/rekap-form";
import RekapMapel from "@/components/dialogui/rekap-mapel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const data = await getKelasByGuruId(parseInt(guruId));

  // Group by class only since 1 teacher = 1 subject
  const groupedData = data.reduce((acc: any, curr) => {
    const compositeKey = `${curr.nama_kelas}-${curr.mata_pelajaran_id}`;

    if (!acc[compositeKey]) {
      acc[compositeKey] = {
        nama_kelas: curr.nama_kelas,
        nama_mapel: curr.nama_mapel,
        kelas_id: curr.kelas_id,
        mapel_id: curr.mata_pelajaran_id,
        schedules: [],
      };
    }

    acc[compositeKey].schedules.push({
      id: curr.id,
      hari: curr.hari,
      jam: curr.jam,
    });

    return acc;
  }, {});

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Daftar Kelas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(groupedData).map((kelas: any, idx) => (
          <Card key={idx}>
            <CardHeader>
              <h2 className="font-bold text-xl">{kelas.nama_kelas}</h2>
              <p className="text-lg font-medium text-muted-foreground">
                {kelas.nama_mapel}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">
                    Jadwal:
                  </p>
                </div>
                <div className="space-y-1">
                  {kelas.schedules.map((schedule: any, i: number) => (
                    <p key={i} className="text-sm pl-2">
                      {schedule.hari} ({schedule.jam})
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <RekapMapel kelasId={kelas.kelas_id} mapelId={kelas.mapel_id} />
              <Link href={`/dashboard/guru/absensi/${kelas.kelas_id}/history`}>
                <Button size="sm">Lihat History</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
