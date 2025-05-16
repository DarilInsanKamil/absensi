import { cookies } from "next/headers";
import { AdminSidebar } from "./admin-sidebar.";
import { GuruSidebar } from "./guru-sidebar";
import { SiswaSidebar } from "./siswa-sidebar";
import { KepalaSekolahSidebar } from "./kepala-sekolah-sidebar";
import { BkSidebar } from "./bk-sidebar";

export async function AppSidebar() {
  const cookieStore = await cookies();
  const role = (await cookieStore).get("role")?.value || "";

  switch (role) {
    case "admin":
      return <AdminSidebar />;
    case "guru":
      return <GuruSidebar />;
    case "siswa":
      return <SiswaSidebar />;
    case "kepsek":
      return <KepalaSekolahSidebar />;
    case "bk":
      return <BkSidebar />;
    default:
      return null;
  }
}
