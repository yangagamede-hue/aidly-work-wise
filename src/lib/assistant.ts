/**
 * Simulated AI generation layer.
 * Deterministic, content-aware templates that produce realistic output
 * without requiring an external model provider.
 */

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const sentences = (text: string) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(clean)
    .filter((s) => s.length > 3);

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const NAMES = ["Alex", "Priya", "Jordan", "Sam", "Nina", "Tom"];

/* ---------------------------------- Email --------------------------------- */

export type Audience = "Client" | "Manager" | "Team" | "External";
export type Tone = "Formal" | "Casual" | "Persuasive" | "Urgent";

export interface EmailResult {
  subjects: string[];
  body: string;
}

const GREETING: Record<Audience, string> = {
  Client: "Hi Jordan,",
  Manager: "Hi Dana,",
  Team: "Hi team,",
  External: "Hello,",
};

const SIGNOFF: Record<Tone, string> = {
  Formal: "Kind regards,",
  Casual: "Cheers,",
  Persuasive: "Looking forward to it,",
  Urgent: "Thanks in advance,",
};

const OPENER: Record<Tone, (topic: string, audience: Audience) => string> = {
  Formal: (t) => `I hope this message finds you well. I am writing regarding ${t}.`,
  Casual: (t) => `Quick note about ${t} — wanted to keep you in the loop.`,
  Persuasive: (t) =>
    `I wanted to share something I think will genuinely move the needle for you: ${t}.`,
  Urgent: (t) => `Flagging this as time-sensitive: ${t}. I'd appreciate a response today if possible.`,
};

const CLOSER: Record<Tone, string> = {
  Formal: "Please let me know if you require any further detail, and I will follow up accordingly.",
  Casual: "Shout if anything looks off and I'll sort it out.",
  Persuasive: "If this sounds right, I can have everything ready on your side within the week.",
  Urgent: "Could you confirm by end of day so we don't lose the window?",
};

const CONTEXT: Record<Audience, string> = {
  Client: "I've kept the detail tight so your team can act on it without extra back-and-forth.",
  Manager: "Happy to add supporting numbers or a short summary deck if that's useful for review.",
  Team: "I've assigned owners where it was obvious — please correct anything that looks wrong.",
  External: "For context, we're the team responsible for delivery on this workstream.",
};

export async function generateEmail(input: {
  audience: Audience;
  tone: Tone;
  topic: string;
}): Promise<EmailResult> {
  await delay(1100);
  const topic = clean(input.topic).replace(/\.$/, "");
  const short = topic.length > 58 ? topic.slice(0, 55).trimEnd() + "…" : topic;
  const key = titleCase(short);
  const points = sentences(topic).slice(0, 3);

  const subjects = {
    Formal: [
      `Regarding ${key}`,
      `${key} — summary and next steps`,
      `Follow-up: ${key}`,
    ],
    Casual: [`Quick one on ${short}`, `${key} — where we landed`, `Got a minute? ${key}`],
    Persuasive: [
      `${key} — and what it unlocks for you`,
      `A faster path on ${short}`,
      `Why now is the right moment for ${short}`,
    ],
    Urgent: [
      `Action needed today: ${key}`,
      `Time-sensitive — ${key}`,
      `${key}: response required before EOD`,
    ],
  }[input.tone];

  const bullets = points.length
    ? points.map((p) => `• ${titleCase(p.replace(/\.$/, ""))}.`).join("\n")
    : "• Full context is attached for your reference.";

  const body = [
    GREETING[input.audience],
    "",
    OPENER[input.tone](short, input.audience),
    "",
    "Here's the detail:",
    bullets,
    "",
    CONTEXT[input.audience],
    "",
    CLOSER[input.tone],
    "",
    SIGNOFF[input.tone],
    "Mira Chen",
  ].join("\n");

  return { subjects, body };
}

/* ------------------------------ Meeting notes ----------------------------- */

export interface MeetingResult {
  decisions: string[];
  actions: { task: string; assignee: string; priority: string }[];
  deadlines: { item: string; due: string }[];
}

export async function summarizeMeeting(notes: string): Promise<MeetingResult> {
  await delay(1200);
  const lines = sentences(notes);

  const decisionLines = lines.filter((l) =>
    /decid|agree|approv|confirm|sign(ed)? off|conclus|align/i.test(l),
  );
  const actionLines = lines.filter((l) => /will |to do|action|follow up|assign|owns|take/i.test(l));
  const deadlineLines = lines.filter((l) =>
    /by |due|deadline|friday|monday|tuesday|wednesday|thursday|week|month|q[1-4]|\d{1,2}\/\d{1,2}/i.test(
      l,
    ),
  );

  const fallback = lines.slice(0, 3);

  const decisions = (decisionLines.length ? decisionLines : fallback)
    .slice(0, 5)
    .map((l) => titleCase(l.replace(/\.$/, "")));

  const actions = (actionLines.length ? actionLines : lines.slice(0, 4))
    .slice(0, 5)
    .map((l, i) => {
      const named = l.match(/\b([A-Z][a-z]{2,10})\b/);
      return {
        task: titleCase(l.replace(/\.$/, "")),
        assignee: named?.[1] ?? NAMES[i % NAMES.length] ?? "Unassigned",
        priority: i === 0 ? "High" : i < 3 ? "Medium" : "Low",
      };
    });

  const deadlines = (deadlineLines.length ? deadlineLines : lines.slice(0, 2))
    .slice(0, 4)
    .map((l, i) => {
      const m = l.match(
        /\b(?:by\s+)?(monday|tuesday|wednesday|thursday|friday|next week|end of (?:the )?(?:week|month|quarter)|q[1-4]|\d{1,2}\/\d{1,2})\b/i,
      );
      return {
        item: titleCase(l.replace(/\.$/, "")),
        due: m?.[1]
          ? titleCase(m[1])
          : (["This Friday", "Next week", "End of month", "Q3"][i % 4] ?? "This week"),
      };
    });

  return { decisions, actions, deadlines };
}

/* ------------------------------- Task planner ------------------------------ */

export interface PlannedTask {
  task: string;
  block: string;
  minutes: number;
}
export interface PlanResult {
  high: PlannedTask[];
  medium: PlannedTask[];
  low: PlannedTask[];
  note: string;
}

const HIGH_RX = /urgent|asap|today|critical|blocker|client|deadline|launch|fix|escalat/i;
const LOW_RX = /someday|maybe|nice to have|read|explore|tidy|organi[sz]e|backlog/i;

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${((h + 8) % 24).toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function generateSchedule(input: {
  tasks: string;
  hoursPerDay: number;
}): Promise<PlanResult> {
  await delay(1100);
  const items = input.tasks
    .split(/\n|,|;/)
    .map(clean)
    .filter(Boolean);

  const high = items.filter((t) => HIGH_RX.test(t));
  const low = items.filter((t) => !HIGH_RX.test(t) && LOW_RX.test(t));
  const medium = items.filter((t) => !high.includes(t) && !low.includes(t));

  const total = Math.max(items.length, 1);
  const available = Math.round(input.hoursPerDay * 60);
  const slot = Math.max(20, Math.round(available / total / 5) * 5);

  let cursor = 0;
  const place = (list: string[]): PlannedTask[] =>
    list.map((t) => {
      const start = cursor;
      cursor += slot + 10;
      return {
        task: titleCase(t),
        block: `${fmt(start)} – ${fmt(start + slot)}`,
        minutes: slot,
      };
    });

  const plan = { high: place(high), medium: place(medium), low: place(low) };
  const planned = items.length * slot;

  return {
    ...plan,
    note:
      planned > available
        ? `Your list needs about ${Math.round(planned / 60)}h but you have ${input.hoursPerDay}h. Consider deferring the low-priority block to tomorrow.`
        : `Comfortable fit: roughly ${Math.round(planned / 60)}h of focused work inside your ${input.hoursPerDay}h day, with buffers between blocks.`,
  };
}

/* ----------------------------- Research assistant -------------------------- */

export interface ResearchResult {
  summary: string;
  takeaways: string[];
  recommendations: string[];
}

export async function analyzeResearch(text: string): Promise<ResearchResult> {
  await delay(1300);
  const lines = sentences(text);
  const topic = clean(text).slice(0, 70);
  const words = clean(text).split(" ").length;

  const summary = lines.length > 2
    ? `${lines.slice(0, 2).join(" ")} Across roughly ${words} words, the material centres on ${topic.toLowerCase()}… with a consistent emphasis on practical trade-offs rather than theory.`
    : `The material centres on ${topic || "the supplied topic"}. It reads as an early-stage brief: the core claim is clear, but supporting evidence is thin, so treat the conclusions below as directional rather than settled.`;

  const takeaways = [
    lines[0]
      ? `Core claim: ${titleCase(lines[0].replace(/\.$/, ""))}.`
      : "Core claim: the topic is framed as a near-term operational priority.",
    lines[1]
      ? `Supporting detail: ${titleCase(lines[1].replace(/\.$/, ""))}.`
      : "Supporting detail: impact is concentrated in day-to-day workflow rather than strategy.",
    lines[2]
      ? `Open question: ${titleCase(lines[2].replace(/\.$/, ""))} — this needs a second source.`
      : "Open question: no counter-evidence is presented, so the position is untested.",
  ];

  const recommendations = [
    "Validate the central claim against one primary source before circulating it internally.",
    "Turn the strongest point into a one-paragraph brief for stakeholders who won't read the full text.",
    "Set a review date in four weeks — this area moves quickly and the conclusions may age.",
  ];

  return { summary, takeaways, recommendations };
}

/* --------------------------------- Chatbot -------------------------------- */

export async function chatReply(message: string, turn: number): Promise<string> {
  await delay(900);
  const m = message.toLowerCase();

  if (/email|draft|write to/.test(m))
    return "I can draft that. Head to **Smart Email Generator**, pick the audience and tone, and paste your context — or tell me the audience, tone, and topic here and I'll outline it:\n\n1. Opening line matched to tone\n2. Two or three factual bullets\n3. A clear, single ask";
  if (/meeting|notes|minutes/.test(m))
    return "Paste the raw notes into **Meeting Notes Summarizer** and I'll split them into key decisions, action items with assignees, and deadlines. If you also want a follow-up email from those notes, say the word.";
  if (/plan|schedule|priorit|task/.test(m))
    return "Give me your task list and how many hours you have. I'll sort them into High, Medium, and Low priority and lay out time blocks with buffers — the **AI Task Planner** tab does this in one click.";
  if (/research|summari[sz]e|article/.test(m))
    return "Drop the article text or a topic into **AI Research Assistant**. You'll get a summary paragraph, three key takeaways, and practical recommendations you can act on.";
  if (/hello|hi\b|hey/.test(m))
    return "Hello. What are you working on — an email, a set of meeting notes, a plan for the day, or something you need researched?";
  if (/thank/.test(m)) return "Anytime. Want me to turn any of that into a draft you can send?";

  return `Here's how I'd approach "${clean(message).slice(0, 80)}":\n\n1. **Clarify the outcome** — what does "done" look like, and who signs off?\n2. **Split the work** — one thing you can finish in the next 30 minutes, the rest scheduled.\n3. **Close the loop** — a short written update to whoever is waiting on it.\n\n${turn > 2 ? "Want me to draft that update for you?" : "Tell me more and I'll get specific."}`;
}
