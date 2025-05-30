import { Calendar, Home, BookCheck } from "lucide-react";
import { TeacherIcon, KelasIcon, SiswaIcon } from "../icon";
import { SidebarNav } from "./SidebarNav";
export function AdminSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Siswa",
      url: "/dashboard/admin/siswa",
      icon: SiswaIcon,
    },
    {
      title: "Guru",
      url: "/dashboard/admin/guru",
      icon: TeacherIcon,
    },
    {
      title: "Kelas",
      url: "/dashboard/admin/kelas",
      icon: KelasIcon,
    },
    {
      title: "Mata Pelajaran",
      url: "/dashboard/admin/matapelajaran",
      icon: Calendar,
    },
    {
      title: "Jadwal",
      url: "/dashboard/admin/jadwal",
      icon: Calendar,
    },
    {
      title: "Tahun Ajaran",
      url: "/dashboard/admin/tahunajaran",
      icon: Calendar,
    },
    {
      title: "Absensi",
      url: "/dashboard/admin/absensi",
      icon: BookCheck,
    },
    {
      title: "Profile",
      url: "/dashboard/admin/profile",
      icon: Calendar,
    },
  ];

  return <SidebarNav items={items} />;
}
