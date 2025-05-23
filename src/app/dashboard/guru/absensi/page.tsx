export const dynamic = "force-dynamic";

import { getKelasByGuruId } from "@/app/libs/features/queryJadwal";
import RekapForm from "@/components/dialogui/rekap-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";

// const Page = async () => {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value || "";
//   const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
//   const guruId =
//     typeof decoded !== "string" && decoded.reference_id
//       ? (decoded.reference_id as string)
//       : "";

//   const data = await getKelasByGuruId(parseInt(guruId));

//   console.log(data)
//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-6">Daftar Kelas</h1>
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {data.map((kelas, idx) => (
//           <Card key={idx} className="h-fit">
//             <CardHeader>
//               <h2 className="font-bold text-xl">{kelas.nama_kelas}</h2>
//               <p className="text-lg font-medium text-muted-foreground">
//                 {kelas.nama_mapel}
//               </p>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground font-medium">
//                   Jadwal:
//                 </p>
//                 {kelas.jadwal.split(", ").map((jadwal: any, i: number) => (
//                   <p key={i} className="text-sm pl-2">
//                     {jadwal}
//                   </p>
//                 ))}
//               </div>
//             </CardContent>
//             <CardFooter className="flex gap-2">
//               <p>{kelas.id}</p>
//               <Link href={`/dashboard/guru/absensi/${kelas.id}/history`}>
//                 <Button variant="noShadow">History Absen</Button>
//               </Link>
//               <RekapForm kelasId={kelas.id} />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Page;




const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const data = await getKelasByGuruId(parseInt(guruId));

  // Group by class and subject
  const groupedData = data.reduce((acc: any, curr) => {
    const key = `${curr.nama_kelas}-${curr.nama_mapel}`;
    if (!acc[key]) {
      acc[key] = {
        nama_kelas: curr.nama_kelas,
        nama_mapel: curr.nama_mapel,
        schedules: []
      };
    }
    acc[key].schedules.push({
      id: curr.id,
      hari: curr.hari,
      jam: curr.jam
    });
    return acc;
  }, {});

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Daftar Kelas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(groupedData).map((kelas: any, idx) => (
          <Card key={idx} className="h-fit">
            <CardHeader>
              <h2 className="font-bold text-xl">{kelas.nama_kelas}</h2>
              <p className="text-lg font-medium text-muted-foreground">
                {kelas.nama_mapel}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Jadwal:
                </p>
                {kelas.schedules.map((schedule: any, i: number) => (
                  <div key={i} className="flex items-center justify-between pl-2">
                    <p className="text-sm">{schedule.hari} ({schedule.jam})</p>
                    <Link href={`/dashboard/guru/absensi/${schedule.id}/history`}>
                      <Button size="sm">History</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <RekapForm kelasId={kelas.schedules[0].id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;