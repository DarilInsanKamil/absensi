"use client";

import { useCreateSiswa } from "@/app/libs/action";
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

interface DataKelas {
  id: number;
  nama_kelas: string;
  wali_kelas: string;
  tahun_ajaran: string;
}

export function DialogSiswaForm({
  dataKelas,
  onSuccess,
}: {
  dataKelas: DataKelas[];
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await useCreateSiswa(formData);

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
        <Button onClick={() => setOpen(true)}>Tambah Siswa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Siswa</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>NISN</label>
            <Input placeholder="masukan nip atau nisn" name="nis" />
          </div>
          <div>
            <label>Nama Lengkap</label>
            <Input placeholder="masukan nip atau nisn" name="nama" />
          </div>
          <div>
            <label>Jenis Kelamin</label>
            <div className="flex gap-3">
              <div className="flex gap-1">
                <input name="jenis_kelamin" type="radio" value="L" />
                <label>Laki-laki</label>
              </div>
              <div className="flex gap-1">
                <input name="jenis_kelamin" type="radio" value="P" />
                <label>Perempuan</label>
              </div>
            </div>
          </div>
          <div>
            <label>Tanggal Lahir</label>
            <Input type="date" name="ttl" />
          </div>
          <div>
            <label>Alamat</label>
            <Input placeholder="masukan alamat" type="text" name="alamat" />
          </div>
          <div>
            <label>No Telepon</label>
            <Input
              placeholder="masukan no telepon"
              type="number"
              name="no_telepon"
            />
          </div>
          <div>
            <label>Email</label>
            <Input placeholder="masukan email" type="email" name="email" />
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
          <Button type="submit" className="mt-5">
            Tambah Siswa
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
