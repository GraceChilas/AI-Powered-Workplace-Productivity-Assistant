import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAi } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function AiWorkbench({
  title,
  description,
  systemPrompt,
  buildPrompt,
  inputArea,
  ctaLabel = "Generate",
  outputLabel = "AI Output",
}: {
  title: string;
  description: string;
  systemPrompt: string;
  buildPrompt: () => string | null;
  inputArea: ReactNode;
  ctaLabel?: string;
  outputLabel?: string;
}) {
  const run = useServerFn(runAi);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onRun = async () => {
    const prompt = buildPrompt();
    if (!prompt) {
      toast.error("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { system: systemPrompt, prompt } });
      setOutput(res.text);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate";
      toast.error(msg.includes("429") ? "Rate limited. Please retry shortly." : msg.includes("402") ? "AI credits exhausted. Please add credits in your workspace." : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputArea}
          <Button onClick={onRun} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "Generating..." : ctaLabel}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">{outputLabel}</CardTitle>
            <CardDescription>Editable — refine before using.</CardDescription>
          </div>
          {output && (
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              Copy
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder={loading ? "Thinking…" : "AI output will appear here. You can edit it directly."}
            className="min-h-[420px] font-mono text-sm leading-relaxed"
          />
        </CardContent>
      </Card>
    </div>
  );
}
