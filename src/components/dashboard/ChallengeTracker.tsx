import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, Lightbulb, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { questions } from "@/data/questions";
import { Skeleton } from "@/components/ui/skeleton";

interface ChallengeCompletion {
  company: string;
  score: number;
  questions_completed: number;
  time_taken: number;
  hints_used: number;
  lives_remaining: number;
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
  const [completions, setCompletions] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  const eligibleCompanies = getEligibleCompanies();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCompletions = async () => {
      try {
        const { data, error } = await supabase
          .from("challenge_completions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching challenge completions:", error);
          setCompletions([]);
        } else {
          setCompletions(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
        setCompletions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletions();
  }, [user]);

  const completedCompanies = new Set(completions.map(c => c.company));
  const completionRate = eligibleCompanies.length > 0 
    ? (completedCompanies.size / eligibleCompanies.length) * 100 
    : 0;

  const bestScore = completions.length > 0 
    ? Math.max(...completions.map(c => c.score))
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
          <Button variant="outline" size="sm" onClick={() => navigate("/challenge")}>
            Start Challenge
          </Button>
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
              const completion = completions.find(c => c.company === company);
              const isCompleted = !!completion;
              
              return (
                <div
                  key={company}
                  className={`
                    p-3 rounded-lg border transition-colors
                    ${isCompleted 
                      ? "bg-green-50 dark:bg-green-950/20 border-green-500/50" 
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

        {/* Recent Completions */}
        {completions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Recent Completions</h3>
            <div className="space-y-2">
              {completions.slice(0, 3).map((completion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{completion.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(completion.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">{completion.score}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
