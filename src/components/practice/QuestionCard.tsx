import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Clock, 
  Lightbulb, 
  ChevronRight, 
  Check, 
  RotateCcw,
  X,
  Bookmark,
  BookmarkCheck,
  Eye
} from "lucide-react";
import type { Question } from "@/data/questions";
import { useUserProgress } from "@/hooks/useUserProgress";

interface QuestionCardProps {
  question: Question;
  onComplete: (correct: boolean, time: number) => void;
  onNext: () => void;
}

export function QuestionCard({ question, onComplete, onNext }: QuestionCardProps) {
  const { saveQuestionCompletion, toggleBookmark, bookmarkedQuestions } = useUserProgress();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  
  const isBookmarked = bookmarkedQuestions.has(question.id);

  // Reset state when question changes
  useEffect(() => {
    setSubmitted(false);
    setIsCorrect(null);
    setAnswer("");
    setIsRunning(true);
    setTimer(0);
    setHintsRevealed(0);
    setShowHints(false);
    setShowSolution(false);
    setAnswerRevealed(false);
  }, [question.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = (userAnswer: string): boolean => {
    if (question.answerType === 'number' && question.numericAnswer !== undefined) {
      const userNum = parseFloat(userAnswer);
      if (isNaN(userNum)) return false;
      const correctNum = question.numericAnswer;
      // Allow small tolerance for floating point comparisons
      return Math.abs(userNum - correctNum) < 0.0001;
    }
    return false;
  };

  const handleSubmit = async () => {
    if (question.answerType === 'number') {
      const correct = checkAnswer(answer);
      setIsCorrect(correct);
      setSubmitted(true);
      
      // Save completion to database
      try {
        const result = await saveQuestionCompletion(question.id, correct, timer);
        if (result?.error) {
          console.error('Error saving question completion:', result.error);
          toast.error("Failed to save progress. Please try again.", {
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error saving question completion:', error);
        toast.error("Failed to save progress. Please try again.", {
          duration: 3000,
        });
      }
      
      if (correct) {
        setIsRunning(false);
        toast.success("Correct!", {
          duration: 2000,
        });
        onComplete(true, timer);
      } else {
        toast.error("Incorrect. Try again.", {
          duration: 2000,
        });
        onComplete(false, timer);
      }
    }
  };

  const handleNext = () => {
    // Reset state for next question
    setSubmitted(false);
    setIsCorrect(null);
    setAnswer("");
    setIsRunning(true);
    setTimer(0);
    setHintsRevealed(0);
    setShowHints(false);
    onNext();
  };

  const revealNextHint = () => {
    if (hintsRevealed < question.hints.length) {
      setHintsRevealed((prev) => prev + 1);
      setShowHints(true);
    }
  };

  const handleBookmarkToggle = async () => {
    const result = await toggleBookmark(question.id);
    if (result?.error) {
      console.error('Bookmark error:', result.error);
      if (result.error.message?.includes('table not found') || result.error.message?.includes('does not exist')) {
        toast.error("Bookmarks table not found. Please run the migration.");
      } else {
        toast.error("Failed to update bookmark");
      }
    } else {
      toast.success(isBookmarked ? "Bookmark removed" : "Question bookmarked", { duration: 2000 });
    }
  };

  const handleRevealAnswer = () => {
    setShowRevealDialog(true);
  };

  const confirmRevealAnswer = () => {
    setAnswerRevealed(true);
    setShowSolution(true);
    setShowRevealDialog(false);
    setIsRunning(false);
    toast.info("Answer revealed", { duration: 2000 });
  };

  const getDifficultyVariant = (difficulty: number) => {
    if (difficulty <= 4) return "easy";
    if (difficulty <= 7) return "medium";
    if (difficulty <= 9) return "hard";
    return "extreme";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 4) return "Easy";
    if (difficulty <= 7) return "Medium";
    if (difficulty <= 9) return "Hard";
    return "Extreme";
  };

  const benchmarkComparison = timer < question.benchmarkTime 
    ? `${Math.round((question.benchmarkTime - timer) / question.benchmarkTime * 100)}% faster than average`
    : `${Math.round((timer - question.benchmarkTime) / question.benchmarkTime * 100)}% slower than average`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={getDifficultyVariant(question.difficulty) as any}>
            {getDifficultyLabel(question.difficulty)}
          </Badge>
          {question.firm && (
            <Badge variant="outline" className="text-xs">
              {question.firm}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            className="h-9 w-9 p-0"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </Button>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm ${
            submitted ? 'bg-secondary' : 'bg-primary/10 text-primary'
          }`}>
            <Clock className="w-4 h-4" />
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Question */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-2xl">{question.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground/90">
            {question.content}
          </p>
          
        </CardContent>
      </Card>

      {/* Hints */}
      {(!submitted || !isCorrect) && (
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-difficulty-medium" />
                <span className="font-medium">Hints</span>
                <span className="text-sm text-muted-foreground">
                  ({hintsRevealed}/{question.hints.length} revealed)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={revealNextHint}
                disabled={hintsRevealed >= question.hints.length}
              >
                {hintsRevealed < question.hints.length ? "Reveal Hint" : "No more hints"}
              </Button>
            </div>
            
            {showHints && hintsRevealed > 0 && (
              <ul className="space-y-2">
                {question.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <li 
                    key={index} 
                    className="p-3 rounded-lg bg-difficulty-medium/10 text-sm animate-fade-in"
                  >
                    💡 {hint}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Solution (if revealed) */}
      {answerRevealed && showSolution && (
        <Card variant="glass" className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-500" />
              Answer Revealed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Correct Answer:</p>
              <p className="text-lg text-yellow-400">{question.solution}</p>
            </div>
            {question.solutionSteps && question.solutionSteps.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Solution Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {question.solutionSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Answer Area */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium">Your Answer</label>
            {!submitted && !answerRevealed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevealAnswer}
                className="text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Reveal Answer
              </Button>
            )}
          </div>
          {question.answerType === 'number' ? (
            <Input
              type="number"
              value={answer}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty, negative numbers, decimals, and scientific notation
                if (value === '' || /^-?\d*\.?\d*([eE][-+]?\d+)?$/.test(value)) {
                  setAnswer(value);
                }
              }}
              placeholder="Enter a number..."
              className={`bg-secondary/50 border-border/50 text-lg ${
                submitted && isCorrect ? 'border-green-500/50' : 
                submitted && !isCorrect ? 'border-destructive/50' : ''
              }`}
              step="any"
              disabled={(submitted && isCorrect) || answerRevealed}
            />
          ) : (
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your reasoning and final answer here..."
              className="min-h-[150px] bg-secondary/50 border-border/50 resize-none"
              disabled={answerRevealed}
            />
          )}
          <div className="flex justify-end gap-3 mt-4">
            {submitted && !isCorrect && !answerRevealed && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setIsCorrect(null);
                  setAnswer("");
                  setIsRunning(true);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {submitted && isCorrect ? (
              <Button variant="hero" onClick={handleNext}>
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : answerRevealed ? (
              <Button variant="hero" onClick={handleNext}>
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="hero" 
                onClick={handleSubmit}
                disabled={question.answerType === 'number' && (!answer || answer.trim() === '')}
              >
                <Check className="w-4 h-4 mr-2" />
                Submit Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reveal Answer Confirmation Dialog */}
      <AlertDialog open={showRevealDialog} onOpenChange={setShowRevealDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reveal Answer?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reveal the answer? This will show you the solution and you won't be able to submit your own answer for this attempt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRevealAnswer}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Yes, Reveal Answer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
