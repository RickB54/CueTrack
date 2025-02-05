import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface ShotTrackerProps {
  onUpdate?: (successful: number, missed: number) => void;
}

export function ShotTracker({ onUpdate }: ShotTrackerProps) {
  const [successful, setSuccessful] = useState(0);
  const [missed, setMissed] = useState(0);

  const total = successful + missed;
  const successRate = total === 0 ? 0 : (successful / total) * 100;

  const trackShot = (isSuccessful: boolean) => {
    if (isSuccessful) {
      setSuccessful((prev) => prev + 1);
    } else {
      setMissed((prev) => prev + 1);
    }
    onUpdate?.(successful + (isSuccessful ? 1 : 0), missed + (isSuccessful ? 0 : 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Shot Success Rate</span>
        <span className="text-sm text-muted-foreground">
          {successRate.toFixed(1)}%
        </span>
      </div>
      <Progress value={successRate} className="h-2" />
      
      <div className="flex justify-between gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold">{successful}</div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold">{missed}</div>
          <div className="text-sm text-muted-foreground">Missed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold">{total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => trackShot(true)}
        >
          <Check className="mr-2 h-4 w-4" />
          Success
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => trackShot(false)}
        >
          <X className="mr-2 h-4 w-4" />
          Miss
        </Button>
      </div>
    </div>
  );
}
