"use client";

interface AbsensiData {
  id: string;
  tanggal: string;
  nama_siswa: string;
  nis: string;
  nama_kelas: string;
  nama_mapel: string;
  nama_guru: string;
  status: string;
  keterangan?: string;
}

export function AdminAbsensiTable({ data }: { data: AbsensiData[] }) {
  return (
    <div className="rounded-md border">
      <table className="min-w-full bg-white rounded-lg overflow-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-left">Nama Siswa</th>
            <th className="px-4 py-2 text-left">NIS</th>
            <th className="px-4 py-2 text-left">Kelas</th>
            <th className="px-4 py-2 text-left">Mata Pelajaran</th>
            <th className="px-4 py-2 text-left">Guru</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-300 hover:bg-gray-100 relative bg-white"
            >
              <td className="px-4 py-2">
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </td>
              <td className="px-4 py-2">{item.nama_siswa}</td>
              <td className="px-4 py-2">{item.nis}</td>
              <td className="px-4 py-2">{item.nama_kelas}</td>
              <td className="px-4 py-2">{item.nama_mapel}</td>
              <td className="px-4 py-2">{item.nama_guru}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "hadir"
                      ? "bg-green-100 text-green-800"
                      : item.status === "sakit"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === "izin"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2">{item.keterangan || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
