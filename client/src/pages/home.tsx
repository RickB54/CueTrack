import { Shell } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Library, Trophy, BarChart2, Book } from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: Target,
    title: "Practice Drills",
    description: "Structured drills for all skill levels",
    href: "/drills",
  },
  {
    icon: Library,
    title: "Playlists",
    description: "Create custom practice routines",
    href: "/playlists",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Track your progress and earn badges",
    href: "/achievements",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Visualize your improvement",
    href: "/analytics",
  },
  {
    icon: Book,
    title: "Practice Journal",
    description: "Record your thoughts and insights",
    href: "/journal",
  },
];

export default function Home() {
  return (
    <Shell>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Welcome to CueTrack
          </h1>
          <p className="mt-4 text-muted-foreground">
            Your personal pool practice companion
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link key={href} href={href}>
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1427097829427-56a905bf7004"
            alt="Pool table"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </Shell>
  );
}
