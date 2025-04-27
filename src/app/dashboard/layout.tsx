import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="ml-5 mt-2 sticky top-5 z-1">
          <SidebarTrigger variant="neutral"/>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
