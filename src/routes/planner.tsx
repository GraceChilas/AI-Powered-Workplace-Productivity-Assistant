import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiWorkbench } from "@/components/ai-workbench";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkMate AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const [horizon, setHorizon] = useState("day");
  const [hours, setHours] = useState("8");
  const [tasks, setTasks] = useState("");

  return (
    <AppShell title="AI Task Planner">
      <AiWorkbench
        title="Plan your day or week"
        description="List your tasks — AI prioritizes by urgency & importance and proposes a time-blocked schedule."
        systemPrompt="You are a productivity coach trained in the Eisenhower matrix and deep-work principles. Build realistic, time-boxed schedules. Be honest about overcommitment and suggest cuts when needed."
        buildPrompt={() => {
          if (!tasks.trim()) return null;
          return `Build a ${horizon === "day" ? "daily" : "weekly"} plan.

Available focus hours per day: ${hours}

Tasks (free-form, may include estimates, deadlines, energy levels):
${tasks}

Return markdown with:

## Priority Matrix
| Task | Urgency | Importance | Quadrant |

## Time-blocked Schedule
A clear ${horizon === "day" ? "hour-by-hour day plan" : "Monday–Friday plan with daily blocks"}.

## Optimization Tips
3-5 concrete suggestions (batching, deep-work windows, what to drop/delegate).

## Risk Check
Flag if the plan is overcommitted and what to cut.`;
        }}
        inputArea={
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily plan</SelectItem>
                    <SelectItem value="week">Weekly plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Focus hours / day</Label>
                <Input type="number" min={1} max={14} value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Tasks</Label>
              <Textarea
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder={`e.g.\n- Finalize Q3 report (3h, due Fri)\n- Reply to client emails (1h)\n- Prep for Monday demo (2h)`}
                className="min-h-[260px]"
              />
            </div>
          </>
        }
        ctaLabel="Build Plan"
        outputLabel="Your Plan"
      />
    </AppShell>
  );
}
