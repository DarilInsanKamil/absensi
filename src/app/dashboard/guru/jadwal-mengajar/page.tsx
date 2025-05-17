import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getJadwalGuru } from "@/app/libs/features/queryJadwal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Page = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";
  const data = await getJadwalGuru(parseInt(guruId));
  return (
    <section className="mt-5 p-5 flex flex-wrap gap-4">
      {data.map((res, idx) => (
        <Card key={idx} className="w-[400]">
          <CardHeader>
            <h3 className="font-bold text-2xl">{res.hari}</h3>
          </CardHeader>
          <CardContent>
            <p>{res.mata_pelajaran}</p>
            <p>{res.kelas}</p>
            <p>
              {res.jam_mulai} - {res.jam_selesai}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default Page;
