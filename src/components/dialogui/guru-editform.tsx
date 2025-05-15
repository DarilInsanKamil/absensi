import { useCreateGuru, useUpdateGuru } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Guru } from "@/definitions";
import Form from "next/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DialogGuruEditForm({
  id,
  onSuccess,
  trigger,
}: {
  id: number;
  onSuccess?: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [guru, setGuru] = useState<Guru | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await useUpdateGuru(id, formData);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/guru/${id}`);
        if (!response.ok) throw new Error("Failed to fetch teacher data");
        const data = await response.json();
        setGuru(data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        toast.error("Gagal mengambil data guru");
      }
    };

    if (open) fetchData();
  }, [id, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Guru</DialogTitle>
        {guru ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>NIP</label>
              <Input
                placeholder="masukan nip"
                name="nip"
                defaultValue={guru.nip}
              />
            </div>
            <div>
              <label>Nama Lengkap</label>
              <Input
                placeholder="masukan nama lengkap"
                name="nama"
                defaultValue={guru.nama}
              />
            </div>
            <div>
              <label>Jenis Kelamin</label>
              <div className="flex gap-3">
                <div className="flex gap-1">
                  <input
                    name="jenis_kelamin"
                    type="radio"
                    defaultValue="L"
                    defaultChecked={guru.jenis_kelamin === "L"}
                  />
                  <label>Laki-laki</label>
                </div>
                <div className="flex gap-1">
                  <input
                    name="jenis_kelamin"
                    type="radio"
                    defaultValue="P"
                    defaultChecked={guru.jenis_kelamin === "P"}
                  />
                  <label>Perempuan</label>
                </div>
              </div>
            </div>
            <div>
              <label>Alamat</label>
              <Input
                placeholder="masukan alamat"
                type="text"
                name="alamat"
                defaultValue={guru.alamat}
              />
            </div>
            <div>
              <label>No Telepon</label>
              <Input
                placeholder="masukan no telepom"
                type="tel"
                defaultValue={guru.no_telepon}
                name="no_telpon"
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                placeholder="masukan alamat"
                type="email"
                name="email"
                defaultValue={guru.email}
              />
            </div>
            <div>
              <label>Status</label>
              <div className="flex gap-3">
                <div className="flex gap-1">
                  <input
                    name="status"
                    type="radio"
                    defaultValue="true"
                    defaultChecked={guru.status_aktif === true}
                  />
                  <label>Aktif</label>
                </div>
                <div className="flex gap-1">
                  <input
                    name="status"
                    type="radio"
                    defaultValue="false"
                    defaultChecked={guru.status_aktif === false}
                  />
                  <label>Tidak Aktif</label>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
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
