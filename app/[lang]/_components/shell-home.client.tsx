"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Zap, LayoutDashboard, Sparkles } from "lucide-react";
import { adminBase } from "@/lib/runtime-urls";
import { iconUrl, resolveBrandName, DEFAULT_APP_CONFIG, type AppConfig } from "@/config/app-config.defaults";
import { getHomeStrings } from "@/lib/i18n/home-strings";

// Что предлагает платформа под этим приложением. Ревизия 2026-08-09 убрала отсюда
// «Claude Code · Codex · Gemini · Qwen Code · Kimi Code · LightRag · Hermes»: эти
// подсистемы снесены шагом 500, и главная страница свежего сервера рекламировала
// то, чего в продукте нет. Осталось ровно то, что действительно работает.
const PLATFORM_SERVICES = [
  { name: "Auth",           color: "bg-rose-500/10   text-rose-400   border-rose-500/25"   },
  { name: "Database",       color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25" },
  { name: "Object Storage", color: "bg-teal-500/10   text-teal-400   border-teal-500/25"   },
  { name: "Knowledge Graph",color: "bg-amber-500/10  text-amber-400  border-amber-500/25"  },
  { name: "Map & Routing",  color: "bg-green-500/10  text-green-400  border-green-500/25"  },
  { name: "Channels",       color: "bg-cyan-500/10   text-cyan-400   border-cyan-500/25"   },
];

export function ShellHome({ config, lang = "en" }: { config: AppConfig; lang?: string }) {
  const [appUrl, setAppUrl] = useState("");
  const [adminUrl, setAdminUrl] = useState("");
  useEffect(() => {
    setAppUrl(window.location.origin);
    setAdminUrl(adminBase());
  }, []);

  const t = getHomeStrings(lang);

  // The brand mark. Owner's logo wins, then their generated icon set, and failing both the
  // neutral placeholder that ships with the project (`npm run icons:default`, step 504).
  //
  // 🔒 THE FALLBACK IS THE POINT (owner, 2026-08-13). Before it, a fresh server showed NO image at
  // all: both slots live in `APP-CONFIG` outside the repository, and a project nobody has branded
  // yet has neither. That reads as a broken build — the owner reported exactly that — and it also
  // leaves nothing to verify image work against. The same placeholder is already in the manifest,
  // so the home page and the installed app now show one mark instead of disagreeing.
  //
  // Deliberately NOT the Fractera logo: this template leaves for the customer's own repository, and
  // somebody else's brand shipped inside it is a defect found by hand later.
  const iconSrc = config.logo ?? iconUrl(config, "icon_192") ?? "/icons/icon-192.png";

  // Wordmark: the owner's custom brand name, or the "Your Company App" placeholder when they
  // have not set one yet (the shipped default counts as unset).
  const brandName = resolveBrandName(config) ?? "Your Company App";

  // Description: the owner's custom copy if they changed it, else the default onboarding text.
  const customDesc =
    config.description && config.description !== DEFAULT_APP_CONFIG.description
      ? config.description
      : null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">

      {/* Language switcher moved to the footer (step 160) — it lives only there now. */}

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[140px]" />
        <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-violet-500/6 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[160px]" />
      </div>

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground) / 0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Vignette to fade grid at edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_40%,hsl(var(--background))_100%)]" />

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-9 text-center px-6 pt-[100px] pb-[100px] max-w-2xl w-full"
      >
        {/* Badge */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] text-primary/80 uppercase border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5 backdrop-blur-sm">
            <Sparkles size={10} />
            {t.badge}
          </span>
        </motion.div>

        {/* Brand mark — always present now: owner's logo, their icon set, or the shipped
            placeholder. The `{iconSrc && …}` guard that stood here became permanently true with the
            fallback, and a condition that cannot be false reads as if the image were still optional. */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="-mb-3"
        >
          {/* Explicit width/height reserve the box before the file arrives: without them the
              heading below jumps down as the mark loads, and that jump is measured — it is the
              layout-shift part of Core Web Vitals. `eager` on purpose: this mark sits at the top
              of the page, so deferring it would only delay what the visitor came to see. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconSrc}
            alt={`${config.short_name} icon`}
            width={80}
            height={80}
            loading="eager"
            className="size-20 rounded-full object-contain ring-1 ring-foreground/10 shadow-xl shadow-primary/10 bg-background/40 backdrop-blur-sm p-1.5"
          />
        </motion.div>

        {/* Wordmark + tagline */}
        <motion.div
          id="hero"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 scroll-mt-20"
        >
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight select-none leading-[1.05] break-words bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
            {brandName}
          </h1>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            {customDesc ? (
              customDesc
            ) : (
              <>
                {t.liveLead}
                {appUrl && (
                  <> {t.atWord} <span className="text-foreground font-mono font-medium">{appUrl}</span></>
                )}
                {" "}{t.replaceDomain}{" "}
                {t.openAdminPre} <span className="text-foreground font-medium">{t.adminPanel}</span> {t.openAdminPost}
              </>
            )}
          </p>
        </motion.div>

        {/* Здесь стоял список настроек сайта — он повторял форму панели управления
            вторым описанием тех же полей. Настройки принадлежат панели; удалено
            ревизией 2026-08-09 вместе с `config/site-fields.ts`. */}

        {/* Службы платформы */}
        <motion.div
          id="platforms"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 scroll-mt-20"
        >
          {PLATFORM_SERVICES.map((tool, i) => (
            <motion.span
              key={tool.name}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 + i * 0.07, duration: 0.35, ease: "easeOut" }}
              className={`text-[11px] font-mono px-3 py-1 rounded-full border backdrop-blur-sm ${tool.color}`}
            >
              {tool.name}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          id="start"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 scroll-mt-20"
        >
          <a
            href={adminUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            <Zap size={14} />
            {t.startCoding}
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <LayoutDashboard size={14} />
            {t.dashboard}
          </a>
        </motion.div>

        {/* Footer micro-text */}
        <motion.p
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[11px] font-mono text-muted-foreground/40 tracking-widest uppercase"
        >
          {t.footer}
        </motion.p>
      </motion.div>
    </main>
  );
}
