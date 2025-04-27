import { formatStatus } from "@/lib/utils";

export function TableGuru({ children }: { children: any }) {
  return (
    <table className="min-w-full bg-white rounded-lg overflow-auto">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="px-4 py-2 text-left">No</th>
          <th className="px-4 py-2 text-left">Nama</th>
          <th className="px-4 py-2 text-left">NIP</th>
          <th className="px-4 py-2 text-left">Jenis Kelamin</th>
          <th className="px-4 py-2 text-left">Alamat</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {children.map((res: any, index: number) => (
          <tr
            key={index}
            className="border-b border-gray-300 hover:bg-gray-500"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{res.nama}</td>
            <td className="px-4 py-2">{res.nip}</td>
            <td className="px-4 py-2">{res.jenis_kelamin}</td>
            <td className="px-4 py-2">{res.alamat}</td>
            <td className="px-4 py-2">{res.email}</td>
            <td className="px-4 py-2">{formatStatus(res.status_aktif)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
