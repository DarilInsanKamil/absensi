import { Calendar, Home, BookCheck, User2 } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function KepalaSekolahSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard/kepala-sekolah",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/dashboard/kepala-sekolah/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Guru",
      url: "/dashboard/kepala-sekolah/jadwal-guru",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/dashboard/kepala-sekolah/profile",
      icon: User2,
    }
  ];

  return <SidebarNav items={items} />;
}
