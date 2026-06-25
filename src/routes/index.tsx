import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, CalendarCheck, BookOpen, MessagesSquare, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkMate AI — Productivity Suite" },
      { name: "description", content: "AI-powered workplace assistant: smart emails, meeting summaries, planning, research, and chat." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { url: "/email", title: "Smart Email Generator", desc: "Context-based professional emails with tone & audience controls.", icon: Mail },
  { url: "/notes", title: "Meeting Notes Summarizer", desc: "Turn long notes into decisions, action items, and deadlines.", icon: FileText },
  { url: "/planner", title: "AI Task Planner", desc: "Structured daily/weekly plans prioritized by urgency & impact.", icon: CalendarCheck },
  { url: "/research", title: "AI Research Assistant", desc: "Summaries, insights, and simplified explanations for any topic.", icon: BookOpen },
  { url: "/chat", title: "AI Chatbot", desc: "Your interactive workplace assistant for any question.", icon: MessagesSquare },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <section className="rounded-2xl p-6 md:p-10 mb-8 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
          <Sparkles className="h-3.5 w-3.5" /> Productivity, accelerated
        </div>
        <h2 className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Your AI workplace assistant for emails, meetings, planning & research.
        </h2>
        <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
          Draft faster, summarize smarter, and plan with clarity — all in one clean dashboard.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.url} to={t.url} className="group">
            <Card className="h-full transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
              <CardHeader>
                <div className="grid place-items-center h-10 w-10 rounded-lg bg-accent text-accent-foreground mb-2">
                  <t.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base flex items-center justify-between">
                  {t.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Open tool →
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
