"use client";

import {
  useCreateMatpel,
  useUpdateMatpel,
  useUpdatePassword,
} from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Users {
  id: number;
  username: string;
  role: string;
  password: string;
  status_aktif: string;
}

export function DialogChangePassword({
  id,
  onSuccess,
  trigger,
}: {
  id: number;
  onSuccess?: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Users | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/absensiteknomedia/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch matpel data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching matpel:", error);
        toast.error("Gagal mengambil user");
      }
    };

    if (open) fetchData();
  }, [id, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await useUpdatePassword(id, formData);

      toast.success("Berhasil", {
        description: "Data password berhasil diupdate.",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat mengupdate data password.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Change Password</DialogTitle>
        <div>
          <p>Username: {user?.username}</p>
          <p>Role: {user?.role}</p>
        </div>
        {user ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Change Password</label>
              <Input
                placeholder="masukan password yang baru"
                name="password"
                type="password"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="mt-2">
              {isLoading ? (
                <>
                  <span className="mr-2">Menyimpan...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                "Simpan Perubahan"
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
