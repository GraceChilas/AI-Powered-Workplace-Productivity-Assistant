import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiWorkbench } from "@/components/ai-workbench";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkMate AI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");

  return (
    <AppShell title="Meeting Notes Summarizer">
      <AiWorkbench
        title="Summarize meeting notes"
        description="Paste raw notes or a transcript — get a clean summary, decisions, and action items."
        systemPrompt="You are an expert executive assistant. Read meeting notes and produce a precise, well-structured summary in markdown. Be faithful to source content; do not invent details. Flag uncertainty explicitly."
        buildPrompt={() => {
          if (!notes.trim()) return null;
          return `Summarize the following meeting notes. Use this exact markdown structure:

## TL;DR
A 2-3 sentence overview.

## Key Discussion Points
- bullet points

## Decisions Made
- decision — context

## Action Items
| Owner | Task | Deadline |
| --- | --- | --- |

## Risks / Open Questions
- ...

If any field has no content, write "_None identified_". Highlight deadlines in **bold**.

NOTES:
"""
${notes}
"""`;
        }}
        inputArea={
          <div>
            <Label className="text-xs">Raw notes / transcript</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste meeting notes here…"
              className="min-h-[360px] text-sm"
            />
          </div>
        }
        ctaLabel="Summarize"
        outputLabel="Structured Summary"
      />
    </AppShell>
  );
}
