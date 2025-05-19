import { getAbsensiAdmin } from "@/app/libs/features/queryAbsensi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getAbsensiAdmin();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}