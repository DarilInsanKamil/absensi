"use client";

import { useCreateJadwal, useCreateSiswa } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DialogJadwalForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [guru, setGuru] = useState<any>([]);
  const [kelas, setKelas] = useState<any>([]);
  const [tahunAjaran, setTahunAjaran] = useState<any>([]);
  const [mataPelajaran, setMataPelajaran] = useState<any>([]);

  useEffect(() => {
    const fetchForm = async () => {
      const res = await fetch("/absensiteknomedia/api/getFormJadwal");
      const datas = await res.json();
      setGuru(datas.guru);
      setKelas(datas.kelas);
      setMataPelajaran(datas.mataPelajaran);
      setTahunAjaran(datas.tahunAjaran);
    };
    fetchForm();
  }, [open]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await useCreateJadwal(formData);
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
        <Button onClick={() => setOpen(true)}>Tambah Jadwal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Jadwal</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>Guru</label>
            <br></br>
            <select
              name="guru_id"
              id="guru_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {guru.map((res: any, idx: number) => {
                return (
                  <option key={idx} value={res.id}>
                    {res.nama}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Mata Pelajaran</label>
            <br></br>
            <select
              name="mata_pelajaran_id"
              id="mata_pelajaran_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {mataPelajaran.map((res: any, idx: number) => {
                return (
                  <option key={idx} value={res.id}>
                    {res.nama_mapel}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Kelas</label>
            <br></br>
            <select
              name="kelas_id"
              id="kelas_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {kelas.map((res: any, idx: number) => {
                return (
                  <option key={idx} value={res.id}>
                    {res.nama_kelas}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Tahun Ajaran</label>
            <br></br>
            <select
              name="tahun_ajaran_id"
              id="tahun_ajaran_id"
              className="w-full bg-white outline-2 p-2 rounded-sm"
            >
              {tahunAjaran.map((res: any, idx: number) => {
                return (
                  <option key={idx} value={res.id}>
                    {res.nama}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Hari</label>
            <Input placeholder="masukan hari" name="hari" />
          </div>
          <div>
            <label>Jam Mulai</label>
            <Input placeholder="masukan jam mulai" type="time" name="jam_mulai" />
          </div>
          <div>
            <label>Jam Selesai</label>
            <Input placeholder="masukan jam selesai" type="time" name="jam_selesai" />
          </div>
          <Button type="submit" className="mt-5">
            Tambah Siswa
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
