"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

// ARCHITECT-ONLY controls for a legal document (step 305): Download config (the JSON for all ten languages,
// ready to hand to an AI) + Upload config (the filled-in translations). Self-hides for everyone else — it
// fetches /api/me on mount and renders nothing unless the caller has the architect role (same client-gate
// convention as the account/menu components). The page's title/description/body already render server-side;
// these controls only manage the config behind them.
export function LegalAdmin({
  doc,
  ui,
}: {
  doc: string;
  ui: { download: string; upload: string; uploaded: string; uploadFailed: string; markupHelp: string };
}) {
  const [isArchitect, setIsArchitect] = useState(false);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setIsArchitect(Boolean(s?.roles?.includes("architect"))))
      .catch(() => {});
  }, []);

  if (!isArchitect) return null;

  async function download() {
    try {
      const res = await fetch(`/api/legal/${doc}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(ui.uploadFailed);
    }
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      const res = await fetch(`/api/legal/${doc}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(json),
      });
      if (!res.ok) throw new Error();
      toast.success(ui.uploaded);
      router.refresh();
    } catch {
      toast.error(ui.uploadFailed);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-3 rounded-xl border border-dashed bg-muted/20 p-4">
      <p className="text-xs text-muted-foreground">{ui.markupHelp}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={download}>
          <Download />
          {ui.download}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload />
          {ui.upload}
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}
