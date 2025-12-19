import { Card, CardContent } from "@/components/ui/card";
import { Brain, Target, Clock, Flame, Trophy, TrendingUp } from "lucide-react";
import { UserProgress } from "@/hooks/useUserProgress";
import { userProgress as mockProgress } from "@/data/questions";

interface StatsGridProps {
  progress?: UserProgress | null;
}

export function StatsGrid({ progress }: StatsGridProps) {
  // Use real progress if available, otherwise fall back to mock data
  const data = progress || {
    xp: mockProgress.totalXp,
    level: mockProgress.level,
    streak_days: mockProgress.streak,
    questions_completed: mockProgress.questionsAnswered,
    correct_answers: Math.round(mockProgress.questionsAnswered * mockProgress.accuracy / 100),
    total_practice_time: mockProgress.averageTime * mockProgress.questionsAnswered / 60,
  };

  const accuracy = data.questions_completed > 0 
    ? Math.round((data.correct_answers / data.questions_completed) * 100) 
    : 0;

  const stats = [
    {
      label: "Total XP",
      value: data.xp.toLocaleString(),
      icon: Trophy,
      color: "text-difficulty-medium",
      bgColor: "bg-difficulty-medium/10",
    },
    {
      label: "Level",
      value: data.level,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Day Streak",
      value: data.streak_days,
      icon: Flame,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Questions",
      value: data.questions_completed,
      icon: Brain,
      color: "text-category-logic",
      bgColor: "bg-category-logic/10",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: Target,
      color: "text-difficulty-easy",
      bgColor: "bg-difficulty-easy/10",
    },
    {
      label: "Practice Time",
      value: `${Math.floor(data.total_practice_time / 60)}h`,
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          variant="glass"
          className="animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
