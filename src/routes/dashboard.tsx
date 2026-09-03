import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarClock, Mail, MessagesSquare, NotebookPen, Search, Sparkles } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/AppShell";
import { ProfileControls } from "@/components/ProfileControls";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview Dashboard — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "See your workspace at a glance: role-aware suggestions, usage stats, and quick access to every Quillmark AI tool.",
      },
      { property: "og:title", content: "Overview Dashboard — Quillmark" },
      {
        property: "og:description",
        content: "Role- and organisation-aware overview of your AI workplace assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const MODULES = [
  {
    to: "/",
    title: "Smart Email Generator",
    blurb: "Audience- and tone-matched drafts with three subject lines.",
    icon: Mail,
  },
  {
    to: "/meeting-notes",
    title: "Meeting Notes Summarizer",
    blurb: "Decisions, action items with owners, and deadlines.",
    icon: NotebookPen,
  },
  {
    to: "/task-planner",
    title: "AI Task Planner",
    blurb: "Prioritised time blocks that fit your working day.",
    icon: CalendarClock,
  },
  {
    to: "/research",
    title: "AI Research Assistant",
    blurb: "Summary, key takeaways, and practical recommendations.",
    icon: Search,
  },
  {
    to: "/chat",
    title: "AI Chatbot",
    blurb: "Ask anything and hand work off to the right tool.",
    icon: MessagesSquare,
  },
] as const;

const STATS = [
  { label: "Drafts generated", value: "128", trend: "+18% this week" },
  { label: "Meetings summarised", value: "34", trend: "+6 vs last week" },
  { label: "Hours planned", value: "72h", trend: "9 focus blocks" },
  { label: "Research briefs", value: "21", trend: "3 pending review" },
] as const;

function suggestions(role: string, orgType: string) {
  const roleTip: Record<string, string> = {
    "Executive / Founder": "Turn this week's board notes into a one-paragraph update for investors.",
    "Manager / Team Lead": "Summarise your last stand-up and auto-assign the action items.",
    "Sales / Account Management": "Draft a persuasive follow-up to your highest-value client.",
    Marketing: "Research a competitor launch and pull three positioning takeaways.",
    "Product / Project Management": "Convert your backlog list into a prioritised schedule for today.",
    Engineering: "Plan focus blocks around your review and on-call commitments.",
    "HR / People Ops": "Draft a formal team-wide announcement with a single clear ask.",
    "Finance / Operations": "Summarise the monthly review into decisions and deadlines.",
    "Consultant / Freelancer": "Generate a client-ready recap email from your meeting notes.",
  };

  const orgTip: Record<string, string> = {
    Startup: "Keep drafts short and direct — speed beats polish at startup pace.",
    "Small Business": "Reuse tone settings so every customer email sounds consistent.",
    Enterprise: "Use the Formal tone and review outputs before external circulation.",
    "Agency / Consultancy": "Separate client-facing and internal drafts by audience setting.",
    "Non-profit / NGO": "Persuasive tone works well for donor and partner outreach.",
    "Government / Public Sector": "Prefer Formal tone and record decisions with named owners.",
    Education: "Summarise long readings into takeaways students can act on.",
    Healthcare: "Always apply human review before anything patient-facing.",
  };

  return [
    roleTip[role] ?? "Start with a draft email and refine it from there.",
    orgTip[orgType] ?? "Set your organisation type to sharpen these suggestions.",
    "Ask the chatbot to chain two tools together — notes in, email out.",
  ];
}

function Dashboard() {
  const { role, orgType } = useProfile();
  const tips = suggestions(role, orgType);

  return (
    <>
      <ModuleHeader
        title="Overview"
        description={`Your ${orgType.toLowerCase()} workspace, tuned for a ${role.toLowerCase()}.`}
        badge="Dashboard"
      />

      <Panel delay={0.05}>
        <h2 className="font-display text-base font-semibold">Workspace profile</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Choose your role and organisation type — suggestions across every module adapt to it.
        </p>
        <ProfileControls />
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <Panel key={s.label} delay={0.1 + i * 0.04} className="!p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-accent">{s.trend}</p>
          </Panel>
        ))}
      </div>

      <Panel delay={0.2}>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-4 text-accent" />
          <h2 className="font-display text-base font-semibold">Recommended for you</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {tips.map((t) => (
            <li
              key={t}
              className="rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-foreground/90"
            >
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m, i) => (
          <Link key={m.to} to={m.to} className="group">
            <Panel delay={0.25 + i * 0.04} className="h-full transition hover:bg-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground shadow-lg shadow-brand/25">
                  <m.icon className="size-4" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-accent" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.blurb}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </>
  );
}
