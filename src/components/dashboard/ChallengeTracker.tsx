import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, Lightbulb, Heart, Eye, X, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { questions } from "@/data/questions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChallengeCompletion {
  company: string;
  score: number;
  questions_completed: number;
  time_taken: number;
  hints_used: number;
  lives_remaining: number;
  failed?: boolean; // Optional - may not exist in database
  created_at: string;
}

const getEligibleCompanies = (): string[] => {
  const companyQuestions: { [key: string]: number[] } = {};
  
  questions.forEach((q) => {
    if (q.firm) {
      if (!companyQuestions[q.firm]) {
        companyQuestions[q.firm] = [];
      }
      const difficulty = q.difficulty <= 4 ? 1 : q.difficulty <= 7 ? 2 : q.difficulty <= 9 ? 3 : 4;
      companyQuestions[q.firm].push(difficulty);
    }
  });

  const eligible: string[] = [];
  
  Object.entries(companyQuestions).forEach(([company, difficulties]) => {
    const uniqueDifficulties = new Set(difficulties);
    if (uniqueDifficulties.size >= 3 || difficulties.length >= 3) {
      eligible.push(company);
    }
  });

  return eligible.sort();
};

export function ChallengeTracker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [completions, setCompletions] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const eligibleCompanies = useMemo(() => {
    try {
      return getEligibleCompanies();
    } catch (error) {
      console.error("Error getting eligible companies:", error);
      return [];
    }
  }, []);

  const fetchCompletions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("ChallengeTracker: Fetching completions for user:", user.id);
    try {
      const { data, error } = await (supabase as any)
        .from("challenge_completions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching challenge completions:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setCompletions([]);
      } else {
        console.log("ChallengeTracker: Fetched completions:", data);
        console.log("ChallengeTracker: Number of completions:", data?.length || 0);
        setCompletions((data || []) as ChallengeCompletion[]);
      }
    } catch (err) {
      console.error("Error:", err);
      setCompletions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  // Refetch when navigating to dashboard (location change)
  useEffect(() => {
    if (location.pathname === "/dashboard" && user) {
      console.log("ChallengeTracker: Dashboard route detected, refetching...");
      fetchCompletions();
    }
  }, [location.pathname, user, fetchCompletions]);

  // Refetch when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        console.log("ChallengeTracker: Page visible, refetching...");
        fetchCompletions();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, fetchCompletions]);

  // Refetch when window gains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user && location.pathname === "/dashboard") {
        console.log("ChallengeTracker: Window focused, refetching...");
        fetchCompletions();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, location.pathname, fetchCompletions]);

  // Listen for challenge completion event
  useEffect(() => {
    const handleChallengeCompleted = () => {
      console.log("ChallengeTracker: Challenge completed event received, refetching...");
      // Small delay to ensure database write is complete
      setTimeout(() => {
        fetchCompletions();
      }, 500);
    };

    window.addEventListener("challengeCompleted", handleChallengeCompleted);
    return () => {
      window.removeEventListener("challengeCompleted", handleChallengeCompleted);
    };
  }, [fetchCompletions]);

  // Get the best successful completion for each company (highest score, only successful ones)
  const bestCompletionsByCompany = useMemo(() => {
    const best: { [company: string]: ChallengeCompletion } = {};
    console.log("ChallengeTracker: Processing completions:", completions);
    console.log("ChallengeTracker: Total completions found:", completions.length);
    completions.forEach((completion) => {
      console.log("ChallengeTracker: Processing completion:", {
        company: completion.company,
        score: completion.score,
        questions_completed: completion.questions_completed,
        isSuccessful: completion.score > 0
      });
      // Only count successful completions (score > 0)
      // Failed challenges have score = 0, successful ones have score > 0
      const isSuccessful = completion.score > 0;
      if (isSuccessful) {
        const existing = best[completion.company];
        if (!existing || completion.score > existing.score) {
          best[completion.company] = completion;
          console.log("ChallengeTracker: Set best completion for", completion.company, "with score", completion.score);
        }
      } else {
        console.log("ChallengeTracker: Skipping completion for", completion.company, "- not successful");
      }
    });
    console.log("ChallengeTracker: Best completions by company:", Object.keys(best));
    console.log("ChallengeTracker: Eligible companies:", eligibleCompanies);
    return best;
  }, [completions, eligibleCompanies]);

  const completedCompanies = new Set(Object.keys(bestCompletionsByCompany));
  const completionRate = eligibleCompanies.length > 0 
    ? (completedCompanies.size / eligibleCompanies.length) * 100 
    : 0;

  const bestScore = completions.length > 0 
    ? Math.max(...completions.map(c => c.score), 0)
    : 0;

  const totalChallenges = completions.length;
  const averageScore = completions.length > 0
    ? Math.round(completions.reduce((sum, c) => sum + c.score, 0) / completions.length)
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Challenge Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Challenge Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setLoading(true);
                fetchCompletions();
              }}
              title="Refresh challenge completions"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            {completions.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/challenge")}>
              Start Challenge
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{completedCompanies.size} / {eligibleCompanies.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Best Score</p>
            <p className="text-2xl font-bold">{bestScore}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Challenges</p>
            <p className="text-2xl font-bold">{totalChallenges}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold">{averageScore}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Completion Rate</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Company List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {eligibleCompanies.map((company) => {
              const completion = bestCompletionsByCompany[company];
              const isCompleted = !!completion;
              
              return (
                <div
                  key={company}
                  className={`
                    p-3 rounded-lg border transition-colors
                    ${isCompleted
                      ? "border-green-500/70 bg-transparent hover:border-green-500"
                      : "bg-muted border-border"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{company}</span>
                    {isCompleted ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/50">
                        <Trophy className="w-3 h-3 mr-1" />
                        {completion.score}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(completion.time_taken / 60)}m {completion.time_taken % 60}s</span>
                      <Lightbulb className="w-3 h-3 ml-2" />
                      <span>{completion.hints_used} hints</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </CardContent>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Challenge Completion Details</DialogTitle>
            <DialogDescription>
              View all your challenge completion history
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {completions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No challenge completions yet. Start your first challenge!
              </p>
            ) : (
              <div className="space-y-3">
                {completions.map((completion, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{completion.company}</h4>
                          {completion.score > 0 ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/50">
                              <Trophy className="w-3 h-3 mr-1" />
                              {completion.score} points
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/50">
                              Failed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(completion.created_at).toLocaleString()}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Questions</p>
                            <p className="font-semibold">{completion.questions_completed} / 3</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-semibold">
                              {Math.floor(completion.time_taken / 60)}m {completion.time_taken % 60}s
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Hints Used</p>
                            <p className="font-semibold">{completion.hints_used}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Lives Left</p>
                            <p className="font-semibold">
                              {completion.score > 0 ? completion.lives_remaining : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
