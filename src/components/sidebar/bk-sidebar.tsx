import { Calendar, Home, BookCheck } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export function BkSidebar() {
  const items = [
    {
      title: "Home",
      url: "/absensiteknomedia/dashboard/bk",
      icon: Home,
    },
    {
      title: "Absensi",
      url: "/absensiteknomedia/dashboard/bk/absensi",
      icon: BookCheck,
    },
    {
      title: "Profile",
      url: "/absensiteknomedia/dashboard/bk/profile",
      icon: Calendar,
    }
  ];

  return <SidebarNav items={items} />;
}
