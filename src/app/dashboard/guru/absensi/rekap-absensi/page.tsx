import { getRekapAbsensi } from "@/app/libs/features/queryAbsensi";
import ExportToPDF from "@/components/ui/export-pdf";

type Props = {
  searchParams: {
    kelas_id?: string;
    bulan?: string;
    tahun?: string;
  };
};

const Page = async ({ searchParams }: Props) => {
  const { kelas_id, bulan, tahun } = await searchParams;

  if (!kelas_id || !bulan || !tahun) {
    return <div>Parameter tidak lengkap.</div>;
  }

  const data = await getRekapAbsensi(
    Number(bulan),
    Number(tahun),
    Number(kelas_id)
  );

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Rekap Absensi - {bulan}/{tahun}
      </h2>
      <ExportToPDF data={data} />
      {data.length === 0 ? (
        <p>Tidak ada data absensi pada bulan ini.</p>
      ) : (
        <table className="w-full border text-left text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Hadir</th>
              <th className="p-2 border">Izin</th>
              <th className="p-2 border">Sakit</th>
              <th className="p-2 border">Alfa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((siswa, idx) => (
              <tr key={siswa.siswa_id} className="border-t">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border">{siswa.nama_siswa}</td>
                <td className="p-2 border">{siswa.hadir}</td>
                <td className="p-2 border">{siswa.izin}</td>
                <td className="p-2 border">{siswa.sakit}</td>
                <td className="p-2 border">{siswa.alfa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Page;
