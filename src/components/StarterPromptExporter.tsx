import type { ProjectBrief, DeepPartial } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

export function StarterPromptExporter({ brief, isStreaming }: { brief: DeepPartial<ProjectBrief> | undefined, isStreaming: boolean }) {
  const [copied, setCopied] = useState(false);

  if (!brief || isStreaming) return null;

  const generateMarkdown = () => {
    let md = `# Project Brief\n\n`;
    
    if (brief.summary) md += `## Summary\n${brief.summary}\n\n`;
    
    if (brief.targetUsers && brief.targetUsers.length > 0) {
      md += `## Target Users\n${brief.targetUsers.map((u) => `- ${u}`).join('\n')}\n\n`;
    }
    
    if (brief.coreFeatures && brief.coreFeatures.length > 0) {
      md += `## Core Features\n${brief.coreFeatures.map((f) => `- ${f}`).join('\n')}\n\n`;
    }
    
    if (brief.techStack && brief.techStack.length > 0) {
      md += `## Tech Stack\n${brief.techStack.map((t) => `- ${t}`).join('\n')}\n\n`;
    }
    
    if (brief.pages && brief.pages.length > 0) {
      md += `## Pages & Routes\n${brief.pages.map((p) => `- **${p?.route}**: ${p?.description}`).join('\n')}\n\n`;
    }
    
    if (brief.dataModel) {
      md += `## Data Model\n\n### Entities\n`;
      brief.dataModel.entities?.forEach((e) => {
        md += `- **${e?.name}**\n${e?.attributes?.map((a) => `  - ${a}`).join('\n')}\n`;
      });
      md += `\n### Relations\n`;
      brief.dataModel.relations?.forEach((r) => {
        md += `- ${r?.source} --[${r?.type}]--> ${r?.target}\n`;
      });
      md += `\n`;
    }

    if (brief.buildPhases && brief.buildPhases.length > 0) {
      md += `## Build Phases\n`;
      brief.buildPhases.forEach((p) => {
        md += `### Phase ${p?.phase}: ${p?.name}\n${p?.tasks?.map((t) => `- ${t}`).join('\n')}\n\n`;
      });
    }

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border/50 glass-panel z-50 animate-fade-up">
      <div className="container mx-auto max-w-[1500px] flex justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground hidden sm:block">
          <span className="micro-label mr-2">Status:</span>
          Generation complete. Ready for agent handoff.
        </div>
        <Button onClick={handleCopy} className="command-strip gap-2 rounded-full h-10 hover:-translate-y-0.5 transition-transform duration-200">
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          <span className="font-bold">{copied ? "Copied to Clipboard" : "Copy Prompt for AI Agent"}</span>
        </Button>
      </div>
    </div>
  );
}
