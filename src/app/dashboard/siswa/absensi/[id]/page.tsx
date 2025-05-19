export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import { getAbsensiSiswaByJadwal } from "@/app/libs/features/querySiswa";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;
  console.log(siswaId);
  const absensiData = await getAbsensiSiswaByJadwal(siswaId, id);

  return (
    <div className="p-6">
      {absensiData.length > 0 ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">History Absensi</h1>
            <p className="text-gray-600">
              Mata Pelajaran: {absensiData[0].nama_mapel}
            </p>
            <p className="text-gray-600">Guru: {absensiData[0].nama_guru}</p>
          </div>

          <div className="grid gap-4">
            {absensiData.map((absensi) => (
              <Card key={absensi.absensi_id}>
                <CardHeader>
                  <h3 className="font-semibold">
                    {new Date(absensi.tanggal).toLocaleDateString("id-ID")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {absensi.jam_mulai} - {absensi.jam_selesai}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        absensi.status === "hadir"
                          ? "bg-green-100 text-green-800"
                          : absensi.status === "sakit"
                          ? "bg-yellow-100 text-yellow-800"
                          : absensi.status === "izin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {absensi.status}
                    </div>
                    {absensi.keterangan && (
                      <p className="text-sm text-gray-600">
                        Keterangan: {absensi.keterangan}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Belum ada data absensi</p>
        </div>
      )}
    </div>
  );
}
