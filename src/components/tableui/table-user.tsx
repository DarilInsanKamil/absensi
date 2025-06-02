"use client";

import { useDeleteUsers } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DialogChangePassword } from "../dialogui/change-password";

interface Users {
  id: number;
  username: string;
  password: string;
  role: string;
  reference_id: string | number;
  reference_type: "ADMIN" | "GURU" | "SISWA";
  nama: string | null;
  created_at: string;
  updated_at: string;
}

export function UsersTable({ children }: { children: Users[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const filteredUsers = useMemo(() => {
    return children.filter((user) => {
      if (selectedRole !== "all" && user.role !== selectedRole) {
        return false;
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          user.nama?.toLowerCase().includes(searchLower) ||
          false ||
          user.username.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [selectedRole, searchQuery]);

  const handleDelete = async (id: number | string) => {
    try {
      await useDeleteUsers(id);

      toast.success("Berhasil", {
        description: `Berhasil Menghapus data siswa. ${id} `,
      });
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat menghapus data siswa.",
      });
    }
  };
  return (
    <>
      <div className="flex gap-5 my-6">
        <Input
          placeholder="Cari nama atau username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
            <SelectItem value="siswa">Siswa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">No</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.nama ?? "-"}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button
                  className="bg-red-400"
                  size="icon"
                  variant="noShadow"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <DialogChangePassword
                  id={user.id}
                  trigger={
                    <Button size="icon" variant="noShadow">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
