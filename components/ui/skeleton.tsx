import { cn } from "@/lib/utils"

// shadcn Skeleton — a placeholder block with a CSS-only pulse (animate-pulse is a
// Tailwind keyframe, so it shimmers WITHOUT JavaScript). Use it to reserve the
// shape of content that loads client-side, so the no-JS / pre-hydration view
// shows the real layout instead of a blank "Loading…" (STATIC-FIRST.md).
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
