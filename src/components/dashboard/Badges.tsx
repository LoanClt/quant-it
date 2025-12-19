import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userProgress } from "@/data/questions";
import { Award, Flame, Brain, Zap, Calendar } from "lucide-react";

const badgeIcons: Record<string, any> = {
  'First Steps': Award,
  'Week Warrior': Calendar,
  'Logic Master': Brain,
  'Speed Demon': Zap,
  'Consistent': Flame,
};

const badgeColors: Record<string, string> = {
  'First Steps': 'bg-primary/20 text-primary border-primary/30',
  'Week Warrior': 'bg-category-estimation/20 text-category-estimation border-category-estimation/30',
  'Logic Master': 'bg-category-logic/20 text-category-logic border-category-logic/30',
  'Speed Demon': 'bg-category-strategy/20 text-category-strategy border-category-strategy/30',
  'Consistent': 'bg-destructive/20 text-destructive border-destructive/30',
};

export function Badges() {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-difficulty-medium" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {userProgress.badges.map((badge) => {
            const Icon = badgeIcons[badge] || Award;
            const colorClass = badgeColors[badge] || 'bg-secondary text-secondary-foreground';
            
            return (
              <Badge 
                key={badge} 
                variant="outline"
                className={`px-3 py-1.5 ${colorClass}`}
              >
                <Icon className="w-3 h-3 mr-1.5" />
                {badge}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
