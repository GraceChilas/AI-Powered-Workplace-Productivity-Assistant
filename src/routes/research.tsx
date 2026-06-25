import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiWorkbench } from "@/components/ai-workbench";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkMate AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [mode, setMode] = useState("topic");
  const [level, setLevel] = useState("executive");
  const [input, setInput] = useState("");

  return (
    <AppShell title="AI Research Assistant">
      <AiWorkbench
        title="Summarize & analyze"
        description="Paste an article, report, or topic. Get key insights, simplified for fast understanding."
        systemPrompt="You are a senior research analyst. Be rigorous, balanced, and concise. When summarizing user-provided text, stay faithful to it. When given a topic only, draw on general knowledge but flag where current data may be needed."
        buildPrompt={() => {
          if (!input.trim()) return null;
          const audience = level === "executive" ? "a busy executive" : level === "beginner" ? "a complete beginner" : "a technical specialist";
          const source = mode === "topic"
            ? `Topic to research:\n${input}`
            : `Source text to summarize:\n"""\n${input}\n"""`;
          return `${source}

Audience: ${audience}

Produce markdown with:

## Executive Summary
3-5 sentences.

## Key Insights
5-7 bullet points, each starting with a bolded headline.

## Simplified Explanation
A short plain-language explanation (analogies welcome) tailored to the audience.

## Recommendations / Next Steps
3-5 actionable suggestions.

## Caveats
Note any uncertainty or where independent verification is advised.`;
        }}
        inputArea={
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Input type</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="topic">Topic / question</SelectItem>
                    <SelectItem value="text">Paste article / report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Audience level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">{mode === "topic" ? "Topic" : "Source text"}</Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "topic" ? "e.g. Impact of generative AI on customer support operations" : "Paste the article or report here…"}
                className="min-h-[280px]"
              />
            </div>
          </>
        }
        ctaLabel="Analyze"
        outputLabel="Research Brief"
      />
    </AppShell>
  );
}
