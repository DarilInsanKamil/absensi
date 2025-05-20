import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import { getKelasAndMapel } from "@/app/libs/features/queryDashboardKepsek";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;

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
      <div>
        <h1 className="text-2xl font-bold mb-6">Rekap Absensi</h1>

        {Object.entries(groupedData).map(([kelas, mapelList]) => (
          <div key={kelas} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{kelas}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mapelList.map((mapel, idx) => (
                <Card key={idx} className="h-fit">
                  <CardHeader>
                    <h3 className="font-semibold">{mapel.nama_mapel}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mapel.nama_guru}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">Jadwal:</p>
                        {mapel.jadwal
                          .split(", ")
                          .map((jadwal: string, i: number) => (
                            <p key={i} className="ml-2">
                              {jadwal}
                            </p>
                          ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-green-100 p-2 rounded-md">
                          <p className="text-xs text-gray-600">Hadir</p>
                          <p className="font-semibold">{mapel.jumlah_hadir}</p>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded-md">
                          <p className="text-xs text-gray-600">Sakit</p>
                          <p className="font-semibold">{mapel.jumlah_sakit}</p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-md">
                          <p className="text-xs text-gray-600">Izin</p>
                          <p className="font-semibold">{mapel.jumlah_izin}</p>
                        </div>
                        <div className="bg-red-100 p-2 rounded-md">
                          <p className="text-xs text-gray-600">Alpha</p>
                          <p className="font-semibold">{mapel.jumlah_alpha}</p>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/bk/absensi/${mapel.kelas_id}/detail`}
                        className="block mt-4"
                      >
                        <Button className="w-full">Lihat Detail</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
