import { getJadwalByGuruId } from "@/app/libs/features/queryJadwal";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import React from "react";
import { convertDay } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Jadwal = {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  mata_pelajaran: string;
  nama_guru: string;
  tahun_ajaran: string;
  kelas: string;
};

const JadwalComponent = ({ children }: { children: Jadwal[] }) => {
  return (
    <section className="mt-10 p-4 flex flex-wrap">
      {children.map((res, idx: number) => (
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
          <CardFooter>
            <Link href={`/dashboard/guru/absensi/create/${res.id}`}>
              <Button>Isi Absensi</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
};

const Page = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const date = new Date().getDay();
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const getData = await getJadwalByGuruId(parseInt(guruId), convertDay(date));
  return (
    <div>
      {getData.length > 0 ? (
        <JadwalComponent children={getData} />
      ) : (
        <>Tidak ada Jadwal</>
      )}
    </div>
  );
};

export default Page;
