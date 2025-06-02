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
  const [tahunAjaran, setTahunAjaran] = useState<ResponseTableTahunAjaran[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchFormData = async () => {
      if (!open || guru.length > 0) return; // Skip if not open or already loaded
      
      try {
        setIsLoading(true);
        const [guruRes, tahunAjaranRes] = await Promise.all([
          fetch("/absensiteknomedia/api/guru"),
          fetch("/absensiteknomedia/api/tahunajaran")
        ]);

        if (!isMounted) return;

        const [guruData, tahunAjaranData] = await Promise.all([
          guruRes.json(),
          tahunAjaranRes.json()
        ]);

        setGuru(guruData);
        setTahunAjaran(tahunAjaranData);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Gagal mengambil data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFormData();

    return () => {
      isMounted = false;
    };
  }, [open]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      await useCreateKelas(formData);

      toast.success("Berhasil", {
        description: "Data kelas berhasil ditambahkan.",
      });

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error creating kelas:", error);
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat menambahkan data kelas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Tambah Kelas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Kelas</DialogTitle>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Form action={handleSubmit} className="grid gap-2 py-4">
            <div>
              <label>Nama Kelas</label>
              <Input 
                placeholder="masukan nama kelas" 
                name="nama_kelas" 
                required 
              />
            </div>
            <div>
              <label>Tahun Ajaran</label>
              <select
                name="tahun_ajaran_id"
                id="tahun_ajaran_id"
                className="w-full bg-white outline-2 p-2 rounded-sm"
                required
              >
                <option value="">Pilih Tahun Ajaran</option>
                {tahunAjaran.map((ta) => (
                  <option key={ta.id} value={ta.id}>
                    {ta.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Wali Kelas</label>
              <select
                name="walikelas_id"
                id="walikelas_id"
                className="w-full bg-white outline-2 p-2 rounded-sm"
                required
              >
                <option value="">Pilih Wali Kelas</option>
                {guru.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              type="submit" 
              className="mt-5"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Tambah Kelas"}
            </Button>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}