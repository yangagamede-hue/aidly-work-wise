import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Mail,
  NotebookPen,
  CalendarClock,
  Search,
  MessagesSquare,
  LayoutDashboard,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview Dashboard", short: "Overview", icon: LayoutDashboard },
  { to: "/", label: "Smart Email Generator", short: "Email", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Summarizer", short: "Notes", icon: NotebookPen },
  { to: "/task-planner", label: "AI Task Planner", short: "Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", short: "Research", icon: Search },
  { to: "/chat", label: "AI Chatbot", short: "Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-foreground">
      <div className="pointer-events-none fixed inset-0">
        <div className="blob-a absolute -left-24 -top-24 size-[420px] rounded-full bg-brand/30 blur-[120px]" />
        <div className="blob-b absolute right-0 top-1/3 size-[380px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 size-[360px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1440px] gap-8 px-4 py-6 sm:px-8 sm:py-8">
        <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent font-display text-lg font-bold text-brand-foreground shadow-lg shadow-brand/30">
              Q
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-tight">Quillmark</p>
              <p className="text-[11px] text-muted-foreground/70">AI Workplace Assistant</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/5 hover:text-foreground"
                activeProps={{
                  className:
                    "glass !text-foreground font-semibold shadow-lg shadow-black/20 [&_svg]:text-accent",
                }}
              >
                <Icon className="size-4 shrink-0 transition-colors" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <SidebarProfile />

          <div className="glass rounded-2xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <span className="text-xs font-medium text-foreground/80">Pro plan · 4,210 credits</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand to-accent" />
            </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6 pb-14">
          <nav className="glass -mx-1 flex gap-1 overflow-x-auto rounded-2xl p-1.5 lg:hidden">
            {NAV_ITEMS.map(({ to, short, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors"
                activeProps={{ className: "bg-white/10 !text-foreground font-semibold" }}
              >
                <Icon className="size-4" />
                {short}
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-ink/80 px-4 py-2.5 text-center backdrop-blur-xl">
        <p className="text-[11px] text-muted-foreground/80">
          Disclaimer: AI-generated content may require human review.
        </p>
      </footer>
    </div>
  );
}

export function ModuleHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <header className="rise glass flex items-start justify-between gap-4 rounded-2xl p-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent outline outline-accent/20">
          Live
        </span>
        {badge ? (
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground outline outline-white/10">
            {badge}
          </span>
        ) : null}
      </div>
    </header>
  );
}

export function Panel({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <section
      className={`rise glass rounded-2xl p-6 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  );
}

export function GenerateButton({
  loading,
  children,
  disabled,
}: {
  loading: boolean;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-accent px-4 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Generating…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
