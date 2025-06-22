"use client";

import { useCreateTahunAjaran, useUpdateTahunAjaran } from "@/app/libs/action";
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

interface TahunAjaran {
  id: number;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status_aktif: boolean;
}

export function DialogEditTahunAjaranForm({
  id,
  trigger,
  onSuccess,
}: {
  id: number;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran>();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let isMounted = true;

    const fetchJadwal = async () => {
      if (!open || !id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/absensiteknomedia/api/tahunajaran/${id}`);
        const data = await res.json();

        if (isMounted) {
          setTahunAjaran(data);
        }
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
      await useUpdateTahunAjaran(id, formData);

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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Tahun Ajaran</DialogTitle>
        {tahunAjaran ? (
          <Form action={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Nama Tahun Ajaran</label>
              <Input
                placeholder="masukan nama tahun ajaran"
                name="nama"
                defaultValue={tahunAjaran?.nama}
              />
            </div>
            <div>
              <label>Tanggal Mulai</label>
              <Input
                name="tanggal_mulai"
                type="date"
                defaultValue={
                  new Date(tahunAjaran.tanggal_mulai)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div>
              <label>Tanggal Selesai</label>
              <Input
                name="tanggal_selesai"
                type="date"
                defaultValue={
                  new Date(tahunAjaran.tanggal_selesai)
                    .toISOString()
                    .split("T")[0]
                }
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
                    defaultChecked={tahunAjaran?.status_aktif === true}
                  />
                  <label>Aktif</label>
                </div>
                <div className="flex gap-1">
                  <input
                    name="status"
                    type="radio"
                    defaultValue="false"
                    defaultChecked={tahunAjaran?.status_aktif === false}
                  />
                  <label>Tidak Aktif</label>
                </div>
              </div>
            </div>
            <Button type="submit" className="mt-5">
              Update data
            </Button>
          </Form>
        ) : (
          <p>Loading..</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
