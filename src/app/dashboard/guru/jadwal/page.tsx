import { getJadwalByGuruId } from "@/app/libs/features/queryJadwal";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import React from "react";
import { convertDay } from "@/lib/utils";
import Link from "next/link";

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
    <div className="mt-10 p-4">
      {children.map((res, idx: number) => (
        <div key={idx} className="mb-4 p-4 border">
          <p>
            <strong>{res.hari}</strong>
          </p>
          <p>Guru: {res.nama_guru}</p>
          <p>Kelas: {res.kelas}</p>
          <p>
            Waktu: {res.jam_mulai} - {res.jam_selesai}
          </p>
          <Link href={`/dashboard/guru/absensi/${res.id}`}>
            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
              Isi Absensi
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

const Page = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const date = new Date();
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";
  const getData = await getJadwalByGuruId(parseInt(guruId), convertDay(date));
  return (
    <div>
      {getData.length > 1 ? (
        <JadwalComponent children={getData} />
      ) : (
        <>Tidak ada Jadwal</>
      )}
    </div>
  );
};

export default Page;
