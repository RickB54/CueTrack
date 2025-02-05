import { Shell } from "@/components/layout/shell";
import { DrillCard } from "@/components/drills/drill-card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DRILL_LEVELS } from "@/lib/constants";
import { type Drill } from "@shared/schema";

export default function Drills() {
  const { data: drills, isLoading } = useQuery<Drill[]>({
    queryKey: ["/api/drills"],
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="space-y-4">
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
          <h1 className="text-3xl font-bold tracking-tighter">Practice Drills</h1>
          <p className="text-muted-foreground">
            Select a drill to start practicing
          </p>
        </div>

        <Tabs defaultValue="Beginner">
          <TabsList>
            {DRILL_LEVELS.map((level) => (
              <TabsTrigger key={level} value={level}>
                {level}
              </TabsTrigger>
            ))}
          </TabsList>
          {DRILL_LEVELS.map((level) => (
            <TabsContent key={level} value={level}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drills
                  ?.filter((drill) => drill.level === level)
                  .map((drill) => (
                    <DrillCard key={drill.id} drill={drill} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Shell>
  );
}
