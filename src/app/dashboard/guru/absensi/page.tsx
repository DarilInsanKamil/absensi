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
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const data = await getKelasByGuruId(parseInt(guruId));
  return (
    <section className="mt-10 flex gap-4 flex-wrap p-5">
      {data.map((res, idx) => (
        <Card key={idx} className="w-full">
          <CardHeader>
            <h2 className="font-bold text-2xl">{res.nama_kelas}</h2>
            <h2 className="font-bold text-1xl">{res.nama_mapel}</h2>
          </CardHeader>
          <CardContent>
            <p>{res.hari}</p>
            <p>
              {res.jam_mulai} - {res.jam_selesai}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/guru/absensi/${res.id}/history`} className="mr-2">
              <Button>History Absen</Button>
            </Link>
            <RekapForm kelasId={res.id} />
          </CardFooter>
        </Card>
      ))}
    </section>
  );
};

export default Page;
