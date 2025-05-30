export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAbsensiSiswa } from "@/app/libs/features/querySiswa";
import { Button } from "@/components/ui/button";

interface AbsensiSiswa {
  mata_pelajaran_id: number;
  nama_mapel: string;
  nama_guru: string;
  jadwal_info: string;
  total_hadir: number;
  total_alpha: number;
  total_izin: number;
  total_sakit: number;
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;

  const absensiData = await getAbsensiSiswa(siswaId);



  return (
    <div className="p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">Absensi Saya</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {absensiData.map((mapel, idx: number) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{mapel.nama_mapel}</CardTitle>
              <p className="text-sm text-gray-500">Guru: {mapel.nama_guru}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Jadwal:</p>
                <p className="text-sm pl-2">{mapel.jadwal_info}</p>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    {
                      label: "Hadir",
                      value: mapel.total_hadir,
                      color: "green",
                    },
                    {
                      label: "Sakit",
                      value: mapel.total_sakit,
                      color: "yellow",
                    },
                    { label: "Izin", value: mapel.total_izin, color: "blue" },
                    {
                      label: "Alpha",
                      value: mapel.total_alpha,
                      color: "red",
                    },
                  ].map((status, idx: number) => (
                    <div
                      key={idx}
                      className={`text-center bg-${status.color}-100 rounded-md py-1`}
                    >
                      <p className={`text-sm font-medium`}>
                        {status.value || 0}
                      </p>
                      <p className="text-xs text-gray-500">{status.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/dashboard/siswa/absensi/${mapel.mata_pelajaran_id}`}
                className="w-full"
              >
                <Button variant="noShadow" className=" w-full transition-colors hover:bg-blue-600 cursor-pointer">History Absen</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
