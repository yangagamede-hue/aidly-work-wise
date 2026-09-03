import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  EmptyState,
  FieldLabel,
  GenerateButton,
  ModuleHeader,
  Panel,
} from "@/components/AppShell";
import { generateSchedule, type PlanResult, type PlannedTask } from "@/lib/assistant";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a raw task list and your available hours into a prioritized schedule with suggested time blocks.",
      },
      { property: "og:title", content: "AI Task Planner — Quillmark" },
      {
        property: "og:description",
        content: "High, medium, and low priority time blocks generated from your task list.",
      },
    ],
  }),
  component: TaskPlanner,
});

const SAMPLE = `Fix the urgent billing bug reported by the client
Prepare Q3 board deck
Review two pull requests
Reply to vendor contract email
Organize the shared drive
Read the competitor analysis report`;

function TaskPlanner() {
  const [tasks, setTasks] = useState(SAMPLE);
  const [hours, setHours] = useState(6);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tasks.trim()) return;
    setLoading(true);
    setResult(await generateSchedule({ tasks, hoursPerDay: hours }));
    setLoading(false);
  }

  return (
    <>
      <ModuleHeader
        title="AI Task Planner"
        description="Drop in a messy list — get a prioritized day with realistic time blocks."
        badge="Time blocking"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-2" delay={0.08}>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <FieldLabel>Raw task list</FieldLabel>
              <textarea
                rows={10}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="One task per line…"
                className="w-full resize-none rounded-xl bg-ink/60 p-3 text-sm leading-relaxed text-foreground/90 outline outline-white/10 placeholder:text-muted-foreground/60 focus:outline-brand/50"
              />
            </div>
            <div>
              <FieldLabel>Working hours per day — {hours}h</FieldLabel>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-[var(--brand)]"
              />
            </div>
            <GenerateButton loading={loading}>Generate Schedule</GenerateButton>
          </form>
        </Panel>

        <Panel className="xl:col-span-3" delay={0.16}>
          <h2 className="mb-4 font-display text-sm font-semibold">Prioritized schedule</h2>
          {!result ? (
            <EmptyState label="Your prioritized day will appear here." />
          ) : (
            <div className="rise space-y-5">
              <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-foreground/85 outline outline-brand/25">
                {result.note}
              </p>
              <PriorityGroup label="High priority" accent="destructive" tasks={result.high} />
              <PriorityGroup label="Medium priority" accent="accent" tasks={result.medium} />
              <PriorityGroup label="Low priority" accent="muted" tasks={result.low} />
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

function PriorityGroup({
  label,
  accent,
  tasks,
}: {
  label: string;
  accent: "destructive" | "accent" | "muted";
  tasks: PlannedTask[];
}) {
  const dot =
    accent === "destructive" ? "bg-destructive" : accent === "accent" ? "bg-accent" : "bg-white/30";

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className={`size-2 rounded-full ${dot}`} />
        <FieldLabel>{label}</FieldLabel>
      </div>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          Nothing in this bucket.
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.task}
              className="flex items-center justify-between gap-4 rounded-xl bg-ink/50 px-4 py-3 outline outline-white/10 transition hover:bg-ink/70"
            >
              <p className="text-sm text-foreground/85">{t.task}</p>
              <span className="shrink-0 font-display text-xs text-muted-foreground">
                {t.block} · {t.minutes}m
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
