'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dataBulan, dataTahun } from '@/app/libs';

type Props = {
  kelasId: number;
};

export default function RekapForm({ kelasId }: Props) {
  const router = useRouter();
  const [bulan, setBulan] = useState(new Date().getMonth() + 1); // default: bulan ini
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/guru/absensi/rekap-absensi?kelas_id=${kelasId}&bulan=${bulan}&tahun=${tahun}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <select value={bulan} onChange={(e) => setBulan(parseInt(e.target.value))}>
        {dataBulan.map((resBulan, idx) => (
          <option key={idx} value={resBulan.value}>
            {resBulan.nama}
          </option>
        ))}
      </select>

      <select value={tahun} onChange={(e) => setTahun(parseInt(e.target.value))}>
        {dataTahun.map((resTahun, idx) => (
          <option key={idx} value={resTahun.value}>
            {resTahun.nama}
          </option>
        ))}
      </select>

      <Button type="submit">Rekap Absen</Button>
    </form>
  );
}
