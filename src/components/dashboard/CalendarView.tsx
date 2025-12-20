import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface DailyActivity {
  date: string; // YYYY-MM-DD format
  count: number;
}

interface CalendarViewProps {
  dailyActivity: DailyActivity[];
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarView({ dailyActivity, isOpen, onClose }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month and number of days
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const activity = dailyActivity.find(a => a.date === dateStr);
      const count = activity?.count || 0;
      
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        day,
        date: dateStr,
        count,
        isToday,
      });
    }
    
    return {
      year,
      month,
      monthName: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days,
      daysInMonth,
    };
  }, [currentDate, dailyActivity]);

  // Calculate max count for color intensity
  const maxCount = useMemo(() => {
    return Math.max(1, ...dailyActivity.map(a => a.count));
  }, [dailyActivity]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Get color intensity based on count
  const getColorIntensity = (count: number) => {
    if (count === 0) return 0;
    const intensity = Math.min(count / maxCount, 1);
    return intensity;
  };

  // Get background color style based on intensity
  const getBackgroundStyle = (intensity: number, isToday: boolean) => {
    if (intensity === 0) {
      return { backgroundColor: undefined };
    }
    // Scale from light green (0.2 opacity) to bright green (0.8 opacity)
    const opacity = 0.2 + intensity * 0.6;
    return { backgroundColor: `rgba(34, 197, 94, ${opacity})` };
  };

  // Get border color style based on intensity
  const getBorderStyle = (intensity: number, isToday: boolean) => {
    if (isToday) {
      return { borderColor: 'rgba(59, 130, 246, 0.8)' }; // Blue border for today
    }
    if (intensity === 0) {
      return { borderColor: undefined };
    }
    // Scale from light green (0.5 opacity) to bright green (1.0 opacity)
    const opacity = 0.5 + intensity * 0.5;
    return { borderColor: `rgba(34, 197, 94, ${opacity})` };
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Activity Calendar</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {calendarData.monthName}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-1">
              {calendarData.days.map((dayData, index) => {
                if (!dayData) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const intensity = getColorIntensity(dayData.count);
                const date = new Date(dayData.date);
                
                return (
                  <Tooltip key={dayData.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          aspect-square rounded-md
                          border-2 transition-all duration-200
                          flex flex-col items-center justify-center
                          cursor-pointer
                          ${intensity === 0 ? 'bg-muted/20 border-muted/30' : ''}
                          ${dayData.isToday ? 'ring-2 ring-blue-500/50' : ''}
                          ${intensity > 0 ? 'hover:scale-105' : ''}
                        `}
                        style={{
                          ...getBackgroundStyle(intensity, dayData.isToday),
                          ...getBorderStyle(intensity, dayData.isToday),
                        }}
                      >
                        <span className={`text-xs font-semibold ${
                          intensity === 0 
                            ? 'text-muted-foreground' 
                            : 'text-green-400'
                        }`}>
                          {dayData.day}
                        </span>
                        {dayData.count > 0 && (
                          <span className="text-[10px] text-green-300 font-medium mt-0.5">
                            {dayData.count}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <div className="font-semibold">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {dayData.count === 0 
                            ? 'No questions completed' 
                            : `${dayData.count} question${dayData.count === 1 ? '' : 's'} completed`}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-muted/30 bg-muted/20" />
                  <span className="text-muted-foreground">No activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500/50" style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }} />
                  <span className="text-muted-foreground">Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-500/80 ring-2 ring-blue-500/50" />
                  <span className="text-muted-foreground">Today</span>
                </div>
              </div>
              <div className="text-muted-foreground">
                Total: {dailyActivity.reduce((sum, a) => sum + a.count, 0)} questions
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
