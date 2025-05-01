import { AdminSidebar } from "./admin-sidebar.";
import { GuruSidebar } from "./guru-sidebar";
import { SiswaSidebar } from "./siswa-sidebar";

export function AppSidebar() {
  let role = "admin";
  
  switch (role) {
    case "admin":
      return <AdminSidebar />;
    case "guru":
      return <GuruSidebar />;
    case "siswa":
      return <SiswaSidebar />;
    default:
      return null;
  }
}
