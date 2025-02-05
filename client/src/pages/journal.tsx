import { Shell } from "@/components/layout/shell";
import { useQuery } from "@tanstack/react-query";
import { type JournalEntry } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JournalForm } from "@/components/journal/journal-form";

export default function Journal() {
  const { data: entries, isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
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
              Practice Journal
            </h1>
            <p className="text-muted-foreground">
              Record your thoughts and progress
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
              </DialogHeader>
              <JournalForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {entries?.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </CardTitle>
                <CardDescription>
                  {format(new Date(entry.date), "h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
          {entries?.length === 0 && (
            <div className="text-center text-muted-foreground">
              No journal entries yet. Click "New Entry" to get started.
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
