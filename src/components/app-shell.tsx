import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./app-sidebar";
import { ThemeToggle } from "./theme-toggle";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck,
  BookOpen,
  MessagesSquare,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarCheck },
  { title: "My Tasks", url: "/tasks", icon: ListChecks },
  { title: "Research Assistant", url: "/research", icon: BookOpen },
  { title: "AI Chatbot", url: "/chat", icon: MessagesSquare },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/60 backdrop-blur sticky top-0 z-10 flex items-center gap-3 px-4 md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-sidebar text-sidebar-foreground p-0 w-72">
              <div className="flex items-center gap-2 px-5 h-16 border-b border-sidebar-border">
                <div className="grid place-items-center h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)]">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="font-semibold">WorkMate AI</div>
              </div>
              <nav className="p-3 space-y-1">
                {items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <Link
                      key={item.url}
                      to={item.url}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Powered by Lovable AI
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
        <footer className="px-4 md:px-8 py-4 text-[11px] text-muted-foreground border-t bg-card/40">
          Responsible AI notice: WorkMate AI assists with drafting and summarization. Outputs may contain errors or bias.
          Always review for accuracy, privacy, and compliance before acting on them. Do not paste confidential personal data you are not authorized to share.
        </footer>
      </div>
    </div>
  );
}
