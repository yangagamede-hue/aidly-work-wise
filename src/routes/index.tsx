import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  EmptyState,
  FieldLabel,
  GenerateButton,
  ModuleHeader,
  Panel,
} from "@/components/AppShell";
import { generateEmail, type Audience, type EmailResult, type Tone } from "@/lib/assistant";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft polished workplace emails in seconds: pick an audience and tone, get three subject lines and an editable body.",
      },
      { property: "og:title", content: "Smart Email Generator — Quillmark" },
      {
        property: "og:description",
        content: "Audience- and tone-matched email drafts with three subject line options.",
      },
    ],
  }),
  component: EmailGenerator,
});

const AUDIENCES: Audience[] = ["Client", "Manager", "Team", "External"];
const TONES: Tone[] = ["Formal", "Persuasive", "Casual", "Urgent"];

function EmailGenerator() {
  const [audience, setAudience] = useState<Audience>("Client");
  const [tone, setTone] = useState<Tone>("Persuasive");
  const [topic, setTopic] = useState(
    "We're rolling out the new onboarding flow to all enterprise clients this quarter and I'd like to walk your team through the pricing tiers and go-live timeline.",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateEmail({ audience, tone, topic });
    setResult(res);
    setBody(res.body);
    setSubjectIndex(0);
    setLoading(false);
  }

  async function copy() {
    const text = result ? `Subject: ${result.subjects[subjectIndex]}\n\n${body}` : body;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <ModuleHeader
        title="Smart Email Generator"
        description="Draft polished emails in seconds, tuned to your audience and tone."
        badge="Assistant v2"
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-2" delay={0.08}>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <FieldLabel>Target audience</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAudience(a)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition ${
                      audience === a
                        ? "bg-brand/20 font-semibold text-foreground outline outline-brand/40"
                        : "bg-white/5 text-foreground/70 outline outline-white/10 hover:bg-white/10"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Tone</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg px-3 py-2 text-xs transition ${
                      tone === t
                        ? "bg-brand/20 font-semibold text-foreground outline outline-brand/40"
                        : "bg-white/5 text-foreground/70 outline outline-white/10 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Primary topic &amp; details</FieldLabel>
              <textarea
                rows={5}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Q3 onboarding rollout, pricing, launch timeline…"
                className="w-full resize-none rounded-xl bg-ink/60 p-3 text-sm text-foreground/90 outline outline-white/10 transition placeholder:text-muted-foreground/60 focus:outline-brand/50"
              />
            </div>

            <GenerateButton loading={loading}>Generate Email</GenerateButton>
          </form>
        </Panel>

        <Panel className="xl:col-span-3" delay={0.16}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">Generated draft</h2>
            {result ? (
              <button
                onClick={copy}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/90 outline outline-white/10 transition hover:bg-white/10"
              >
                {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            ) : null}
          </div>

          {!result ? (
            <EmptyState label="Your draft will appear here — set an audience, tone, and topic, then generate." />
          ) : (
            <div className="rise">
              <FieldLabel>Subject line options</FieldLabel>
              <div className="mb-5 flex flex-col gap-2">
                {result.subjects.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSubjectIndex(i)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                      subjectIndex === i
                        ? "bg-brand/15 text-foreground outline outline-brand/30"
                        : "bg-white/5 text-foreground/70 outline outline-white/10 hover:bg-white/10"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <FieldLabel>Email body · editable</FieldLabel>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className="w-full resize-y whitespace-pre-wrap rounded-xl bg-ink/50 p-4 text-sm leading-relaxed text-foreground/85 outline outline-white/10 focus:outline-brand/50"
              />
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
