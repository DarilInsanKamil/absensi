export const dynamic = 'force-dynamic'

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import React from "react";

import {
  getJadwalById,
  getSiswaByJadwalId,
} from "@/app/libs/features/queryJadwal";
import AbsensiPage from "./absensiPage";

type Params = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: {params: Promise<{id: string}>}) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const guruId = decoded.reference_id;

  // Ambil data jadwal & siswa
  const jadwal = await getJadwalById(parseInt(id));
  const siswaList = await getSiswaByJadwalId(parseInt(id));

  if (!jadwal || !siswaList) return notFound();

  return (
    <section>
      <AbsensiPage jadwal={jadwal} siswaList={siswaList} guruId={guruId} />
    </section>
  );
};

export default Page;
