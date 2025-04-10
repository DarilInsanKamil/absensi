import { KelasBoxComponent } from "@/components/kelas-boxcomponents";

import React from "react";

const Page = async () => {
  const res = await fetch("http://localhost:3000/api/kelas");
  const kelas = await res.json();

  return (
    <div>
      {kelas.map((item: any) => {
        return (
          <KelasBoxComponent key={item.id} kelas={item.nama_kelas} id={item.id}/>
        );
      })}
    </div>
  );
};

export default Page;
