import { Calendar, Home, BookCheck, Search, School, UsersRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Siswa",
    url: "/dashboard/siswa",
    icon: UsersRound,
  },
  {
    title: "Kelas",
    url: "/dashboard/kelas",
    icon: School,
  },
  {
    title: "Absensi",
    url: "/dashboard/absensi",
    icon: BookCheck,
  },
  {
    title: "Jadwal Guru",
    url: "/dashboard/jadwalguru",
    icon: Calendar,
  },
  {
    title: "Jadwal Mata Pelajaran",
    url: "/dashboard/jadwal",
    icon: Calendar,
  },
];
export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
