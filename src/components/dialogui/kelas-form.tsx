"use client";

import { useCreateKelas } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResponseTableGuru, ResponseTableTahunAjaran } from "@/definitions";
import Form from "next/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DialogKelasForm({ onSuccess }: { onSuccess?: () => void }) {
  const [guru, setGuru] = useState<ResponseTableGuru[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState<ResponseTableTahunAjaran[]>(
    []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDataGuru = async () => {
      const response = await fetch("/api/guru");
      const data = await response.json();
      setGuru(data);
    };

    const fetchDataTahunAjaran = async () => {
      const response = await fetch("/api/tahunajaran");
      const data = await response.json();
      setTahunAjaran(data);
    };
    fetchDataGuru();
    fetchDataTahunAjaran();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await useCreateKelas(formData);

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
        <Button onClick={() => setOpen(true)}>Tambah Kelas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Kelas</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>Nama Kelas</label>
            <Input placeholder="masukan nama kelas" name="nama_kelas" />
          </div>
          <div>
            <label>Tahun Ajaran</label>
            <select
              name="tahun_ajaran_id"
              id="tahun_ajaran_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {tahunAjaran.map((res, idx) => (
                <option key={idx} value={res.id}>
                  {res.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Wali Kelas</label>
            <br></br>
            <select
              name="walikelas_id"
              id="walikelas_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {guru.map((res, idx) => (
                <option key={idx} value={res.id}>
                  {res.nama}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="mt-5">
            Tambah Kelas
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
