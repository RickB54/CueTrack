import { Shell } from "@/components/layout/shell";
import { useQuery } from "@tanstack/react-query";
import { type Playlist } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

export default function Playlists() {
  const { data: playlists, isLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">
              Practice Playlists
            </h1>
            <p className="text-muted-foreground">
              Create and manage your practice routines
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Playlist
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists?.map((playlist) => (
            <Card key={playlist.id}>
              <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
                <CardDescription>
                  {playlist.drills.length} drills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
