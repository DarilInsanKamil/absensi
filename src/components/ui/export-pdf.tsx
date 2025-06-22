"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "./button";

interface ExportProps {
  data: any[];
  startDate: string;
  endDate: string;
  kelas?: string;
  mapel?: string;
}

export default function ExportToPDF({
  data,
  kelas,
  mapel,
  endDate,
  startDate,
}: ExportProps) {
  const handleExport = () => {
    const doc = new jsPDF();

    // Add title and date range
    doc.setFontSize(16);
    doc.text("Rekap Absensi Siswa", 14, 15);

    doc.setFontSize(12);
    doc.text(`Kelas: ${kelas || "-"}`, 14, 25);
    doc.text(`Mata Pelajaran: ${mapel || "-"}`, 14, 32);
    doc.text(
      `Periode: ${new Date(startDate).toLocaleDateString("id-ID")} - ${new Date(
        endDate
      ).toLocaleDateString("id-ID")}`,
      14,
      39
    );

    // Add table with offset for header
    autoTable(doc, {
      startY: 45,
      head: [["No", "Nama", "Hadir", "Izin", "Sakit", "Alpha"]],
      body: data.map((row, idx) => [
        idx + 1,
        row.nama_siswa,
        row.hadir,
        row.sakit,
        row.izin,
        row.alpha,
      ]),
    });

    doc.save(`rekap_absensi_${kelas}_${new Date().getTime()}.pdf`);
  };


  return (
    <Button size="sm" onClick={handleExport} variant='noShadow'>
      Export to PDF
    </Button>
  );
}
