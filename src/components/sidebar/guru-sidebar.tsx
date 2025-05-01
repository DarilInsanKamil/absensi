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
      title: "Absensi",
      url: "/dashboard/guru/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Mata Pelajaran",
      url: "/dashboard/guru/jadwal",
      icon: Calendar,
    },
  ];

  return <SidebarNav items={items} />;
}
