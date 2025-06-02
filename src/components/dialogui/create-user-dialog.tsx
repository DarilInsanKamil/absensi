"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

interface Users {
  id: number;
  username: string;
  role: string;
  password: string;
}

export function CreateUserDialog({
  id,
  onSuccess,
  trigger,
  data,
}: {
  id: number | string;
  onSuccess?: () => void;
  trigger: React.ReactNode;
  data: any;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Users | null>();
  const [selectedRole, setSelectedRole] = useState("ROLE");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get form values
      const formData = new FormData(e.currentTarget);
      const username = data.nis || data.nip;
      const password = formData.get("password");
      const role = formData.get("role");

      // Validate inputs
      if (!username || !password || !role) {
        toast.error("Gagal Create users", {
          description: `Semua field harus diisi ${username} ${password} ${role}`,
        });
        return;
      }

      // Create payload
      const payload = {
        username: data.nis || data.nip,
        password: password.toString(),
        role: role.toString().toLowerCase(),
        reference_id: data.id, // Add reference_id from props
      };

      // Send request
      const response = await fetch("/absensiteknomedia/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Create Users Berhasil");
        setOpen(false);
        router.refresh()
      }
    } catch (error) {
      console.error("Sign Up failed:", error);
      toast.error("Sign Up Error", {
        description: "Terjadi kesalahan saat sign up",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create User</DialogTitle>
        {data ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Username</label>
              <Input
                placeholder="masukan username"
                name="username"
                value={data.nis || data.nip}
                readOnly
                disabled
              />
            </div>
            <div className="w-full">
              <label>Role</label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                name="role"
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLE">ROLE</SelectItem>
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="siswa">Siswa</SelectItem>
                  <SelectItem value="kepsek">Kepala Sekolah</SelectItem>
                  <SelectItem value="bk">BK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label>Password</label>
              <Input
                placeholder="masukan password yang baru"
                name="password"
                type="password"
                minLength={4}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? (
                <>
                  <span className="mr-2">Menyimpan...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                "Buat User"
              )}
            </Button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
