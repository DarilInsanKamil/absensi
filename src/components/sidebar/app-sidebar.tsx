import { AdminSidebar } from "./admin-sidebar.";
import { GuruSidebar } from "./guru-sidebar";
import { SiswaSidebar } from "./siswa-sidebar";

export function AppSidebar() {
  switch ("admin") {
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
