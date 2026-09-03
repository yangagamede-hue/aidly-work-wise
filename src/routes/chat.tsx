import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/AppShell";
import { chatReply } from "@/lib/assistant";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Quillmark AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with the Quillmark workplace assistant about emails, meeting notes, planning, and research.",
      },
      { property: "og:title", content: "AI Chatbot — Quillmark" },
      {
        property: "og:description",
        content: "A conversational workplace assistant for drafting, planning, and research.",
      },
    ],
  }),
  component: Chat,
});

interface Msg {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  id: 0,
  role: "assistant",
  content:
    "Hi — I'm the Quillmark Workplace Assistant. I can draft emails, pull decisions and owners out of meeting notes, plan your day around the hours you actually have, and summarise research. What are you working on?",
};

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    const turn = messages.filter((m) => m.role === "user").length + 1;
    setMessages((m) => [...m, { id: Date.now(), role: "user", content: text }]);
    setInput("");
    setThinking(true);
    const reply = await chatReply(text, turn);
    setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", content: reply }]);
    setThinking(false);
  }

  return (
    <>
      <ModuleHeader
        title="AI Chatbot"
        description="Ask anything about your work — drafting, planning, summarising, deciding."
        badge="Conversational"
      />

      <Panel className="flex min-h-[60vh] flex-col !p-0" delay={0.08}>
        <div className="flex-1 space-y-4 overflow-y-auto p-6" style={{ maxHeight: "58vh" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rise flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed sm:max-w-[75%] ${
                  m.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-brand-foreground"
                    : "rounded-2xl rounded-bl-sm bg-ink/50 px-4 py-3 text-foreground/85 outline outline-white/10"
                }`}
              >
                {renderInline(m.content)}
              </div>
            </div>
          ))}

          {thinking ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-ink/50 px-4 py-3 outline outline-white/10">
                <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-accent" />
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="flex items-end gap-2 border-t border-border p-4">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ask the Workplace Assistant… (Enter to send, Shift+Enter for a new line)"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl bg-ink/60 px-4 py-3 text-sm text-foreground/90 outline outline-white/10 placeholder:text-muted-foreground/60 focus:outline-brand/50"
          />
          <button
            onClick={() => void send()}
            disabled={thinking || !input.trim()}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-brand to-accent text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110 disabled:opacity-50"
          >
            <SendHorizonal className="size-4" />
          </button>
        </div>
      </Panel>
    </>
  );
}
