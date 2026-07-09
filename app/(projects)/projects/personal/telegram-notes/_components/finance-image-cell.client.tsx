"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Receipt preview cell (step 207.9): the finance table's image column. A click opens a modal with the
// full receipt image (media URL). Server-rendered table + this small client island — the rest of the
// section stays JS-free. Degrades to the raw link (works with JavaScript off) inside the dialog trigger.
// Resolve a stored media URL against the page's OWN origin (step 207.10 P6): a URL baked with an absolute
// host (esp. http://localhost:3000 at record time) would break for a remote viewer, so strip the host and
// keep the path — the browser then fetches it from the real domain serving this page. Relative paths pass through.
function sameOriginUrl(u: string): string {
  if (/^https?:\/\//i.test(u)) {
    try {
      const parsed = new URL(u);
      return parsed.pathname + parsed.search;
    } catch {
      return u;
    }
  }
  return u;
}

export function FinanceImageCell({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const src = sameOriginUrl(url);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-primary hover:underline">
        Preview
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Receipt" className="mx-auto max-h-[70vh] w-auto rounded" />
          <a href={src} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline">
            Open original in a new tab
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}
