import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiWorkbench } from "@/components/ai-workbench";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkMate AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [audience, setAudience] = useState("client");
  const [tone, setTone] = useState("formal");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");

  return (
    <AppShell title="Smart Email Generator">
      <AiWorkbench
        title="Compose a professional email"
        description="Set audience and tone, describe what you want to say, and let AI draft it."
        systemPrompt="You are an expert business communication assistant. Write clear, well-structured professional emails. Always include subject line, greeting, body, and sign-off. Match the requested tone exactly. Keep it concise and actionable."
        buildPrompt={() => {
          if (!context.trim()) return null;
          return `Write a professional email.

Audience: ${audience}
Tone: ${tone}
Subject hint: ${subject || "(none provided — propose one)"}

Context / what to convey:
${context}

Format the output exactly like:
Subject: <subject line>

<full email body with greeting and sign-off>`;
        }}
        inputArea={
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="vendor">Vendor / Partner</SelectItem>
                    <SelectItem value="candidate">Candidate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal / Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="apologetic">Apologetic</SelectItem>
                    <SelectItem value="appreciative">Appreciative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Subject hint (optional)</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Project update — Q3" />
            </div>
            <div>
              <Label className="text-xs">What do you want to say?</Label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Briefly describe the situation, request, or key points to include…"
                className="min-h-[180px]"
              />
            </div>
          </>
        }
        ctaLabel="Generate Email"
        outputLabel="Drafted Email"
      />
    </AppShell>
  );
}
