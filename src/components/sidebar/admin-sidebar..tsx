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
      url: "/dashboard/admin/mata-pelajaran",
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
      url: "/dashboard/absensi",
      icon: BookCheck,
    },
  
  ];

  return <SidebarNav items={items} />;
}
