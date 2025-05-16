import { useCreateGuru } from "@/app/libs/action";
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

export function DialogGuruForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await useCreateGuru(formData);

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
        <Button onClick={() => setOpen(true)}>Tambah Guru</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Input Data Guru</DialogTitle>
        <Form action={handleSubmit} className="grid gap-2 py-4">
          <div>
            <label>NIP</label>
            <Input placeholder="masukan nip" name="nip" />
          </div>
          <div>
            <label>Nama Lengkap</label>
            <Input placeholder="masukan nama lengkap" name="nama" />
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
            <label>Alamat</label>
            <Input placeholder="masukan alamat" type="text" name="alamat" />
          </div>
          <div>
            <label>No Telepon</label>
            <Input
              placeholder="masukan no telepom"
              type="number"
              name="no_telepon"
            />
          </div>
          <div>
            <label>Email</label>
            <Input placeholder="masukan alamat" type="email" name="email" />
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
          <Button type="submit" className="mt-2">
            Tambah Guru
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
