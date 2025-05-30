import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import { getJadwalSiswa } from "@/app/libs/features/querySiswa";
import ExportJadwalToPDF from "@/components/ui/export-jadwal-pdf";

interface Jadwal {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  nama_mapel: string;
  nama_guru: string;
}

const Page = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;

  const jadwalList = await getJadwalSiswa(siswaId);

  // Group schedules by day
  const jadwalByHari = jadwalList.reduce(
    (acc: { [key: string]: Jadwal[] }, curr) => {
      if (!acc[curr.hari]) {
        acc[curr.hari] = [];
      }
      acc[curr.hari].push(curr);
      return acc;
    },
    {}
  );

  return (
    <div className="md:p-6 mt-5">
      <h1 className="text-2xl font-bold mb-6">Jadwal Pelajaran</h1>
      <ExportJadwalToPDF data={jadwalByHari} kelas={jadwalList[0]?.nama_kelas} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{mapel.nama_mapel}</p>
                      <p className="text-sm text-gray-600">{mapel.nama_guru}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {mapel.jam_mulai.slice(0, 5)} -{" "}
                      {mapel.jam_selesai.slice(0, 5)}
                    </p>
                  </div>
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
