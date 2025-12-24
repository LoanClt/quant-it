import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame } from "lucide-react";
import { useMemo } from "react";

interface DailyActivity {
  date: string; // YYYY-MM-DD format
  count: number;
}

interface WeeklyProgressProps {
  dailyActivity: DailyActivity[];
  streakDays: number;
}

export function WeeklyProgress({ dailyActivity, streakDays }: WeeklyProgressProps) {
  // Get the last 7 days (including today)
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    // Start from 6 days ago to today (7 days total)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get day name (Mon, Tue, etc.)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      // Find activity for this date
      const activity = dailyActivity.find(a => a.date === dateStr);
      const count = activity?.count || 0;
      
      days.push({
        date: dateStr,
        dayName,
        dayNumber,
        count,
      });
    }
    
    return days;
  }, [dailyActivity]);

  // Calculate max count for color intensity
  const maxCount = useMemo(() => {
    return Math.max(1, ...weekDays.map(d => d.count));
  }, [weekDays]);

  // Get color intensity based on count (0 = gray, max = bright green)
  const getColorIntensity = (count: number) => {
    if (count === 0) return 0;
    const intensity = Math.min(count / maxCount, 1);
    return intensity;
  };

  // Get background color style based on intensity
  const getBackgroundStyle = (intensity: number) => {
    if (intensity === 0) {
      return { backgroundColor: undefined };
    }
    // Scale from light green (0.2 opacity) to bright green (0.8 opacity)
    const opacity = 0.2 + intensity * 0.6;
    return { backgroundColor: `rgba(34, 197, 94, ${opacity})` };
  };

  // Get border color style based on intensity
  const getBorderStyle = (intensity: number) => {
    if (intensity === 0) {
      return { borderColor: undefined };
    }
    // Scale from light green (0.5 opacity) to bright green (1.0 opacity)
    const opacity = 0.5 + intensity * 0.5;
    return { borderColor: `rgba(34, 197, 94, ${opacity})` };
  };

  // Get text color based on intensity
  const getTextColor = (intensity: number) => {
    if (intensity === 0) {
      return 'text-muted-foreground';
    }
    return 'text-green-400';
  };

  return (
    <>
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Progress</CardTitle>
            {streakDays > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="font-semibold text-orange-500">{streakDays} day streak</span>
              </div>
            )}
          </div>
        </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex items-end justify-between gap-2">
            {weekDays.map((day, index) => {
              const intensity = getColorIntensity(day.count);
              const isToday = index === weekDays.length - 1;
              
              return (
                <Tooltip key={day.date}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 flex-1 cursor-pointer group">
                      {/* Day bubble */}
                      <div
                        className={`
                          w-full aspect-square rounded-full
                          border-2 transition-all duration-300
                          flex items-center justify-center
                          ${intensity === 0 ? 'bg-muted/30 border-muted/30' : ''}
                          ${intensity > 0 ? 'hover:scale-110' : ''}
                          ${isToday ? 'ring-2 ring-primary/50' : ''}
                        `}
                        style={{
                          ...getBackgroundStyle(intensity),
                          ...getBorderStyle(intensity),
                        }}
                      >
                        <span className={`text-xs font-semibold ${getTextColor(intensity)}`}>
                          {day.count}
                        </span>
                      </div>
                      
                      {/* Day label */}
                      <div className="text-center">
                        <div className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                          {day.dayName}
                        </div>
                        <div className={`text-[10px] ${isToday ? 'text-primary/70' : 'text-muted-foreground/70'}`}>
                          {day.dayNumber}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <div className="font-semibold">{day.dayName}, {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="text-sm text-muted-foreground">
                        {day.count === 0 
                          ? 'No questions completed' 
                          : `${day.count} question${day.count === 1 ? '' : 's'} completed`}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        
        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">This week</span>
            <span className="font-semibold">
              {weekDays.reduce((sum, day) => sum + day.count, 0)} questions completed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
