import { Link, useLocation } from "wouter";
import { Home, Target, Library, Trophy, BarChart2, Book, Users, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/drills", icon: Target, label: "Drills" },
  { href: "/playlists", icon: Library, label: "Playlists" },
  { href: "/achievements", icon: Trophy, label: "Achievements" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/journal", icon: Book, label: "Journal" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/help", icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden h-screen w-64 border-r bg-sidebar sm:block">
      <ScrollArea className="h-full py-6">
        <div className="px-4 py-2">
          <h2 className="mb-6 text-lg font-semibold tracking-tight text-sidebar-foreground">
            CueTrack
          </h2>
          <nav className="space-y-2">
            {sidebarItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <a
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location === href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
