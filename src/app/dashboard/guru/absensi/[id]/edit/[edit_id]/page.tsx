import { getAbsensiByDate } from "@/app/libs/features/queryAbsensi";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { EditAbsensiForm } from "@/components/dialogui/absensi-editform";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DayExportToPDF from "@/components/ui/export-day-pdf";
import { calculateAttendanceSummary } from "@/app/libs";

export default async function Page({
  params,
}: {
  params: { id: string; edit_id: string };
}) {
  const { id, edit_id } = await params;

  const absensiData = await getAbsensiByDate(parseInt(id), edit_id);

  if (!absensiData.length) return notFound();
  const summary = calculateAttendanceSummary(absensiData);
  return (
    <div className="p-5 overflow-x-auto">
      <Card className="mt-5 mb-10">
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Absensi</h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Tanggal: {new Date(edit_id).toLocaleDateString("id-ID")}
          </p>
          <p className="text-gray-600">
            Kelas: {absensiData[0].nama_kelas} - {absensiData[0].nama_mapel}
          </p>
        </CardContent>
        <CardFooter>
          <DayExportToPDF
            data={absensiData}
            kelas={absensiData[0].nama_kelas}
            mapel={absensiData[0].nama_mapel}
            startDate={edit_id}
            summary={summary}
            endDate="-"
          />
        </CardFooter>
      </Card>
      <EditAbsensiForm initialData={absensiData} jadwalId={id} />
    </div>
  );
}
