import { Calendar, Home, BookCheck } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
export function SiswaSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard/siswa",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/dashboard/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Mata Pelajaran",
      url: "/dashboard/jadwal",
      icon: Calendar,
    },
  ];

  return <SidebarNav items={items} />;
}
