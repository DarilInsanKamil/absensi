"use client";

import { JadwalPerKelas } from "@/definitions";
import { useEffect, useState } from "react";

const Page = () => {
  const [jadwal, setJadwal] = useState<JadwalPerKelas>({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/jadwal");
      const data = await response.json();

      setJadwal(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      {Object.keys(jadwal).map((kelas) => (
        <div key={kelas} className="mt-6">
          <h1 className="text-xl font-bold">{kelas}</h1>
          {Object.keys(jadwal[kelas]).map((hari) => (
            <div key={hari} className="mt-4">
              <h2 className="text-lg font-semibold">{hari}</h2>
              {jadwal[kelas][hari].map((item: any) => (
                <div key={item.id} className="mt-2">
                  <h3>{item.mata_pelajaran}</h3>
                  <p>{item.guru}</p>
                  <p>
                    {item.jam_mulai} - {item.jam_selesai}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Page;
