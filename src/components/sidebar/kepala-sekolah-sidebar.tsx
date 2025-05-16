import { Calendar, Home, BookCheck } from "lucide-react";
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
      title: "Profile",
      url: "/dashboard/kepala-sekolah/profile",
      icon: Calendar,
    }
  ];

  return <SidebarNav items={items} />;
}
