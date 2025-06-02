import { Calendar, Home, BookCheck } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
export function SiswaSidebar() {
  const items = [
    {
      title: "Home",
      url: "/absensiteknomedia/dashboard/siswa",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/absensiteknomedia/dashboard/siswa/absensi",
      icon: BookCheck,
    },
    {
      title: "Jadwal Mata Pelajaran",
      url: "/absensiteknomedia/dashboard/siswa/jadwal",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/absensiteknomedia/dashboard/siswa/profile",
      icon: Calendar,
    }
  ];

  return <SidebarNav items={items} />;
}
