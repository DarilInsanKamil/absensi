import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMK Techno Media",
  description: "Website absensi siswa sekolah techno media",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="ml-5 mt-2 sticky top-5 z-1">
          <SidebarTrigger variant="noShadow" className="bg-white" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
