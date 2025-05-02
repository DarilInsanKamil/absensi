import { cookies } from "next/headers";
import { AdminSidebar } from "./admin-sidebar.";
import { GuruSidebar } from "./guru-sidebar";
import { SiswaSidebar } from "./siswa-sidebar";

export async function AppSidebar() {
  const cookieStore = cookies();
  const role = (await cookieStore).get('role')?.value || '';
  
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
