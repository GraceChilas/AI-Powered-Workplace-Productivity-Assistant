import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Check, X, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "My Tasks — WorkMate AI" }] }),
  component: TasksPage,
});

type Priority = "low" | "medium" | "high";
type Task = {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
};

const STORAGE_KEY = "workmate-tasks";
const DEFAULT_CATEGORIES = ["Work", "Personal", "Urgent", "Ideas"];

function load(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

function priorityColor(p: Priority) {
  return p === "high"
    ? "bg-destructive/15 text-destructive border-destructive/30"
    : p === "medium"
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Work");
  const [editPriority, setEditPriority] = useState<Priority>("medium");

  useEffect(() => {
    setTasks(load());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    tasks.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [tasks]);

  const visible = useMemo(() => {
    const list = filter === "All" ? tasks : tasks.filter((t) => t.category === filter);
    return [...list].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const order = { high: 0, medium: 1, low: 2 } as const;
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      return b.createdAt - a.createdAt;
    });
  }, [tasks, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    visible.forEach((t) => {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    });
    return Array.from(map.entries());
  }, [visible]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.done).length;
    return { total: tasks.length, done, open: tasks.length - done };
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        priority,
        done: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setTitle("");
  };

  const toggleDone = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditCategory(t.category);
    setEditPriority(t.priority);
  };

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? { ...t, title: editTitle.trim(), category: editCategory, priority: editPriority }
          : t,
      ),
    );
    setEditingId(null);
  };

  return (
    <AppShell title="My Tasks">
      <div className="grid gap-6">
        <Card className="p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)]">
              <ListChecks className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Add a task</h2>
              <p className="text-xs text-muted-foreground">
                Saved locally in your browser — perfect for testing.
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_auto]">
            <div>
              <Label className="text-xs">Task</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="e.g. Draft Q3 client update"
              />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addTask} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "text-xs rounded-full border px-3 py-1 transition-colors",
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent",
              )}
            >
              {c}
            </button>
          ))}
          <div className="ml-auto text-xs text-muted-foreground">
            {stats.done}/{stats.total} done · {stats.open} open
          </div>
        </div>

        {visible.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">
            No tasks yet. Add one above to get started.
          </Card>
        ) : (
          <div className="grid gap-4">
            {grouped.map(([cat, list]) => (
              <Card key={cat} className="p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm tracking-tight">{cat}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {list.length}
                  </Badge>
                </div>
                <ul className="divide-y">
                  {list.map((t) => (
                    <li key={t.id} className="py-2.5 flex items-start gap-3">
                      <Checkbox
                        checked={t.done}
                        onCheckedChange={() => toggleDone(t.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        {editingId === t.id ? (
                          <div className="grid gap-2 md:grid-cols-[1fr_140px_120px_auto]">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                              autoFocus
                            />
                            <Select value={editCategory} onValueChange={setEditCategory}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={editPriority}
                              onValueChange={(v) => setEditPriority(v as Priority)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={saveEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "text-sm",
                                t.done && "line-through text-muted-foreground",
                              )}
                            >
                              {t.title}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] uppercase tracking-wide rounded-full border px-2 py-0.5",
                                priorityColor(t.priority),
                              )}
                            >
                              {t.priority}
                            </span>
                          </div>
                        )}
                      </div>
                      {editingId !== t.id && (
                        <div className="flex gap-1 shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(t)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeTask(t.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
