import { Shell } from "@/components/layout/shell";
import { useQuery } from "@tanstack/react-query";
import { type Achievement } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ACHIEVEMENT_BADGES } from "@/lib/constants";
import { format } from "date-fns";

export default function Achievements() {
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and earn badges
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements?.map((achievement, index) => (
            <Card key={achievement.id}>
              <CardHeader>
                <div className="mx-auto w-24">
                  <img
                    src={ACHIEVEMENT_BADGES[index % ACHIEVEMENT_BADGES.length]}
                    alt={achievement.type}
                    className="rounded-full"
                  />
                </div>
                <CardTitle className="text-center">{achievement.type}</CardTitle>
                <CardDescription className="text-center">
                  Earned on{" "}
                  {format(new Date(achievement.earnedDate), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
