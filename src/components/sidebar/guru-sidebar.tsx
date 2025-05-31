import { Calendar, Home, BookCheck, Users } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { isWaliKelas } from "@/app/libs/features/queryWaliKelas";

export async function GuruSidebar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) return null;

  const decoded = jwt.verify(
    token.value,
    process.env.SESSION_SECRET || ""
  ) as any;
  const guruId = decoded.reference_id;

  const waliKelasStatus = await isWaliKelas(guruId);

  const items = [
    {
      title: "Home",
      url: "/dashboard/guru",
      icon: Home,
    },
    {
      title: "Daftar Absensi",
      url: "/dashboard/guru/absensi",
      icon: BookCheck,
    },
    {
      title: "Isi Absensi",
      url: "/dashboard/guru/jadwal",
      icon: Calendar,
    },
    {
      title: "Jadwal",
      url: "/dashboard/guru/jadwal-mengajar",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/dashboard/guru/profile",
      icon: Calendar,
    },
  ];
  
  if (waliKelasStatus.isWaliKelas) {
    items.push({
      title: `Wali Kelas ${waliKelasStatus.kelasData.nama_kelas}`,
      url: `/dashboard/guru/walikelas/${waliKelasStatus.kelasData.id}`,
      icon: Users,
    });
  }

  return <SidebarNav items={items} />;
}
