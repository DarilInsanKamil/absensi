"use client";

import { ResponseTableSiswa } from "@/definitions";
import { formatStatus } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function TableSiswa({ children }: { children: ResponseTableSiswa[] }) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">No</th>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">NIS</th>
            <th className="px-4 py-2 text-left">Jenis Kelamin</th>
            <th className="px-4 py-2 text-left">Alamat</th>
            <th className="px-4 py-2 text-left">Kelas</th>
            <th className="px-4 py-2 text-left">Status</th>
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
              <td className="px-4 py-2">{formatStatus(child.status_aktif)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
