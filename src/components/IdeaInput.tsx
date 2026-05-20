import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function IdeaInput({ onSubmit, isLoading }: { onSubmit: (idea: string) => void; isLoading: boolean }) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmit(idea);
    }
  };

  const isDisabled = isLoading || idea.trim().length === 0;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-10 w-full max-w-3xl mx-auto my-8 animate-scale-in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter">AI Project Planner</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Describe your app idea, and we&apos;ll generate a comprehensive technical brief and blueprint data model.</p>
        </div>
        <Textarea 
          placeholder="E.g. A marketplace for local home-cooked meals with delivery tracking..." 
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-h-[140px] resize-none text-lg p-4 bg-background/50 focus-visible:ring-[3px] rounded-xl"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`command-strip rounded-full h-12 text-lg font-bold hover:-translate-y-0.5 transition-transform duration-200 inline-flex items-center justify-center ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          {isLoading ? "Generating Blueprint..." : "Generate Project Plan"}
        </button>
      </form>
    </div>
  );
}
