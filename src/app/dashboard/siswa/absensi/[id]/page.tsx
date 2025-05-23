export const dynamic = "force-dynamic";

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

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { getAbsensiSiswa } from "@/app/libs/features/querySiswa";

// interface AbsensiSiswa {
//   jadwal_id: string;
//   hari: string;
//   jam_mulai: string;
//   jam_selesai: string;
//   nama_mapel: string;
//   nama_guru: string;
//   total_hadir: number;
//   total_alpha: number;
//   total_izin: number;
//   total_sakit: number;
// }

// export default async function Page() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) return notFound();

//   const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
//   const siswaId = decoded.reference_id;

//   const absensiData = await getAbsensiSiswa(siswaId);

//   // Group by days
//   const groupedByDay = absensiData.reduce(
//     (acc: { [key: string]: AbsensiSiswa[] }, curr: any) => {
//       if (!acc[curr.hari]) {
//         acc[curr.hari] = [];
//       }
//       acc[curr.hari].push(curr);
//       return acc;
//     },
//     {}
//   );

//   // Sort days
//   const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
//   const sortedDays = Object.keys(groupedByDay).sort(
//     (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Absensi Saya</h1>

//       {sortedDays.map((day) => (
//         <div key={day} className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">{day}</h2>
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {groupedByDay[day].map((jadwal: any) => (
//               <Link
//                 href={`/dashboard/siswa/absensi/${jadwal.jadwal_id}`}
//                 key={jadwal.jadwal_id}
//               >
//                 <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
//                   <CardHeader>
//                     <CardTitle className="text-lg">
//                       {jadwal.nama_mapel}
//                     </CardTitle>
//                     <p className="text-sm text-gray-500">
//                       {jadwal.jam_mulai} - {jadwal.jam_selesai}
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm mb-1">Guru: {jadwal.nama_guru}</p>
//                     <div className="grid grid-cols-4 gap-2 mt-2">
//                       <div className="text-center">
//                         <p className="text-sm font-medium text-green-600">
//                           {jadwal.total_hadir}
//                         </p>
//                         <p className="text-xs text-gray-500">Hadir</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm font-medium text-yellow-600">
//                           {jadwal.total_sakit}
//                         </p>
//                         <p className="text-xs text-gray-500">Sakit</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm font-medium text-blue-600">
//                           {jadwal.total_izin}
//                         </p>
//                         <p className="text-xs text-gray-500">Izin</p>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm font-medium text-red-600">
//                           {jadwal.total_alpha}
//                         </p>
//                         <p className="text-xs text-gray-500">Alpha</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
