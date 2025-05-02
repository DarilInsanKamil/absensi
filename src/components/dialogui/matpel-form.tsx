"use client";

import { useCreateMatpel } from "@/app/libs/action";
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

export function DialogMatpelForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      await useCreateMatpel(formData);

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
        <Button onClick={() => setOpen(true)}>Tambah Matpel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Kelas</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>Kode Mata Pelajaran</label>
            <Input
              placeholder="masukan kode mata pelajaran"
              name="kode_mapel"
            />
          </div>
          <div>
            <label>Nama Mata Pelajaran</label>
            <Input
              name="nama_mapel"
              type="text"
              placeholder="masukan nama mata pelajaran"
            />
          </div>

          <Button type="submit" className="mt-5">
            Tambah Matpel
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
