import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import jwt from "jsonwebtoken";
import { getMatpelBySiswa } from "@/app/libs/features/querySiswa";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Jadwal2 } from "@/definitions";

const Page = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const siswaId = decoded.reference_id;

  const jadwalList = await getMatpelBySiswa(siswaId);
  const grouped = Object.groupBy(jadwalList, (item) => item.hari);
  return (
    <section className="grid md:grid-cols-2 gap-4 p-5 mt-5">
      {Object.entries(grouped).map(([hari, list]) => (
        <div key={hari} className="mb-6">
          {list?.map((res: Jadwal2, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <h3 className="text-2xl font-bold tracking-tight">{res.hari}</h3>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between border-b py-2 border-gray-700">
                  <div>
                    <p className="font-bold">{res.nama_mapel}</p>
                    <p>{res.nama_guru}</p>
                  </div>
                  <p className="text-gray-700">
                    {res.jam_mulai} - {res.jam_selesai}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Page;
