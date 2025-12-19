import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { SkillScore } from "@/hooks/useUserProgress";
import { userProgress as mockProgress } from "@/data/questions";

const skillLabels: Record<string, string> = {
  logic: "Logic",
  probability: "Probability",
  estimation: "Estimation",
  strategy: "Strategy",
  'mental-math': "Mental Math",
  pattern: "Pattern",
  lateral: "Lateral",
  math: "Advanced Math",
};

interface SkillRadarProps {
  skills?: SkillScore[];
}

export function SkillRadar({ skills: realSkills }: SkillRadarProps) {
  // Use real skills if available and not empty, otherwise fall back to mock data
  const skills = (realSkills && realSkills.length > 0)
    ? realSkills.map(s => [s.skill_name, s.score] as [string, number]).sort((a, b) => b[1] - a[1])
    : Object.entries(mockProgress.skillScores).sort((a, b) => b[1] - a[1]);

  const weakSpots = (realSkills && realSkills.length > 0)
    ? realSkills.filter(s => s.score < 60).map(s => s.skill_name)
    : mockProgress.weakSpots;

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Skill Mastery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map(([skill, score]) => {
          const isWeak = weakSpots.includes(skill);
          return (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{skillLabels[skill] || skill}</span>
                  {isWeak && (
                    <AlertTriangle className="w-3 h-3 text-difficulty-medium" />
                  )}
                </div>
                <span className={`font-medium ${isWeak ? 'text-difficulty-medium' : 'text-foreground'}`}>
                  {score}%
                </span>
              </div>
              <Progress 
                value={score} 
                variant={isWeak ? "default" : "gradient"}
                className={`h-2 ${isWeak ? 'opacity-70' : ''}`}
              />
            </div>
          );
        })}
        
        {weakSpots.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-difficulty-medium/10 border border-difficulty-medium/30">
            <div className="flex items-center gap-2 text-sm font-medium text-difficulty-medium mb-2">
              <AlertTriangle className="w-4 h-4" />
              Focus Areas
            </div>
            <p className="text-sm text-muted-foreground">
              You could improve on: {weakSpots.map(s => skillLabels[s] || s).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
