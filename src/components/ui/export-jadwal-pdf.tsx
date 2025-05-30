"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "./button";

interface JadwalData {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  nama_mapel: string;
  nama_guru: string;
}

interface ExportJadwalProps {
  data: { [key: string]: JadwalData[] };
  kelas?: string;
}

export default function ExportJadwalToPDF({ data, kelas }: ExportJadwalProps) {
  const handleExport = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text("Jadwal Pelajaran", 14, 15);
    
    doc.setFontSize(12);
    doc.text(`Kelas: ${kelas || "-"}`, 14, 25);

    // Convert data to table format
    const tableBody: any[] = [];
    
    // Sort days
    const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
    const sortedDays = Object.keys(data).sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    // Process each day's schedule
    sortedDays.forEach(hari => {
      // Add day header
      tableBody.push([{ content: hari, colSpan: 4, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]);
      
      // Add schedules for the day
      data[hari].sort((a, b) => 
        a.jam_mulai.localeCompare(b.jam_mulai)
      ).forEach(jadwal => {
        tableBody.push([
          `${jadwal.jam_mulai.slice(0, 5)} - ${jadwal.jam_selesai.slice(0, 5)}`,
          jadwal.nama_mapel,
          jadwal.nama_guru,
        ]);
      });
    });

    // Generate table
    autoTable(doc, {
      startY: 35,
      head: [["Jam", "Mata Pelajaran", "Guru"]],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 70 },
        2: { cellWidth: 80 },
      },
    });

    doc.save(`jadwal_pelajaran_${kelas}_${new Date().getTime()}.pdf`);
  };

  return (
    <Button size="sm" variant="noShadow" onClick={handleExport}>
      Export Jadwal PDF
    </Button>
  );
}