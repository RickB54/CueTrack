import { Link, useLocation } from "wouter";
import { Home, Target, Library, Trophy, BarChart2, Book, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/drills", icon: Target, label: "Drills" },
  { href: "/playlists", icon: Library, label: "Playlists" },
  { href: "/achievements", icon: Trophy, label: "Achievements" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/journal", icon: Book, label: "Journal" },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 sm:hidden">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href}>
          <a
            className={cn(
              "flex flex-col items-center justify-center space-y-1",
              location === href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
