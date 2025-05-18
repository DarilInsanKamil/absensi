"use client";

import { useUpdateSiswa } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Siswa } from "@/definitions";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DataKelas {
  id: number;
  nama_kelas: string;
  wali_kelas: string;
  tahun_ajaran: string;
}

export function DialogSiswaEditForm({
  id,
  dataKelas,
  onSuccess,
  trigger
}: {
  id: string;
  dataKelas: DataKelas[];
  onSuccess?: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [siswa, setSiswa] = useState<Siswa | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/siswa/${id}`);
        if (!response.ok) throw new Error("Failed to fetch teacher siswa");
        const data = await response.json();
        setSiswa(data);
      } catch (error) {
        console.error("Error fetching siswa:", error);
        toast.error("Gagal mengambil data siswa");
      }
    };

    if (open) fetchData();
  }, [id, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await useUpdateSiswa(id, formData);

      toast.success("Berhasil", {
        description: "Data siswa berhasil diupdate.",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat mengupdate data siswa.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Siswa</DialogTitle>
        {siswa ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>NISN</label>
              <Input
                placeholder="masukan nip atau nisn"
                name="nis"
                defaultValue={siswa.nis}
              />
            </div>
            <div>
              <label>Nama Lengkap</label>
              <Input
                placeholder="masukan nama"
                name="nama"
                defaultValue={siswa.nama}
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
                    defaultChecked={siswa.jenis_kelamin === "L"}
                  />
                  <label>Laki-laki</label>
                </div>
                <div className="flex gap-1">
                  <input
                    name="jenis_kelamin"
                    type="radio"
                    defaultValue="P"
                    defaultChecked={siswa.jenis_kelamin === "P"}
                  />
                  <label>Perempuan</label>
                </div>
              </div>
            </div>
            <div>
              <label>Tanggal Lahir</label>
              <Input
                type="date"
                name="ttl"
                defaultValue={siswa.tanggal_lahir}
              />
            </div>
            <div>
              <label>Alamat</label>
              <Input
                placeholder="masukan alamat"
                type="text"
                name="alamat"
                defaultValue={siswa.alamat}
              />
            </div>
            <div>
              <label>No Telepon</label>
              <Input
                placeholder="masukan no telepon"
                type="tel"
                name="no_telepon"
                defaultValue={siswa.no_telepon}
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                placeholder="masukan email"
                type="email"
                name="email"
                defaultValue={siswa.email}
              />
            </div>
            <div>
              <label>Kelas</label>
              <br></br>
              <select
                name="kelas"
                id="kelas"
                className="w-full bg-white outline-2 p-2 rounded-sm"
              >
                {dataKelas.map((res: any, idx: number) => {
                  return (
                    <option key={idx} value={res.id}>
                      {res.nama_kelas}
                    </option>
                  );
                })}
              </select>
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
          <p>Loading... </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
