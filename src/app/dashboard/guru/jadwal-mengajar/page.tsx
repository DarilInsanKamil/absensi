export const dynamic = 'force-dynamic'

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJadwalGuru } from "@/app/libs/features/queryJadwal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Jadwal {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  mata_pelajaran: string;
  nama_guru: string;
  tahun_ajaran: string;
  kelas: string;
}

const Page = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const jadwalList = await getJadwalGuru(parseInt(guruId));

  // Group schedules by day
  const jadwalByHari = jadwalList.reduce((acc: { [key: string]: Jadwal[] }, curr) => {
    if (!acc[curr.hari]) {
      acc[curr.hari] = [];
    }
    acc[curr.hari].push(curr);
    return acc;
  }, {});

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Jadwal Mengajar</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(jadwalByHari).map(([hari, jadwal]) => (
          <Card key={hari} className="h-fit">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-bold tracking-tight">{hari}</h3>
            </CardHeader>
            <CardContent className="divide-y">
              {jadwal.map((mapel) => (
                <div 
                  key={mapel.id} 
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold">{mapel.mata_pelajaran}</p>
                    <p className="text-sm text-gray-600">{mapel.kelas}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {mapel.jam_mulai.slice(0, 5)} - {mapel.jam_selesai.slice(0, 5)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;