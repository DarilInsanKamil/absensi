"use client";

import { ResponseTableSiswa } from "@/definitions";
import { formatStatus } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function TableSiswa({ children }: { children: ResponseTableSiswa[] }) {
  const router = useRouter();
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama</th>
          <th className="px-4 py-2 text-left">NIS</th>
          <th className="px-4 py-2 text-left">Gender</th>
          <th className="px-4 py-2 text-left">Alamat</th>
          <th className="px-4 py-2 text-left">Kelas</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {children.map((child, index) => (
          <tr
            key={index}
            onClick={() => router.push(`/dashboard/siswa/${child.id}`)}
            className="border-b border-gray-300 hover:bg-gray-500"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{child.nama}</td>
            <td className="px-4 py-2">{child.nis}</td>
            <td className="px-4 py-2">{child.jenis_kelamin}</td>
            <td className="px-4 py-2">{child.alamat}</td>
            <td className="px-4 py-2">{child.nama_kelas}</td>
            <td className="px-4 py-2">
              <div className="bg-green-400 font-semibold border-1 border-black text-xs w-fit px-2 rounded-sm">
                {formatStatus(child.status_aktif)}
              </div>
            </td>
            <td className="px-4 py-2 flex gap-2">
              <Button className="bg-red-400" size="icon">
                <Trash2 />
              </Button>
              <Button size="sm">
                <Pencil />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
