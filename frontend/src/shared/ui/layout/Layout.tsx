import { SidebarProvider, SidebarTrigger } from "@/shared/ui/shadcn/sidebar";
import AppSidebar from "@/entities/task/ui/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="rounded-xl w-full">
        <header className="w-full px-4 py-3 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between mx-auto">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Users dashboard</h1>
            </div>
          </div>
        </header>

        <div className="w-full rounded-xl  mx-auto py-6 px-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
