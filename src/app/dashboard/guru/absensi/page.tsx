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

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const data = await getKelasByGuruId(parseInt(guruId));
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-6">Daftar Kelas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((kelas, idx) => (
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
                {kelas.jadwal.split(", ").map((jadwal: any, i: number) => (
                  <p key={i} className="text-sm pl-2">
                    {jadwal}
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Link href={`/dashboard/guru/absensi/${kelas.id}/history`}>
                <Button variant="noShadow">History Absen</Button>
              </Link>
              <RekapForm kelasId={kelas.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
