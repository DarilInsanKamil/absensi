import { getMatpelBySiswa } from "@/app/libs/features/querySiswa";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;

  const jadwalList = await getMatpelBySiswa(siswaId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Absensi</h1>
      <div className="grid gap-4">
        {jadwalList.map((jadwal) => (
          <Link
            key={jadwal.jadwal_id}
            href={`/dashboard/siswa/absensi/${jadwal.jadwal_id}`}
          >
            <Card className="hover:bg-gray-50 transition-colors">
              <CardHeader>
                <h3 className="font-semibold">{jadwal.nama_mapel}</h3>
                <p className="text-sm text-gray-600">{jadwal.nama_guru}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    {jadwal.hari}, {jadwal.jam_mulai} - {jadwal.jam_selesai}
                  </p>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <div className="bg-green-100 p-2 rounded-md">
                      <p className="text-xs text-gray-600">Hadir</p>
                      <p className="font-semibold">
                        {jadwal.jumlah_hadir || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded-md">
                      <p className="text-xs text-gray-600">Sakit</p>
                      <p className="font-semibold">
                        {jadwal.jumlah_sakit || 0}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-md">
                      <p className="text-xs text-gray-600">Izin</p>
                      <p className="font-semibold">{jadwal.jumlah_izin || 0}</p>
                    </div>
                    <div className="bg-red-100 p-2 rounded-md">
                      <p className="text-xs text-gray-600">Alpha</p>
                      <p className="font-semibold">
                        {jadwal.jumlah_alpha || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
