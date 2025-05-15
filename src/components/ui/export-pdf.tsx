"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportToPDF({ data }: { data: any[] }) {
  const handleExport = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["No", "Nama", "Hadir", "Izin", "Sakit", "Alfa"]],
      body: data.map((row, idx) => [
        idx + 1,
        row.nama_siswa,
        row.hadir,
        row.izin,
        row.sakit,
        row.alfa,
      ]),
    });

    doc.save("rekap_absensi.pdf");
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Export to PDF
    </button>
  );
}
