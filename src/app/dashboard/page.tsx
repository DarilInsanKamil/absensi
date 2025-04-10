import React from "react";
import Link from "next/link";
import next from "next";

import { Button } from "@/components/ui/button";
import { queryLength } from "../libs/features/queryLength";
const Page = async () => {
  const res = await queryLength();
    
  return (
    <div>
      <p>GURU: {res?.guru}</p>
      <p>KELAS:  {res?.kelas}</p>
      <p>SISWA: {res?.siswa}</p>
    </div>
  );
};

export default Page;
