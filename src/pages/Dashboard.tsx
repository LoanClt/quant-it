import { Navbar } from "@/components/landing/Navbar";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useSubscription } from "@/hooks/useSubscription";
import { questions } from "@/data/questions";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { ChallengeTracker } from "@/components/dashboard/ChallengeTracker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, loading, completedQuestions, dailyActivity } = useUserProgress();
  const { isPaid, isAdmin, togglePaidStatus, refetch } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const processedSessionRef = useRef<string | null>(null);
  
  // Handle Stripe checkout success (only once per session)
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId || !user) return;

    // Prevent processing the same session multiple times
    if (processedSessionRef.current === sessionId) {
      // Already processing this session, just clean up URL
      if (searchParams.has('session_id')) {
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    // Mark this session as being processed
    processedSessionRef.current = sessionId;
    
    // Remove session_id from URL immediately to prevent re-triggering
    navigate('/dashboard', { replace: true });
    
    // Verify the checkout session and update status if needed
    const verifyAndUpdateSubscription = async () => {
      try {
        // First, verify the session directly with Stripe
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-checkout-session', {
          body: {
            sessionId: sessionId,
            userId: user.id,
          },
        });

        if (verifyError) {
          console.error('Error verifying session:', verifyError);
          // Fall back to checking database
          await checkDatabaseStatus();
          return;
        }

        if (verifyData?.paid && verifyData?.updated) {
          // Successfully updated via verification
          await refetch();
          toast.success('Welcome to Premium! Your subscription is now active.');
          return;
        } else if (verifyData?.paid && !verifyData?.updated) {
          // Payment successful but update failed, try again
          console.warn('Payment successful but update failed, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          await checkDatabaseStatus();
        } else {
          // Payment not completed yet, check database status
          await checkDatabaseStatus();
        }
      } catch (err) {
        console.error('Exception verifying session:', err);
        // Fall back to checking database
        await checkDatabaseStatus();
      }
    };

    const checkDatabaseStatus = async () => {
      let hasShownSuccess = false;
      
      // Try a few times with delays to account for webhook processing time
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // 2s, 4s, 6s
        
        // Check if paid status is now true
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_paid')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (profile?.is_paid && !hasShownSuccess) {
          await refetch(); // Update subscription state
          toast.success('Welcome to Premium! Your subscription is now active.');
          hasShownSuccess = true;
          return;
        }
      }
      
      // Final check and refetch
      await refetch();
      const { data: finalProfile } = await supabase
        .from('profiles')
        .select('is_paid')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!finalProfile?.is_paid && !hasShownSuccess) {
        toast.info('Payment received! Your subscription is being activated. Please refresh in a moment.');
      }
    };
    
    verifyAndUpdateSubscription();
  }, [searchParams.get('session_id'), user?.id]); // Only depend on session_id and user.id
  
  // Debug: Log admin status
  useEffect(() => {
    console.log('Dashboard - isAdmin:', isAdmin, 'isPaid:', isPaid);
  }, [isAdmin, isPaid]);
  
  // Calculate completion by difficulty
  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty <= 4) return 'easy';
    if (difficulty <= 7) return 'medium';
    if (difficulty <= 9) return 'hard';
    return 'extreme';
  };

  const difficultyCounts = useMemo(() => ({
    easy: questions.filter(q => getDifficultyLevel(q.difficulty) === 'easy').length,
    medium: questions.filter(q => getDifficultyLevel(q.difficulty) === 'medium').length,
    hard: questions.filter(q => getDifficultyLevel(q.difficulty) === 'hard').length,
    extreme: questions.filter(q => getDifficultyLevel(q.difficulty) === 'extreme').length,
  }), []);

  // Calculate actual completion from database
  const completedByDifficulty = useMemo(() => {
    const completed = {
      easy: 0,
      medium: 0,
      hard: 0,
      extreme: 0,
    };

    questions.forEach(q => {
      if (completedQuestions.has(q.id)) {
        const level = getDifficultyLevel(q.difficulty);
        completed[level as keyof typeof completed]++;
      }
    });

    return completed;
  }, [completedQuestions]);

  const completionPercentages = useMemo(() => ({
    easy: difficultyCounts.easy > 0 ? (completedByDifficulty.easy / difficultyCounts.easy) * 100 : 0,
    medium: difficultyCounts.medium > 0 ? (completedByDifficulty.medium / difficultyCounts.medium) * 100 : 0,
    hard: difficultyCounts.hard > 0 ? (completedByDifficulty.hard / difficultyCounts.hard) * 100 : 0,
    extreme: difficultyCounts.extreme > 0 ? (completedByDifficulty.extreme / difficultyCounts.extreme) * 100 : 0,
  }), [difficultyCounts, completedByDifficulty]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-12 max-w-2xl mx-auto">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-12 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Progress</h1>
          <div className="flex items-center gap-2">
            {/* Always show admin toggle for testing - check Settings page for full admin controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const result = await togglePaidStatus();
                  if (result?.error) {
                    console.error('Toggle paid status error:', result.error);
                    toast.error(`Failed to toggle paid status: ${result.error.message || 'Unknown error'}`);
                  } else {
                    toast.success(`Paid status: ${!isPaid ? 'Enabled' : 'Disabled'}`);
                  }
                } catch (error) {
                  console.error('Exception toggling paid status:', error);
                  toast.error("Failed to toggle paid status");
                }
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              {isPaid ? "Disable Paid" : "Enable Paid"}
            </Button>
            {!isPaid && (
              <Button variant="hero" size="sm" onClick={() => navigate('/pricing')}>
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Weekly Progress */}
          <WeeklyProgress 
            dailyActivity={dailyActivity} 
            streakDays={progress?.streak_days || 0} 
          />

          {/* Challenge Tracker */}
          <ChallengeTracker />

          {/* Easy */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium">Easy</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentages.easy)}%
                </span>
              </div>
              <Progress value={completionPercentages.easy} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {completedByDifficulty.easy} / {difficultyCounts.easy} completed
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/practice?difficulty=easy')}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medium */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium">Medium</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentages.medium)}%
                </span>
              </div>
              <Progress value={completionPercentages.medium} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {completedByDifficulty.medium} / {difficultyCounts.medium} completed
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/practice?difficulty=medium')}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hard */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium">Hard</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentages.hard)}%
                </span>
              </div>
              <Progress value={completionPercentages.hard} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {completedByDifficulty.hard} / {difficultyCounts.hard} completed
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/practice?difficulty=hard')}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Extreme */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium">Extreme</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(completionPercentages.extreme)}%
                </span>
              </div>
              <Progress value={completionPercentages.extreme} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {completedByDifficulty.extreme} / {difficultyCounts.extreme} completed
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/practice?difficulty=extreme')}
                >
                  View All
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
