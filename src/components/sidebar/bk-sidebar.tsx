import { Calendar, Home, BookCheck } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function BkSidebar() {
  const items = [
    {
      title: "Home",
      url: "/dashboard/bk",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/dashboard/bk/absensi",
      icon: BookCheck,
    },
    {
      title: "Profile",
      url: "/dashboard/bk/profile",
      icon: Calendar,
    }
  ];

  return <SidebarNav items={items} />;
}
