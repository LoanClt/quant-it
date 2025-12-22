import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { questions, type Question } from "@/data/questions";
import { LatexRenderer } from "@/components/LatexRenderer";
import { Clock, Heart, Lightbulb, Trophy, ArrowLeft, CheckCircle2, XCircle, Zap, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

type DifficultyLevel = "easy" | "medium" | "hard" | "extreme";

interface ChallengeState {
  company: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  lives: number;
  hintsUsed: number;
  startTime: number;
  timeRemaining: number; // in seconds
  answers: { [questionId: string]: number | null };
  hintsRevealed: { [questionId: string]: number };
  completed: boolean;
  failed: boolean;
  score: number | null;
  shake: boolean; // For shake animation on wrong answer
}

const getDifficultyLevel = (difficulty: number): DifficultyLevel => {
  if (difficulty <= 4) return "easy";
  if (difficulty <= 7) return "medium";
  if (difficulty <= 9) return "hard";
  return "extreme";
};

// Get companies that have at least 3 questions with varied difficulties
const getEligibleCompanies = (isPaid: boolean): string[] => {
  const companyQuestions: { [key: string]: Question[] } = {};
  
  questions.forEach((q) => {
    if (q.firm) {
      if (!companyQuestions[q.firm]) {
        companyQuestions[q.firm] = [];
      }
      companyQuestions[q.firm].push(q);
    }
  });

  const eligible: string[] = [];
  
  Object.entries(companyQuestions).forEach(([company, qs]) => {
    const difficulties = new Set(qs.map(q => getDifficultyLevel(q.difficulty)));
    // Need at least 3 different difficulty levels or at least 3 questions
    if (difficulties.size >= 3 || qs.length >= 3) {
      // Only Citadel is free, all others require paid
      if (company === "Citadel" || isPaid) {
        eligible.push(company);
      }
    }
  });

  return eligible.sort();
};

// Select 3 questions of increasing difficulty for a company
const selectChallengeQuestions = (company: string): Question[] => {
  const companyQuestions = questions.filter(q => q.firm === company);
  const byDifficulty = {
    easy: companyQuestions.filter(q => getDifficultyLevel(q.difficulty) === "easy"),
    medium: companyQuestions.filter(q => getDifficultyLevel(q.difficulty) === "medium"),
    hard: companyQuestions.filter(q => getDifficultyLevel(q.difficulty) === "hard"),
    extreme: companyQuestions.filter(q => getDifficultyLevel(q.difficulty) === "extreme"),
  };

  const selected: Question[] = [];
  
  // Try to get one from each difficulty level, in order
  const difficulties: DifficultyLevel[] = ["easy", "medium", "hard", "extreme"];
  
  for (const diff of difficulties) {
    if (selected.length >= 3) break;
    if (byDifficulty[diff].length > 0) {
      // Randomly select one from this difficulty
      const randomIndex = Math.floor(Math.random() * byDifficulty[diff].length);
      selected.push(byDifficulty[diff][randomIndex]);
    }
  }

  // If we don't have 3 yet, fill with random questions
  while (selected.length < 3 && companyQuestions.length > selected.length) {
    const remaining = companyQuestions.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    const randomIndex = Math.floor(Math.random() * remaining.length);
    selected.push(remaining[randomIndex]);
  }

  return selected.slice(0, 3);
};

export default function Challenge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPaid } = useSubscription();
  const [state, setState] = useState<ChallengeState>({
    company: null,
    questions: [],
    currentQuestionIndex: 0,
    lives: 3,
    hintsUsed: 0,
    startTime: 0,
    timeRemaining: 30 * 60, // 30 minutes in seconds
    answers: {},
    hintsRevealed: {},
    completed: false,
    failed: false,
    score: null,
    shake: false,
  });

  const eligibleCompanies = useMemo(() => getEligibleCompanies(isPaid), [isPaid]);

  // Timer countdown
  useEffect(() => {
    if (!state.company || state.completed || state.failed || state.timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          // Time's up! Challenge failed
          handleComplete(false);
          return { ...prev, timeRemaining: 0, completed: true, failed: true };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.company, state.completed, state.failed, state.timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartChallenge = (company: string) => {
    const challengeQuestions = selectChallengeQuestions(company);
    if (challengeQuestions.length < 3) {
      toast.error("Not enough questions available for this company");
      return;
    }

    setState({
      company,
      questions: challengeQuestions,
      currentQuestionIndex: 0,
      lives: 3,
      hintsUsed: 0,
      startTime: Date.now(),
      timeRemaining: 30 * 60,
      answers: {},
      hintsRevealed: {},
      completed: false,
      failed: false,
      score: null,
      shake: false,
    });
  };

  const handleRevealHint = (questionId: string) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (currentQuestion.id !== questionId) return;

    const hintsRevealedForThis = state.hintsRevealed[questionId] || 0;
    if (hintsRevealedForThis >= currentQuestion.hints.length) {
      toast.info("All hints already revealed");
      return;
    }

    setState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      hintsRevealed: {
        ...prev.hintsRevealed,
        [questionId]: hintsRevealedForThis + 1,
      },
    }));
  };

  const handleSubmitAnswer = (questionId: string, answer: number) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = Math.abs(answer - question.numericAnswer) < 0.001;

    if (isCorrect) {
      const newAnswers = { ...state.answers, [questionId]: answer };
      const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
      
      // Update state first
      setState((prev) => ({
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
      }));

      toast.success("Correct answer!");

      // Check if all questions are now correctly answered using newAnswers
      const allCorrect = state.questions.every(q => {
        const userAnswer = newAnswers[q.id];
        return userAnswer !== undefined && 
               Math.abs(userAnswer - q.numericAnswer) < 0.001;
      });

      // If this is the last question and all are correct, complete immediately with green highlight
      if (isLastQuestion && allCorrect) {
        setTimeout(() => {
          handleComplete(true, newAnswers);
        }, 300);
      }
    } else {
      const newLives = state.lives - 1;
      
      // Trigger shake animation
      setState((prev) => ({
        ...prev,
        shake: true,
      }));

      // Remove shake class after animation
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          shake: false,
        }));
      }, 600);

      if (newLives <= 0) {
        toast.error("Out of lives! Challenge failed.");
        setTimeout(() => {
          handleComplete(false);
        }, 1000);
        return;
      }
      
      setState((prev) => ({
        ...prev,
        lives: newLives,
      }));
      toast.error(`Wrong answer! ${newLives} lives remaining.`);
    }
  };

  const handleComplete = async (success: boolean, answersOverride?: { [questionId: string]: number | null }) => {
    // Use provided answers or state answers
    const currentAnswers = answersOverride || state.answers;
    
    const correctAnswers = state.questions.filter(
      (q) => currentAnswers[q.id] !== undefined && 
      Math.abs((currentAnswers[q.id] || 0) - q.numericAnswer) < 0.001
    ).length;

    // Challenge is only successful if all 3 questions are correct AND success flag is true
    const allCorrect = correctAnswers === state.questions.length && success && state.questions.length === 3;

    let finalScore = 0;
    if (allCorrect) {
      // Calculate score: base score - penalty for hints
      // Base: 100 points per question, max 300
      // Penalty: -10 points per hint used
      const baseScore = correctAnswers * 100;
      const hintPenalty = state.hintsUsed * 10;
      const timeBonus = Math.floor(state.timeRemaining / 60) * 2; // 2 points per minute remaining
      finalScore = Math.max(0, baseScore - hintPenalty + timeBonus);
    }

    // Update state with completion status
    setState((prev) => {
      // Use the answers passed in or from state
      const answersToCheck = answersOverride || prev.answers;
      
      // Double-check all answers are correct
      const allAnswersCorrect = prev.questions.every(q => {
        const userAnswer = answersToCheck[q.id];
        return userAnswer !== undefined && 
               Math.abs(userAnswer - q.numericAnswer) < 0.001;
      });
      
      const finalAllCorrect = allAnswersCorrect && success;
      
      return {
        ...prev,
        answers: answersToCheck, // Ensure we use the correct answers
        completed: true,
        failed: !finalAllCorrect,
        score: finalAllCorrect ? finalScore : 0,
      };
    });

    // Save challenge completion to database (even if failed)
    if (user && state.company) {
      try {
        const { error } = await supabase
          .from("challenge_completions")
          .insert({
            user_id: user.id,
            company: state.company,
            score: finalScore,
            questions_completed: correctAnswers,
            time_taken: 30 * 60 - state.timeRemaining,
            hints_used: state.hintsUsed,
            lives_remaining: state.lives,
            failed: !allCorrect,
          });

        if (error) {
          console.error("Error saving challenge completion:", error);
        }
      } catch (err) {
        console.error("Error saving challenge:", err);
      }
    }

    // Show toast based on completion status
    if (allCorrect) {
      toast.success(`Challenge completed! Score: ${finalScore}`);
    } else {
      toast.error("Challenge failed! You need to answer all 3 questions correctly.");
    }
  };

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress = state.questions.length > 0 
    ? ((state.currentQuestionIndex + (state.answers[currentQuestion?.id || ""] !== undefined ? 1 : 0)) / state.questions.length) * 100 
    : 0;

  // Company selection screen
  if (!state.company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Company Challenge
              </h1>
              <p className="text-xl text-muted-foreground">
                Test your skills with 3 questions in 30 minutes
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Challenge Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>• 30 minutes to complete 3 questions of increasing difficulty</p>
                <p>• 3 lives - wrong answer costs 1 life</p>
                <p>• Hints available but reduce your final score</p>
                <p>• No answer reveal - solve it yourself!</p>
                <p>• Bonus points for time remaining</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleCompanies.map((company) => (
                <Card
                  key={company}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleStartChallenge(company)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold">{company}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {questions.filter(q => q.firm === company).length} questions available
                    </p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Locked companies for non-paid users */}
              {!isPaid && getEligibleCompanies(true).filter(c => c !== "Citadel").map((company) => (
                <Card
                  key={company}
                  className="opacity-60 cursor-not-allowed relative"
                >
                  <CardContent className="p-6 text-center">
                    <div className="absolute top-2 right-2">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-muted-foreground">{company}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Premium required
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/pricing");
                      }}
                    >
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Challenge in progress
  if (!state.completed && !state.failed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header with stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/practice")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {state.company}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-xl font-mono font-bold">
                    {formatTime(state.timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-6 h-6 ${
                        i < state.lives ? "text-red-500 fill-red-500" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{state.currentQuestionIndex + 1} / {state.questions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <Card className={`mb-6 transition-all duration-300 ${
                state.shake ? "animate-shake border-2 border-red-500" : ""
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
                    <Badge variant="outline">
                      {getDifficultyLevel(currentQuestion.difficulty).toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <LatexRenderer content={currentQuestion.content} />
                  </div>

                  {/* Hints */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Hints ({state.hintsRevealed[currentQuestion.id] || 0} / {currentQuestion.hints.length})
                      </h3>
                      {((state.hintsRevealed[currentQuestion.id] || 0) < currentQuestion.hints.length) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevealHint(currentQuestion.id)}
                        >
                          Reveal Hint
                        </Button>
                      )}
                    </div>
                    {state.hintsRevealed[currentQuestion.id] > 0 && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        {currentQuestion.hints
                          .slice(0, state.hintsRevealed[currentQuestion.id])
                          .map((hint, idx) => (
                            <p key={idx} className="text-sm">
                              {idx + 1}. {hint}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  {state.answers[currentQuestion.id] === undefined && (
                    <div className="space-y-4">
                      <Input
                        type="number"
                        step="any"
                        placeholder="Enter your answer"
                        className="text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = parseFloat(e.currentTarget.value);
                            if (!isNaN(value)) {
                              handleSubmitAnswer(currentQuestion.id, value);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        className="w-full"
                        onClick={() => {
                          const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                          if (input) {
                            const value = parseFloat(input.value);
                            if (!isNaN(value)) {
                              handleSubmitAnswer(currentQuestion.id, value);
                              input.value = "";
                            } else {
                              toast.error("Please enter a valid number");
                            }
                          }
                        }}
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}

                  {state.answers[currentQuestion.id] !== undefined && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Answer submitted: {state.answers[currentQuestion.id]}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </main>
      </div>
    );
  }

  // Results screen
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Card className={`text-center border-2 ${
            state.failed 
              ? "border-red-500" 
              : "border-green-500"
          }`}>
            <CardHeader>
              <CardTitle className="text-3xl mb-4">
                {state.failed ? "Challenge Failed!" : "Challenge Complete!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!state.failed && state.score !== null && (
                <>
                  <div className="text-6xl font-bold mb-4 text-green-600 dark:text-green-400">
                    {state.score}
                  </div>
                  <p className="text-2xl">Points</p>
                </>
              )}
              {state.failed && (
                <div className="mb-4">
                  <XCircle className="w-16 h-16 mx-auto mb-2 text-red-500" />
                  <p className="text-lg">
                    You need to answer all 3 questions correctly to complete the challenge
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="text-2xl font-bold">
                    {state.questions.filter(q => 
                      state.answers[q.id] !== undefined && 
                      Math.abs((state.answers[q.id] || 0) - q.numericAnswer) < 0.001
                    ).length} / {state.questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lives Left</p>
                  <p className="text-2xl font-bold">{state.lives}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hints Used</p>
                  <p className="text-2xl font-bold">{state.hintsUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Left</p>
                  <p className="text-2xl font-bold">{formatTime(state.timeRemaining)}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <Button 
                  onClick={() => {
                    setState({
                      company: null,
                      questions: [],
                      currentQuestionIndex: 0,
                      lives: 3,
                      hintsUsed: 0,
                      startTime: 0,
                      timeRemaining: 30 * 60,
                      answers: {},
                      hintsRevealed: {},
                      completed: false,
                      failed: false,
                      score: null,
                      shake: false,
                    });
                  }}
                >
                  Try Another Challenge
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
