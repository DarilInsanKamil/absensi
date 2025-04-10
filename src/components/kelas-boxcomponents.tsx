import Link from "next/link";

export function KelasBoxComponent({
  id,
  kelas,
}: {
  id: number;
  kelas: string;
}) {
  return (
    <Link
      className="flex flex-col items-center justify-center w-full h-20 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out p-4 mb-4"
      href={`/dashboard/kelas/${id}`}
    >
      {kelas}
    </Link>
  );
}
