"use client";

import { useCreateTahunAjaran } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useState } from "react";
import { toast } from "sonner";

export function DialogTahunAjaranForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      await useCreateTahunAjaran(formData);

      toast.success("Berhasil", {
        description: "Data siswa berhasil ditambahkan.",
      });

      if (onSuccess) onSuccess();

      setOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat menambahkan data siswa.",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Tambah Tahun Ajaran</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Kelas</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>Nama Tahun Ajaran</label>
            <Input placeholder="masukan nama tahun ajaran" name="nama" />
          </div>
          <div>
            <label>Tanggal Mulai</label>
            <Input name="tanggal_mulai" type="date" />
          </div>
          <div>
            <label>Tanggal Selesai</label>
            <Input name="tanggal_selesai" type="date" />
          </div>
          <div>
            <label>Status</label>
            <div className="flex gap-3">
              <div className="flex gap-1">
                <input name="status" type="radio" value="1" />
                <label>Aktif</label>
              </div>
              <div className="flex gap-1">
                <input name="status" type="radio" value="0" />
                <label>Tidak Aktif</label>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-5">
            Tambah Kelas
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
