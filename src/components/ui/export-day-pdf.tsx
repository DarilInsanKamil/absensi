"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "./button";
import { AttendanceSummary } from "@/definitions";

interface ExportProps {
  data: any[];
  startDate: string;
  endDate: string;
  kelas?: string;
  mapel?: string;
  summary: AttendanceSummary;
}

export default function DayExportToPDF({
  data,
  kelas,
  mapel,
  startDate,
  summary,
}: ExportProps) {
  const handleExport = () => {
    const doc = new jsPDF();

    // Add title and date range
    doc.setFontSize(16);
    doc.text("Rekap Absensi Harian", 14, 15);

    doc.setFontSize(12);
    doc.text(`Kelas: ${kelas || "-"}`, 14, 25);
    doc.text(`Mata Pelajaran: ${mapel || "-"}`, 14, 32);
    doc.text(
      `Tanggal: ${new Date(startDate).toLocaleDateString("id-ID")}`,
      14,
      39
    );

    // Add summary
    doc.text(`Hadir: ${summary.hadir} siswa`, 14, 46);
    doc.text(`Sakit: ${summary.sakit} siswa`, 14, 53);
    doc.text(`Izin: ${summary.izin} siswa`, 14, 60);
    doc.text(`Alpha: ${summary.alpha} siswa`, 14, 67);
    doc.text(`Total Siswa: ${summary.total} siswa`, 14, 74);

    // Add table with offset for header
    autoTable(doc, {
      startY: 81,
      head: [["No", "Nama", "NIS", "Status"]],
      body: data.map((row, idx) => [
        idx + 1,
        row.nama_siswa,
        row.nis,
        row.status,
      ]),
    });
    doc.save(`rekap_absensi_harian_${kelas}_${new Date().getTime()}.pdf`);
  };

  return (
    <Button size="sm" onClick={handleExport}>
      Export to PDF
    </Button>
  );
}
