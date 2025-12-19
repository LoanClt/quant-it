import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userProgress } from "@/data/questions";

export function ActivityChart() {
  const maxXp = Math.max(...userProgress.recentActivity.map(d => d.xpEarned));

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle>Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-40">
          {userProgress.recentActivity.map((day, index) => {
            const height = (day.xpEarned / maxXp) * 100;
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full gradient-primary rounded-t-md transition-all duration-500 hover:opacity-80"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
                <span className="text-xs text-muted-foreground">{dayName}</span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="text-2xl font-bold">
              {userProgress.recentActivity.reduce((sum, d) => sum + d.questionsCompleted, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Questions this week</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="text-2xl font-bold">
              {userProgress.recentActivity.reduce((sum, d) => sum + d.xpEarned, 0)}
            </div>
            <div className="text-sm text-muted-foreground">XP earned this week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
