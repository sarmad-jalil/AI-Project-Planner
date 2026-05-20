"use client";

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { ProjectBriefSchema } from '@/lib/schema';
import { IdeaInput } from '@/components/IdeaInput';
import { BriefEditor } from '@/components/BriefEditor';
import { DataModelVisualizer } from '@/components/DataModelVisualizer';
import { StarterPromptExporter } from '@/components/StarterPromptExporter';
import { RecentPlans } from '@/components/RecentPlans';
import { useState } from 'react';
import type { ProjectBrief } from '@/lib/schema';

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdea, setCurrentIdea] = useState("");
  const [loadedBrief, setLoadedBrief] = useState<any>(null);

  const { object: brief, submit, isLoading, error } = useObject({
    api: '/api/generate',
    schema: ProjectBriefSchema,
  });

  const handleIdeaSubmit = (idea: string) => {
    setHasStarted(true);
    setCurrentIdea(idea);
    setLoadedBrief(null);
    submit({ prompt: idea });
  };

  const handleLoadPlan = (plan: any, idea: string) => {
    setHasStarted(true);
    setCurrentIdea(idea);
    setLoadedBrief(plan);
  };

  const displayBrief = loadedBrief || brief;

  return (
    <main className="planner-bg min-h-screen flex-1 overflow-x-hidden pb-32">
      <div className="container mx-auto max-w-[1500px] px-4 py-8 lg:py-12">
        {!hasStarted ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex h-[80vh] items-center justify-center">
              <IdeaInput onSubmit={handleIdeaSubmit} isLoading={isLoading} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold tracking-tight">Recent Plans</h2>
              <RecentPlans onLoadPlan={handleLoadPlan} />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-up">
            <IdeaInput onSubmit={handleIdeaSubmit} isLoading={isLoading} />
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-xl">
                <strong>Error generating project plan:</strong> {error.message}
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]">
              <div className="space-y-6">
                <BriefEditor brief={displayBrief} isStreaming={isLoading} idea={currentIdea} />
              </div>
              <div className="space-y-6">
                <DataModelVisualizer dataModel={displayBrief?.dataModel} />
              </div>
            </div>
            <StarterPromptExporter brief={displayBrief} isStreaming={isLoading} />
          </div>
        )}
      </div>
    </main>
  );
}
