"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmergencyAttendanceFormProps {
  activeClasses: any[];
  mataPelajaran: any[];
}

export default function EmergencyAttendanceForm({ 
  activeClasses, 
  mataPelajaran 
}: EmergencyAttendanceFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    router.push(
      `/dashboard/bk/absensi/input?` + 
      `kelas=${formData.get("kelas")}&` +
      `mapel=${formData.get("mapel")}&` +
      `tanggal=${formData.get("tanggal")}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">Kelas</label>
            <select name="kelas" className="w-full border rounded p-2">
              {activeClasses.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">
              Mata Pelajaran
            </label>
            <select name="mapel" className="w-full border rounded p-2">
              {mataPelajaran.map((mapel) => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.nama_mapel}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              className="w-full border rounded p-2"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <Button type="submit" className="w-full mt-4">
          Lanjut ke Input Absensi
        </Button>
      </div>
    </form>
  );
}