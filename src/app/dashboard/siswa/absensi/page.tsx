export const dynamic = "force-dynamic";

import { getMatpelBySiswa } from "@/app/libs/features/querySiswa";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;

  const jadwalList = await getMatpelBySiswa(siswaId);
  return (
    <div className="p-5 mt-5">
      <div className="grid md:grid-cols-3 gap-4">
        {jadwalList.map((jadwal, idx: number) => (
          <Card key={idx}>
            <CardHeader>
              <h3 className="font-semibold">{jadwal.nama_mapel}</h3>
              <p className="text-sm text-gray-600">{jadwal.nama_guru}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Jadwal:</p>
                  {jadwal.hari.split(", ").map((hari: any, i: number) => (
                    <p key={i} className="ml-2">
                      {hari}: {jadwal.jam_pelajaran.split(", ")[i]}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="bg-green-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                    <p>{jadwal.jumlah_hadir || 0} Hadir</p>
                  </div>
                  <div className="bg-blue-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                    <p>{jadwal.jumlah_sakit || 0} Sakit </p>
                  </div>
                  <div className="bg-yellow-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                    <p>{jadwal.jumlah_izin || 0} Izin</p>
                  </div>
                  <div className="bg-red-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                    <p>{jadwal.jumlah_alpha || 0} Alpha</p>
                  </div>
                </div>
                <Link
                  className="mt-2 w-fit"
                  href={`/dashboard/siswa/absensi/${jadwal.jadwal_id}`}
                >
                  <Button
                    size="sm"
                    variant="noShadow"
                    className="cursor-pointer"
                  >
                    Lihat Riwayat Absen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
