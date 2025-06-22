"use client";

import {
  useCreateJadwal,
  useCreateSiswa,
  useUpdateJadwal,
} from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatTimeForInput } from "@/lib/utils";
import Form from "next/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DialogEditJadwalForm({
  id,
  onSuccess,
  trigger,
}: {
  id: number;
  onSuccess?: () => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [guru, setGuru] = useState<any>([]);
  const [kelas, setKelas] = useState<any>([]);
  const [tahunAjaran, setTahunAjaran] = useState<any>([]);
  const [mataPelajaran, setMataPelajaran] = useState<any>([]);
  const [jadwal, setJadwal] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchForm = async () => {
      if (!open || guru.length > 0) return; // Skip if already loaded

      try {
        setIsLoading(true);
        const res = await fetch("/absensiteknomedia/api/getFormJadwal");
        const datas = await res.json();

        if (isMounted) {
          setGuru(datas.guru);
          setKelas(datas.kelas);
          setMataPelajaran(datas.mataPelajaran);
          setTahunAjaran(datas.tahunAjaran);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchForm();
    return () => {
      isMounted = false;
    };
  }, [open]);

  // Fetch jadwal data when id changes and dialog is open
  useEffect(() => {
    let isMounted = true;

    const fetchJadwal = async () => {
      if (!open || !id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/absensiteknomedia/api/jadwal/${id}`);
        const data = await res.json();
        setJadwal(data);
      } catch (error) {
        console.error("Error fetching jadwal:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchJadwal();
    return () => {
      isMounted = false;
    };
  }, [id, open]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await useUpdateJadwal(id, formData);
      toast.success("Berhasil", {
        description: "Data siswa berhasil ditambahkan.",
      });
      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat update data jadwal.",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Jadwal</DialogTitle>
        {jadwal && jadwal.guru_id && guru.length && mataPelajaran.length && kelas.length && tahunAjaran.length && jadwal.mata_pelajaran_id ? (
          <Form action={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Guru</label>
              <br></br>
              <select
                name="guru_id"
                id="guru_id"
                defaultValue={jadwal.guru_id}
                className="w-full bg-white outline-2 p-2 rounded-sm"
              >
                {guru?.map((res: any, idx: number) => {
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
                defaultValue={jadwal.mata_pelajaran_id}
              >
                {mataPelajaran?.map((res: any, idx: number) => {
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
                defaultValue={jadwal.kelas_id}
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
                defaultValue={jadwal.tahun_ajaran_id}
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
              <Input
                placeholder="masukan hari"
                name="hari"
                defaultValue={jadwal.hari}
              />
            </div>
            <div>
              <label>Jam Mulai</label>
              <Input
                placeholder="masukan jam mulai"
                type="time"
                name="jam_mulai"
                defaultValue={formatTimeForInput(jadwal?.jam_mulai)}
              />
            </div>
            <div>
              <label>Jam Selesai</label>
              <Input
                placeholder="masukan jam selesai"
                type="time"
                name="jam_selesai"
                defaultValue={formatTimeForInput(jadwal?.jam_selesai)}
              />
            </div>
            <Button type="submit" className="mt-5">
              Update Jadwal
            </Button>
          </Form>
        ) : (
          <p>Loading..</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
