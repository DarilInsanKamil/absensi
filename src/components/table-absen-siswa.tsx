import { formatStatus } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

export function TableAbsenSiswa({ children }: { children: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">No</th>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">NIS</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Absen</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-50"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{child.nama}</td>
              <td className="px-4 py-2">{child.nis}</td>
              <td className="px-4 py-2">{formatStatus(child.status_aktif)}</td>
              <td className="px-4 py-2">
                <Button variant="outline">H</Button>
                <Button variant="default">I</Button>
                <Button variant="destructive">A</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
