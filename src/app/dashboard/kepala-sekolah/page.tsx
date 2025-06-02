export const dynamic = "force-dynamic";

import React from "react";

import { KelasIcon, SiswaIcon, TeacherIcon } from "@/components/icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { queryLength } from "@/app/libs/features/queryLength";
import Link from "next/link";
const Page = async () => {
  const res = await queryLength();

  return (
    <section className="w-full px-6 mt-10">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">
            Selamat Datang di Dasbor Absensi Sekolah!
          </h1>
          <p className="text-base text-muted-foreground">
            Ringkasan informasi terkini dan akses cepat ke berbagai fitur.
          </p>
        </CardHeader>
        <CardContent className="flex gap-4 items-center mt-5 md:flex-row flex-col">
          <Link href="/absensiteknomedia/dashboard/kepala-sekolah/guru" className="w-full">
            <div className="bg-blue-400 border-2 border-black text-xl text-white font-semibold p-3 w-full rounded-md flex gap-2 items-center">
              <TeacherIcon />
              <p>{res?.guru} Guru</p>
            </div>
          </Link>
          <Link href="/absensiteknomedia/dashboard/kepala-sekolah/siswa" className="w-full">
            <div className="bg-blue-400 border-2 border-black text-xl text-white font-semibold p-3  rounded-md flex gap-2 items-center">
              <SiswaIcon />
              <p>{res?.siswa} Siswa</p>
            </div>
          </Link>
          <Link href="/absensiteknomedia/dashboard/kepala-sekolah/kelas" className="w-full">
            <div className="bg-blue-400 border-2 border-black text-xl text-white font-semibold p-3 w-full rounded-md flex gap-2 items-center">
              <KelasIcon />
              <p>{res?.kelas} Kelas</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
