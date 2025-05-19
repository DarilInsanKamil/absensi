import { Calendar, Home, BookCheck } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function GuruSidebar() {
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

  return <SidebarNav items={items} />;
}
