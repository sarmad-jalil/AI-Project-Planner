import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRecentPlans } from "@/lib/appwrite";
import { CalendarIcon, FileTextIcon } from "lucide-react";

export function RecentPlans({ onLoadPlan }: { onLoadPlan: (plan: any, idea: string) => void }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getRecentPlans(5);
      setPlans(data);
    } catch (error) {
      console.error('Error loading recent plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const reconstructPlan = (doc: any) => {
    return {
      appName: doc.appName,
      summary: doc.summary,
      targetUsers: JSON.parse(doc.targetUsers || '[]'),
      coreFeatures: JSON.parse(doc.coreFeatures || '[]'),
      techStack: JSON.parse(doc.techStack || '[]'),
      pages: JSON.parse(doc.pages || '[]'),
      dataModel: JSON.parse(doc.dataModel || '{}'),
      buildPhases: JSON.parse(doc.buildPhases || '[]'),
      risks: JSON.parse(doc.risks || '[]'),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading recent plans...</div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <div className="text-muted-foreground">No saved plans yet.</div>
        <div className="text-sm text-muted-foreground/70 mt-2">Generate a plan to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((doc) => (
        <Card key={doc.$id} className="paper-card hover:border-accent/50 transition-all duration-200 hover:shadow-lg cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-display group-hover:text-accent transition-colors truncate">{doc.appName || 'Untitled'}</CardTitle>
                <CardDescription className="text-xs mt-1 line-clamp-2">
                  {doc.idea?.substring(0, 80)}...
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <CalendarIcon className="w-3 h-3" />
              {new Date(doc.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Button 
              onClick={() => onLoadPlan(reconstructPlan(doc), doc.idea)}
              variant="outline"
              className="w-full hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
            >
              Load Plan
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
