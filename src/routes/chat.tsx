import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — WorkMate AI" }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Draft a polite follow-up to a client who hasn't replied in a week.",
  "Help me prioritize my tasks for tomorrow.",
  "Explain OKRs to me like I'm new to management.",
  "Summarize the pros and cons of remote vs hybrid work.",
];

function ChatPage() {
  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const loading = status === "submitted" || status === "streaming";

  const submit = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    await sendMessage({ text: text.trim() });
  };

  return (
    <AppShell title="AI Chatbot">
      <Card className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden shadow-[var(--shadow-card)]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-[image:var(--gradient-primary)] mb-4">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">WorkMate Assistant</h3>
              <p className="text-sm text-muted-foreground mt-1">Ask anything — drafting, planning, research, advice.</p>
              <div className="mt-6 grid gap-2 w-full">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-left text-sm rounded-md border px-3 py-2 hover:bg-accent hover:border-primary/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                    {!isUser && (
                      <div className="grid place-items-center h-8 w-8 rounded-full bg-[image:var(--gradient-primary)] shrink-0">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap",
                      isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}>
                      {text || (loading ? "…" : "")}
                    </div>
                    {isUser && (
                      <div className="grid place-items-center h-8 w-8 rounded-full bg-secondary text-secondary-foreground shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex gap-3">
                  <div className="grid place-items-center h-8 w-8 rounded-full bg-[image:var(--gradient-primary)]">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-2xl px-4 py-2.5 bg-muted text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          className="border-t bg-card p-3 md:p-4"
        >
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); }
              }}
              placeholder="Ask WorkMate anything…"
              className="min-h-[48px] max-h-40 resize-none"
            />
            <Button type="submit" disabled={loading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            WorkMate can make mistakes. Verify important information.
          </p>
        </form>
      </Card>
    </AppShell>
  );
}
