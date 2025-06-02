"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { CreateUserDialog } from "../dialogui/create-user-dialog";
import { PlusCircle } from "lucide-react";

interface Guru {
  id: string;
  nip: string;
  jenis_kelamin: string;
  status_aktif: boolean;
  nama: string;
}

export function GuruTable({ children }: { children: Guru[] }) {
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
          s.nip.toLowerCase().includes(searchQuery.toLowerCase())
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
            <th className="p-2">NIP</th>
            <th className="p-2">Nama</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUser.length > 0 ? (
            filteredUser.map((child, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-gray-100"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{child.nip}</td>
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
            ))
          ) : (
            <p>Not Found</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
