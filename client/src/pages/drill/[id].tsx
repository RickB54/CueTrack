import { Shell } from "@/components/layout/shell";
import { DrillTimer } from "@/components/drills/drill-timer";
import { ShotTracker } from "@/components/drills/shot-tracker";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Drill } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DrillDetail() {
  const [, params] = useRoute("/drill/:id");
  const drillId = params?.id;

  const { data: drill, isLoading } = useQuery<Drill>({
    queryKey: [`/api/drills/${drillId}`],
  });

  if (isLoading || !drill) {
    return (
      <Shell>
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tighter">{drill.name}</h1>
            <Badge>{drill.level}</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{drill.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Table Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={drill.imageUrl}
                  alt={drill.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{drill.instructions}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Timer</CardTitle>
              </CardHeader>
              <CardContent>
                <DrillTimer />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shot Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ShotTracker />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
