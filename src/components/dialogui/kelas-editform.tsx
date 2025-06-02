"use client";

import { useUpdateKelas } from "@/app/libs/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kelas } from "@/definitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Matpel {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  status_aktif: string;
}

export function DialogEditKelasForm({
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
  const [kelas, setKelas] = useState<Kelas | null>();
  const [guru, setGuru] = useState<any>();
  const [tahunAjaran, setTahunAjaran] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchFormData = async () => {
      if (!open) return; // Only fetch when dialog is open

      try {
        setIsLoading(true);
        const [guruRes, tahunAjaranRes] = await Promise.all([
          fetch("/absensiteknomedia/api/guru"),
          fetch("/absensiteknomedia/api/tahunajaran"),
        ]);

        if (!isMounted) return;

        const [guruData, tahunAjaranData] = await Promise.all([
          guruRes.json(),
          tahunAjaranRes.json(),
        ]);

        setGuru(guruData);
        setTahunAjaran(tahunAjaranData);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Gagal mengambil data form");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFormData();

    return () => {
      isMounted = false;
    };
  }, [open]);

  // Separate useEffect for kelas data
  useEffect(() => {
    let isMounted = true;

    const fetchKelasData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/absensiteknomedia/api/kelas/${id}`);
        if (!response.ok) throw new Error("Failed to fetch kelas data");

        if (!isMounted) return;

        const data = await response.json();
        setKelas(data);
      } catch (error) {
        console.error("Error fetching kelas:", error);
        toast.error("Gagal mengambil data kelas");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (open && id) {
      fetchKelasData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await useUpdateKelas(id, formData);

      toast.success("Berhasil", {
        description: "Data kelas berhasil diupdate.",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating kelas:", error);
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat mengupdate data kelas.",
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
        {kelas ? (
          <form onSubmit={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Nama Kelas</label>
              <Input
                placeholder="masukan kode mata pelajaran"
                name="nama_kelas"
                defaultValue={kelas.nama_kelas}
              />
            </div>
            <div>
              <label>Tahun Ajaran</label>
              <select
                name="tahun_ajaran_id"
                id="tahun_ajaran_id"
                defaultValue={kelas.tahun_ajaran_id}
                className="w-full bg-white outline-2 p-2 rounded-sm"
              >
                {tahunAjaran?.map((res: any, idx: number) => (
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
                defaultValue={kelas.walikelas_id}
                className="w-full bg-white outline-2 p-2 rounded-sm"
              >
                {guru?.map((res: any, idx: number) => (
                  <option key={idx} value={res.id}>
                    {res.nama}
                  </option>
                ))}
              </select>
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
