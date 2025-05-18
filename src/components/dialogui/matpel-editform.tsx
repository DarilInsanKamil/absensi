"use client";

import { useCreateMatpel, useUpdateMatpel } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Matpel {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  status_aktif: string;
}

export function DialogEditMatpelForm({
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
  const [matpel, setMatpel] = useState<Matpel | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/matpel/${id}`);
        if (!response.ok) throw new Error("Failed to fetch matpel data");
        const data = await response.json();
        setMatpel(data);
      } catch (error) {
        console.error("Error fetching matpel:", error);
        toast.error("Gagal mengambil data matpel");
      }
    };

    if (open) fetchData();
  }, [id, open]);
  console.log(matpel);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await useUpdateMatpel(id, formData);

      toast.success("Berhasil", {
        description: "Data guru berhasil diupdate.",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat mengupdate data guru.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Kelas</DialogTitle>
        {matpel ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Kode Mata Pelajaran</label>
              <Input
                placeholder="masukan kode mata pelajaran"
                name="kode_mapel"
                defaultValue={matpel?.kode_mapel}
              />
            </div>
            <div>
              <label>Nama Mata Pelajaran</label>
              <Input
                name="nama_mapel"
                type="text"
                placeholder="masukan nama mata pelajaran"
                defaultValue={matpel?.nama_mapel}
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
