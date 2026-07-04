"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RunNowButton() {
  const [loading, setLoading] = useState(false);

  async function handleRunNow() {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/projects/automation/notes-reminder/reminders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Successfully collected ${data.data.notes_collected} notes`
        );
        // Refresh the page to show new results
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to collect notes");
      }
    } catch (error) {
      toast.error("Error running collection");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleRunNow}
      disabled={loading}
      variant="default"
    >
      {loading ? "Running..." : "Run now"}
    </Button>
  );
}
