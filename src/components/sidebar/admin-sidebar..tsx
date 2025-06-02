import { Calendar, Home, BookCheck, User, Users } from "lucide-react";
import { TeacherIcon, KelasIcon, SiswaIcon } from "../icon";
import { SidebarNav } from "./SidebarNav";
export function AdminSidebar() {
  const items = [
    {
      title: "Home",
      url: "/absensiteknomedia/dashboard/admin",
      icon: Home,
    },
    {
      title: "Siswa",
      url: "/absensiteknomedia/dashboard/admin/siswa",
      icon: SiswaIcon,
    },
    {
      title: "Guru",
      url: "/absensiteknomedia/dashboard/admin/guru",
      icon: TeacherIcon,
    },
    {
      title: "Kelas",
      url: "/absensiteknomedia/dashboard/admin/kelas",
      icon: KelasIcon,
    },
    {
      title: "Mata Pelajaran",
      url: "/absensiteknomedia/dashboard/admin/matapelajaran",
      icon: Calendar,
    },
    {
      title: "Jadwal",
      url: "/absensiteknomedia/dashboard/admin/jadwal",
      icon: Calendar,
    },
    {
      title: "Tahun Ajaran",
      url: "/absensiteknomedia/dashboard/admin/tahunajaran",
      icon: Calendar,
    },
    {
      title: "Absensi",
      url: "/absensiteknomedia/dashboard/admin/absensi",
      icon: BookCheck,
    },
    {
      title: "Users",
      url: "/absensiteknomedia/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Profile",
      url: "/absensiteknomedia/dashboard/admin/profile",
      icon: User,
    },
  ];

  return <SidebarNav items={items} />;
}
