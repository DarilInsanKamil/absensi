import { Calendar, Home, BookCheck } from "lucide-react";
import { TeacherIcon, KelasIcon, SiswaIcon } from "../icon";
import { SidebarNav } from "./SidebarNav";
export function AdminSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Siswa",
      url: "/dashboard/admin/siswa",
      icon: SiswaIcon,
    },
    {
      title: "Kelas",
      url: "/dashboard/admin/kelas",
      icon: KelasIcon,
    },
    {
      title: "Absensi",
      url: "/dashboard/absensi",
      icon: BookCheck,
    },
    {
      title: "Guru",
      url: "/dashboard/admin/guru",
      icon: TeacherIcon,
    },
    {
      title: "Jadwal Mata Pelajaran",
      url: "/dashboard/jadwal",
      icon: Calendar,
    },
  ];

  return <SidebarNav items={items} />;
}
