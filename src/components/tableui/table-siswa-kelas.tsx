"use client";

import { ResponseTableKelas } from "@/definitions";
import { Button } from "../ui/button";

import Link from "next/link";

export function TableSiswaKelas({
  children,
  onDelete,
}: {
  children: ResponseTableKelas[];
  onDelete?: () => void;
}) {
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama</th>
          <th className="px-4 py-2 text-left">Tahun Ajaran</th>
          <th className="px-4 py-2 text-left">Wali Kelas</th>
          <th className="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {children.map((child, index) => (
          <tr
            key={index}
            className="border-b border-gray-300 hover:bg-gray-100"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{child.nama_kelas}</td>
            <td className="px-4 py-2">{child.tahun_ajaran}</td>
            <td className="px-4 py-2">{child.wali_kelas}</td>
            <td className="px-4 py-2">
              <Button>
                <Link href={`/dashboard/guru/kelas/${child.id}/siswa-kelas`}>
                  Dettail
                </Link>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    // <p>Hello</p>
  );
}
