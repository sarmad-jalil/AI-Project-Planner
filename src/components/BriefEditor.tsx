import type { ProjectBrief, DeepPartial } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveProjectPlan } from "@/lib/appwrite";
import { useState, useEffect } from "react";
import { CheckIcon, Loader2 } from "lucide-react";

export function BriefEditor({ brief, isStreaming, idea }: { brief: DeepPartial<ProjectBrief> | undefined, isStreaming: boolean, idea?: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editedBrief, setEditedBrief] = useState<DeepPartial<ProjectBrief>>(brief || {});

  useEffect(() => {
    if (brief) {
      setEditedBrief(brief);
    }
  }, [brief]);

  const handleSave = async () => {
    if (!editedBrief || !idea) return;
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await saveProjectPlan(editedBrief, idea);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving plan:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: keyof ProjectBrief, value: any) => {
    setEditedBrief(prev => ({ ...prev, [field]: value }));
  };

  if (!brief && !editedBrief) return null;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center">
        <div className="micro-label">Project Brief</div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckIcon className="w-4 h-4" />
              Saved successfully
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="text-sm text-destructive">Failed to save</div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isStreaming || isSaving} 
            className="command-strip gap-2 rounded-full h-10 hover:-translate-y-0.5 transition-transform duration-200"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Plan"}
          </Button>
        </div>
      </div>
      {/* App Name */}
      <Card className="paper-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="micro-label mb-1">00</div>
          <CardTitle className="font-display text-xl tracking-tight">App Name</CardTitle>
          <CardDescription>The name of your application</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Input 
            value={editedBrief.appName || ""} 
            onChange={(e) => handleFieldChange('appName', e.target.value)}
            readOnly={isStreaming} 
            className="text-lg font-display font-bold bg-background/50 rounded-lg focus-visible:ring-[3px]" 
            placeholder="Generating app name..."
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="paper-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="micro-label mb-1">01</div>
          <CardTitle className="font-display text-xl tracking-tight">Project Summary</CardTitle>
          <CardDescription>High-level overview of the application</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea 
            value={editedBrief.summary || ""} 
            onChange={(e) => handleFieldChange('summary', e.target.value)}
            readOnly={isStreaming} 
            className="min-h-[100px] bg-background/50 rounded-lg focus-visible:ring-[3px]" 
            placeholder="Generating summary..."
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Target Users */}
        <Card className="paper-card">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
            <div className="micro-label mb-1">02</div>
            <CardTitle className="font-display text-lg tracking-tight">Target Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {editedBrief.targetUsers?.map((user, i: number) => (
                <Badge key={i} variant="secondary" className="font-code text-xs rounded-full bg-secondary/50 backdrop-blur-sm">{user}</Badge>
              ))}
              {(!editedBrief.targetUsers || editedBrief.targetUsers.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="paper-card">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
            <div className="micro-label mb-1">03</div>
            <CardTitle className="font-display text-lg tracking-tight">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {editedBrief.techStack?.map((tech, i: number) => (
                <Badge key={i} variant="outline" className="font-code text-xs rounded-full border-primary/30 text-primary">{tech}</Badge>
              ))}
              {(!editedBrief.techStack || editedBrief.techStack.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Features */}
      <Card className="paper-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="micro-label mb-1">04</div>
          <CardTitle className="font-display text-xl tracking-tight">Core Features</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="list-disc pl-5 space-y-2">
            {editedBrief.coreFeatures?.map((feature, i: number) => (
              <li key={i} className="text-sm leading-relaxed">{feature}</li>
            ))}
            {(!editedBrief.coreFeatures || editedBrief.coreFeatures.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
          </ul>
        </CardContent>
      </Card>

      {/* Pages */}
      <Card className="paper-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="micro-label mb-1">05</div>
          <CardTitle className="font-display text-xl tracking-tight">Pages & Routes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {editedBrief.pages?.map((page, i: number) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Input 
                  value={page?.route || ""} 
                  onChange={(e) => {
                    const updatedPages = [...(editedBrief.pages || [])];
                    updatedPages[i] = { ...updatedPages[i], route: e.target.value };
                    handleFieldChange('pages', updatedPages);
                  }}
                  readOnly={isStreaming} 
                  className="font-code text-xs bg-background/50 rounded-lg focus-visible:ring-[3px]" 
                />
                <Input 
                  value={page?.description || ""} 
                  onChange={(e) => {
                    const updatedPages = [...(editedBrief.pages || [])];
                    updatedPages[i] = { ...updatedPages[i], description: e.target.value };
                    handleFieldChange('pages', updatedPages);
                  }}
                  readOnly={isStreaming} 
                  className="md:col-span-3 bg-background/50 rounded-lg focus-visible:ring-[3px]" 
                />
              </div>
            ))}
            {(!editedBrief.pages || editedBrief.pages.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
          </div>
        </CardContent>
      </Card>

      {/* Build Phases */}
      <Card className="paper-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="micro-label mb-1">06</div>
          <CardTitle className="font-display text-xl tracking-tight">Build Phases</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            {editedBrief.buildPhases?.map((phase, i: number) => (
              <div key={i} className="border-l-[3px] border-accent pl-5 py-2 relative">
                <div className="absolute w-3 h-3 rounded-full bg-accent -left-[7px] top-3"></div>
                <h4 className="font-bold text-base mb-2">Phase {phase?.phase || i + 1}: {phase?.name}</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {phase?.tasks?.map((task, j: number) => (
                    <li key={j} className="text-sm text-muted-foreground leading-relaxed">{task}</li>
                  ))}
                </ul>
              </div>
            ))}
            {(!editedBrief.buildPhases || editedBrief.buildPhases.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card className="paper-card border-destructive/30">
        <CardHeader className="pb-3 border-b border-destructive/10 bg-destructive/5">
          <div className="micro-label mb-1 text-destructive">07</div>
          <CardTitle className="font-display text-xl tracking-tight text-destructive">Potential Risks</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="list-disc pl-5 space-y-2">
            {editedBrief.risks?.map((risk, i: number) => (
              <li key={i} className="text-sm text-destructive/80 leading-relaxed">{risk}</li>
            ))}
            {(!editedBrief.risks || editedBrief.risks.length === 0) && <span className="text-sm text-muted-foreground italic">Generating...</span>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
