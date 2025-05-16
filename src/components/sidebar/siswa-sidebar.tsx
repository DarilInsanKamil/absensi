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
      url: "/dashboard/siswa/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Mata Pelajaran",
      url: "/dashboard/siswa/jadwal",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/dashboard/siswa/profile",
      icon: Calendar,
    }
  ];

  return <SidebarNav items={items} />;
}
