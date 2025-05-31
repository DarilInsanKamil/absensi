export const dynamic = "force-dynamic";

import { getAbsensiByDateTime } from "@/app/libs/features/queryAbsensi";
import { notFound } from "next/navigation";
import { EditAbsensiForm } from "@/components/dialogui/absensi-editform";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DayExportToPDF from "@/components/ui/export-day-pdf";
import { calculateAttendanceSummary } from "@/app/libs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface PageProps {
  params: Promise<{
    id: string;
    edit_id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  try {
    const { id: kelasId, edit_id } = await params;

    // Get guru_id from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return notFound();
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
    const guruId = decoded.reference_id;

    // Validate edit_id format
    if (!edit_id || typeof edit_id !== "string") {
      console.error("Invalid edit_id format:", edit_id);
      return notFound();
    }

    const parts = edit_id.split("-");

    // Validate parts length and time format
    if (parts.length !== 5) {
      // Change to 5 parts for YYYY-MM-DD-HH-MM
      console.error(
        "Invalid URL format. Expected: YYYY-MM-DD-HH-MM, Got:",
        edit_id
      );
      return notFound();
    }

    const date = parts.slice(0, 3).join("-");
    const hour = parts[3];
    const minute = parts[4];
    const formattedTime = `${hour}:${minute}`;

    let absensiData;
    try {
      absensiData = await getAbsensiByDateTime(
        parseInt(kelasId),
        parseInt(guruId),
        date,
        formattedTime
      );
    } catch (queryError) {
      console.error("Database query failed:", queryError);
      return notFound();
    }

    if (!absensiData?.length) {
      console.error("No attendance data found:", {
        kelasId,
        date,
        formattedTime,
        params: { kelasId, edit_id },
      });
      return notFound();
    }

    const summary = calculateAttendanceSummary(absensiData);

    // ...rest of your component code...

    return (
      <div className="p-5 overflow-x-auto">
        <Card className="mt-5 mb-10">
          <CardHeader>
            <h1 className="text-2xl font-bold">Edit Absensi</h1>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Tanggal: {new Date(date).toLocaleDateString("id-ID")}
            </p>
            <p className="text-gray-600">Waktu: {formattedTime}</p>
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
        <EditAbsensiForm initialData={absensiData} kelasId={kelasId} />
      </div>
    );
  } catch (error) {
    console.error("Error in edit page:", error);
    return notFound();
  }
}
