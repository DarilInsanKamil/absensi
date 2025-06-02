import { Calendar, Home, BookCheck, User2 } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function KepalaSekolahSidebar() {
  const items = [
    {
      title: "Home",
      url: "/absensiteknomedia/dashboard/kepala-sekolah",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/absensiteknomedia/dashboard/kepala-sekolah/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Guru",
      url: "/absensiteknomedia/dashboard/kepala-sekolah/jadwal-guru",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/absensiteknomedia/dashboard/kepala-sekolah/profile",
      icon: User2,
    }
  ];

  return <SidebarNav items={items} />;
}
