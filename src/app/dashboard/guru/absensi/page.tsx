import { dataBulan, dataTahun } from "@/app/libs";
import { getKelasByGuruId } from "@/app/libs/features/queryJadwal";
import RekapForm from "@/components/dialogui/rekap-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const Page = async () => {
  const cookieStore = cookies();
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
        <Card key={idx}>
          <CardHeader>
            <h2 className="font-bold text-2xl">{res.nama_kelas}</h2>
          </CardHeader>
          <CardContent>
            <RekapForm kelasId={res.id} />
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default Page;
