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
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Nama Siswa</th>
            <th>NIS</th>
            <th>Kelas</th>
            <th>Mata Pelajaran</th>
            <th>Guru</th>
            <th>Status</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
              <td>{item.nama_siswa}</td>
              <td>{item.nis}</td>
              <td>{item.nama_kelas}</td>
              <td>{item.nama_mapel}</td>
              <td>{item.nama_guru}</td>
              <td>
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
              <td>{item.keterangan || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
