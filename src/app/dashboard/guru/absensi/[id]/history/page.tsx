export const dynamic = "force-dynamic";

import { getAbsensiHistory } from "@/app/libs/features/queryAbsensi";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const guruId = decoded.reference_id;

  const absensiHistory = await getAbsensiHistory(
    parseInt(id),
    parseInt(guruId)
  );

  const convertDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

 function formatDateTimeForUrl(date: string | Date, time: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const [hour, minute] = time.split(":"); // Split time into hour and minute
  return `${year}-${month}-${day}-${hour}-${minute}`;
}

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Absensi Kelas</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Jam</th>
              <th className="px-4 py-2">Total Siswa</th>
              <th className="px-4 py-2">Hadir</th>
              <th className="px-4 py-2">Sakit</th>
              <th className="px-4 py-2">Izin</th>
              <th className="px-4 py-2">Alpha</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {absensiHistory.map((history, idx: number) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{convertDate(history.tanggal)}</td>
                <td className="px-4 py-2">
                  {history.jam_mulai.slice(0, 5)} -{" "}
                  {history.jam_selesai.slice(0, 5)}
                </td>
                <td className="px-4 py-2 text-center">{history.total_siswa}</td>
                <td className="px-4 py-2 text-center">
                  {history.jumlah_hadir}
                </td>
                <td className="px-4 py-2 text-center">
                  {history.jumlah_sakit}
                </td>
                <td className="px-4 py-2 text-center">{history.jumlah_izin}</td>
                <td className="px-4 py-2 text-center">
                  {history.jumlah_alpha}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/dashboard/guru/absensi/${id}/edit/${formatDateTimeForUrl(
                      history.tanggal,
                      history.jam_mulai.slice(0, 5)
                    )}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
