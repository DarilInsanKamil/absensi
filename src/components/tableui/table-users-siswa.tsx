"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { CreateUserDialog } from "../dialogui/create-user-dialog";
import { formatStatus } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface Siswa {
  id: string;
  nis: string;
  jenis_kelamin: string;
  alamat: string;
  nama_kelas: string;
  status_aktif: boolean;
  nama: string;
  kelas: string;
}

export function SiswaTable({ children }: { children: Siswa[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!children || !Array.isArray(children)) {
    return (
      <div className="p-4 text-center">
        <p>Tidak ada data guru yang tersedia</p>
      </div>
    );
  }

  const filteredUser = useMemo(() => {
    return children.filter((s: any) => {
      // Then filter by search query
      if (searchQuery) {
        return (
          s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nis.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return true;
    });
  }, [children, searchQuery]);
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Cari siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-200 p-2">
            <th className="p-2">NO</th>
            <th className="p-2">NIS</th>
            <th className="p-2">Nama</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUser.map((child, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{child.nis}</td>
              <td className="py-2">{child.nama}</td>
              <td className="py-2">
                <CreateUserDialog
                  id={child.id}
                  data={child}
                  trigger={
                    <Button size="icon" variant="noShadow">
                      <PlusCircle />
                    </Button>
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
