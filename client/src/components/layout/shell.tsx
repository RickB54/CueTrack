import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-16 sm:pb-0">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
