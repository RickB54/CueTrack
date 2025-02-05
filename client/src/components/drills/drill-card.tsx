import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Drill } from "@shared/schema";
import { Link } from "wouter";

interface DrillCardProps {
  drill: Drill;
}

export function DrillCard({ drill }: DrillCardProps) {
  return (
    <Link href={`/drill/${drill.id}`}>
      <Card className="h-full cursor-pointer transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{drill.name}</span>
            <Badge>{drill.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <img
              src={drill.imageUrl}
              alt={drill.name}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
            {drill.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
