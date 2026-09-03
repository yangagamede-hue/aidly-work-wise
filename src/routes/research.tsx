import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  EmptyState,
  FieldLabel,
  GenerateButton,
  ModuleHeader,
  Panel,
} from "@/components/AppShell";
import { analyzeResearch, type ResearchResult } from "@/lib/assistant";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste an article or topic and get a summary paragraph, three key takeaways, and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — Quillmark" },
      {
        property: "og:description",
        content: "Summaries, takeaways, and recommendations from any article or research topic.",
      },
    ],
  }),
  component: Research,
});

const SAMPLE = `Hybrid work policies are converging on three days in the office for most knowledge-work companies. Firms that mandated five days saw a measurable increase in voluntary attrition among senior engineers. The strongest predictor of team performance was not location but meeting load: teams with fewer than eight hours of recurring meetings per week outperformed peers regardless of policy.`;

function Research() {
  const [text, setText] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(await analyzeResearch(text));
    setLoading(false);
  }

  return (
    <>
      <ModuleHeader
        title="AI Research Assistant"
        description="Condense an article or topic into something you can actually use."
        badge="Analysis"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-2" delay={0.08}>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <FieldLabel>Article text or research topic</FieldLabel>
              <textarea
                rows={14}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste an article, or describe the topic you need researched…"
                className="w-full resize-none rounded-xl bg-ink/60 p-3 text-sm leading-relaxed text-foreground/90 outline outline-white/10 placeholder:text-muted-foreground/60 focus:outline-brand/50"
              />
            </div>
            <GenerateButton loading={loading}>Analyze &amp; Summarize</GenerateButton>
          </form>
        </Panel>

        <Panel className="xl:col-span-3" delay={0.16}>
          <h2 className="mb-4 font-display text-sm font-semibold">Analysis</h2>
          {!result ? (
            <EmptyState label="Your summary, takeaways, and recommendations will appear here." />
          ) : (
            <div className="rise space-y-6">
              <section>
                <FieldLabel>Summary</FieldLabel>
                <p className="rounded-xl bg-ink/50 p-4 text-sm leading-relaxed text-foreground/85 outline outline-white/10">
                  {result.summary}
                </p>
              </section>

              <section>
                <FieldLabel>Key takeaways</FieldLabel>
                <div className="space-y-2">
                  {result.takeaways.map((t, i) => (
                    <div
                      key={t}
                      className="flex gap-3 rounded-xl bg-ink/50 px-4 py-3 outline outline-white/10"
                    >
                      <span className="font-display text-xs font-semibold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/85">{t}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <FieldLabel>Practical recommendations</FieldLabel>
                <ul className="space-y-2 rounded-xl bg-brand/10 p-4 outline outline-brand/25">
                  {result.recommendations.map((r) => (
                    <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
