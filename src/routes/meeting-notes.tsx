import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  EmptyState,
  FieldLabel,
  GenerateButton,
  ModuleHeader,
  Panel,
} from "@/components/AppShell";
import { summarizeMeeting, type MeetingResult } from "@/lib/assistant";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into key decisions, an action item table with assignees, and a clear deadline list.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Quillmark" },
      {
        property: "og:description",
        content: "Decisions, owners, and deadlines extracted from messy meeting notes.",
      },
    ],
  }),
  component: MeetingNotes,
});

const SAMPLE = `We agreed to ship the billing revamp before the end of the quarter.
Priya will finalise the pricing table by Friday.
Tom raised that the migration script still fails on legacy accounts; he will take that.
We decided to postpone the mobile redesign to Q4.
Nina to follow up with Legal on the revised MSA by next week.
Deadline for the beta invite list is 12/09.`;

function MeetingNotes() {
  const [notes, setNotes] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setResult(await summarizeMeeting(notes));
    setLoading(false);
  }

  return (
    <>
      <ModuleHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get decisions, owners, and deadlines you can act on."
        badge="Structured output"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-2" delay={0.08}>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <FieldLabel>Raw meeting notes</FieldLabel>
              <textarea
                rows={16}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste everything — bullet fragments, half sentences, names…"
                className="w-full resize-none rounded-xl bg-ink/60 p-3 text-sm leading-relaxed text-foreground/90 outline outline-white/10 placeholder:text-muted-foreground/60 focus:outline-brand/50"
              />
            </div>
            <GenerateButton loading={loading}>Summarize Notes</GenerateButton>
          </form>
        </Panel>

        <Panel className="xl:col-span-3" delay={0.16}>
          <h2 className="mb-4 font-display text-sm font-semibold">Summary</h2>
          {!result ? (
            <EmptyState label="Your structured summary will appear here." />
          ) : (
            <div className="rise space-y-6">
              <section>
                <FieldLabel>Key decisions</FieldLabel>
                <ul className="space-y-2 rounded-xl bg-ink/50 p-4 outline outline-white/10">
                  {result.decisions.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <FieldLabel>Action items</FieldLabel>
                <div className="overflow-hidden rounded-xl outline outline-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Task</th>
                        <th className="px-4 py-2.5 font-semibold">Assignee</th>
                        <th className="px-4 py-2.5 font-semibold">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="bg-ink/50">
                      {result.actions.map((a) => (
                        <tr key={a.task} className="border-t border-border/60">
                          <td className="px-4 py-3 text-foreground/85">{a.task}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-foreground/70">
                            {a.assignee}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                a.priority === "High"
                                  ? "bg-destructive/15 text-destructive"
                                  : a.priority === "Medium"
                                    ? "bg-accent/10 text-accent"
                                    : "bg-white/5 text-muted-foreground"
                              }`}
                            >
                              {a.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <FieldLabel>Deadlines</FieldLabel>
                <div className="space-y-2">
                  {result.deadlines.map((d) => (
                    <div
                      key={d.item}
                      className="flex items-center justify-between gap-4 rounded-xl bg-ink/50 px-4 py-3 outline outline-white/10"
                    >
                      <p className="text-sm text-foreground/85">{d.item}</p>
                      <span className="shrink-0 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-foreground outline outline-brand/30">
                        {d.due}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
