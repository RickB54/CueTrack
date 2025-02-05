import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJournalEntrySchema, type InsertJournalEntry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function JournalForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertJournalEntry>({
    resolver: zodResolver(insertJournalEntrySchema),
    defaultValues: {
      content: "",
      date: new Date().toISOString(),
      userId: 1, // TODO: Replace with actual user ID when auth is implemented
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (values: InsertJournalEntry) => {
      const response = await apiRequest("/api/journal", {
        method: "POST",
        body: values,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create journal entry");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Success",
        description: "Your journal entry has been saved.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create journal entry. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: InsertJournalEntry) {
    setIsSubmitting(true);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thoughts & Reflections</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about today's practice session..."
                  className="min-h-[150px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </form>
    </Form>
  );
}