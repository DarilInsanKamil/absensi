export const dynamic = "force-dynamic";

// import { getMatpelBySiswa } from "@/app/libs/features/querySiswa";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default async function Page() {
//   const cookieStore = cookies();
//   const token = (await cookieStore).get("token")?.value;

//   if (!token) return notFound();

//   const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
//   const siswaId = decoded.reference_id;

//   const jadwalList = await getMatpelBySiswa(siswaId);
//   return (
//     <div className="p-5 mt-5">
//       <div className="grid md:grid-cols-3 gap-4">
//         {jadwalList.map((jadwal, idx: number) => (
//           <Card key={idx}>
//             <CardHeader>
//               <h3 className="font-semibold">{jadwal.nama_mapel}</h3>
//               <p className="text-sm text-gray-600">{jadwal.nama_guru}</p>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-2">
//                 <div className="text-sm text-gray-600">
//                   <p className="font-medium">Jadwal:</p>
//                   {jadwal.hari.split(", ").map((hari: any, i: number) => (
//                     <p key={i} className="ml-2">
//                       {hari}: {jadwal.jam_pelajaran.split(", ")[i]}
//                     </p>
//                   ))}
//                 </div>
//                 <div className="flex gap-2 mt-2">
//                   <div className="bg-green-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
//                     <p>{jadwal.jumlah_hadir || 0} Hadir</p>
//                   </div>
//                   <div className="bg-blue-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
//                     <p>{jadwal.jumlah_sakit || 0} Sakit </p>
//                   </div>
//                   <div className="bg-yellow-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
//                     <p>{jadwal.jumlah_izin || 0} Izin</p>
//                   </div>
//                   <div className="bg-red-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
//                     <p>{jadwal.jumlah_alpha || 0} Alpha</p>
//                   </div>
//                 </div>
//                 <Link
//                   className="mt-2 w-fit"
//                   href={`/dashboard/siswa/absensi/${jadwal.jadwal_id}`}
//                 >
//                   <Button
//                     size="sm"
//                     variant="noShadow"
//                     className="cursor-pointer"
//                   >
//                     Lihat Riwayat Absen
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAbsensiSiswa } from "@/app/libs/features/querySiswa";

interface AbsensiSiswa {
  jadwal_id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  nama_mapel: string;
  nama_guru: string;
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

  // Group by days
  const groupedByDay = absensiData.reduce(
    (acc: { [key: string]: AbsensiSiswa[] }, curr: any) => {
      if (!acc[curr.hari]) {
        acc[curr.hari] = [];
      }
      acc[curr.hari].push(curr);
      return acc;
    },
    {}
  );

  // Sort days
  const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const sortedDays = Object.keys(groupedByDay).sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Absensi Saya</h1>

      {sortedDays.map((day) => (
        <div key={day} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{day}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedByDay[day].map((jadwal: any) => (
              <Link
                href={`/dashboard/siswa/absensi/${jadwal.jadwal_id}`}
                key={jadwal.jadwal_id}
              >
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {jadwal.nama_mapel}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {jadwal.jam_mulai} - {jadwal.jam_selesai}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-1">Guru: {jadwal.nama_guru}</p>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">
                          {jadwal.total_hadir}
                        </p>
                        <p className="text-xs text-gray-500">Hadir</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-yellow-600">
                          {jadwal.total_sakit}
                        </p>
                        <p className="text-xs text-gray-500">Sakit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-600">
                          {jadwal.total_izin}
                        </p>
                        <p className="text-xs text-gray-500">Izin</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-red-600">
                          {jadwal.total_alpha}
                        </p>
                        <p className="text-xs text-gray-500">Alpha</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
