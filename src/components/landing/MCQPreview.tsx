import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Check, Eye, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { questions } from "@/data/questions";
import { LatexRenderer } from "@/components/LatexRenderer";
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

// Get an MCQ question (market-oriented)
const getMcqQuestion = () => {
  return questions.find(q => q.id === "st4" || (q.answerType === "mcq" && q.category === "sales-and-trading")) || questions.find(q => q.answerType === "mcq") || questions[0];
};

const mcqQuestion = getMcqQuestion();

export function MCQPreview() {
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const checkAnswer = (userAnswer: string | null): boolean => {
    if (mcqQuestion.answerType === 'mcq' && mcqQuestion.correctAnswerId !== undefined) {
      return userAnswer === mcqQuestion.correctAnswerId;
    }
    return false;
  };

  const handleSubmit = () => {
    if (mcqQuestion.answerType === 'mcq') {
      if (!selectedMcqOption) {
        toast.error("Please select an answer");
        return;
      }
      const correct = checkAnswer(selectedMcqOption);
      setIsCorrect(correct);
      setSubmitted(true);
      
      if (correct) {
        toast.success("Correct!", {
          duration: 2000,
        });
      } else {
        toast.error("Incorrect. Try again.", {
          duration: 2000,
        });
      }
    }
  };

  const revealNextHint = () => {
    // On landing page, allow all users to see all hints
    const maxHints = mcqQuestion.hints.length;
    if (hintsRevealed < maxHints) {
      setHintsRevealed((prev) => prev + 1);
      setShowHints(true);
    }
  };

  const handleRevealAnswer = () => {
    setShowRevealDialog(true);
  };

  const confirmRevealAnswer = () => {
    setAnswerRevealed(true);
    setShowSolution(true);
    setShowRevealDialog(false);
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

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden transition-all duration-500">
      {/* Subtle white blinking effects */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-0.5s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-1.5s' }} />
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 relative">
            {/* White blur blinking effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Market-Oriented Question
            </h2>
            <p className="text-lg text-muted-foreground">
              Try a multiple-choice question from sales & trading interviews
            </p>
          </div>

          <Card variant="glass" className="mb-6 relative overflow-hidden">
            {/* Subtle neon blur effects in background only */}
            {submitted && isCorrect && (
              <div className="absolute -inset-20 bg-green-500/10 blur-3xl animate-pulse pointer-events-none opacity-50" />
            )}
            {submitted && isCorrect === false && (
              <div className="absolute -inset-20 bg-red-500/10 blur-3xl animate-pulse pointer-events-none opacity-50" />
            )}
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={getDifficultyVariant(mcqQuestion.difficulty) as any}>
                  {getDifficultyLabel(mcqQuestion.difficulty)}
                </Badge>
                {mcqQuestion.firm && (
                  <Badge variant="outline" className="text-xs">
                    {mcqQuestion.firm}
                  </Badge>
                )}
                <Badge variant="sales-and-trading" className="text-xs">
                  Markets
                </Badge>
              </div>
              <CardTitle className="text-2xl">{mcqQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-lg leading-relaxed text-foreground/90 mb-6">
                <LatexRenderer content={mcqQuestion.content} />
              </div>

              {/* MCQ Options */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium">Your Answer</label>
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
                {mcqQuestion.answerType === 'mcq' && mcqQuestion.mcqOptions ? (
                  <div className="space-y-3">
                    {mcqQuestion.mcqOptions.map((option) => {
                      const isSelected = selectedMcqOption === option.id;
                      const isCorrectOption = option.id === mcqQuestion.correctAnswerId;
                      const showResult = submitted || answerRevealed;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (!submitted && !answerRevealed) {
                              setSelectedMcqOption(option.id);
                            }
                          }}
                          disabled={submitted || answerRevealed}
                          className={`
                            w-full p-4 rounded-lg border-2 text-left transition-all duration-300
                            ${
                              showResult && isCorrectOption
                                ? 'border-green-500 bg-green-500/10'
                                : showResult && isSelected && !isCorrectOption
                                ? 'border-red-500 bg-red-500/10'
                                : isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary'
                            }
                            ${submitted || answerRevealed ? 'cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                              ${
                                showResult && isCorrectOption
                                  ? 'border-green-500 bg-green-500'
                                  : showResult && isSelected && !isCorrectOption
                                  ? 'border-red-500 bg-red-500'
                                  : isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-border'
                              }
                            `}>
                              {isSelected && (
                                <div className={`
                                  w-3 h-3 rounded-full
                                  ${showResult && !isCorrectOption ? 'bg-white' : 'bg-background'}
                                `} />
                              )}
                              {showResult && isCorrectOption && !isSelected && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                              {showResult && isSelected && !isCorrectOption && (
                                <X className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-medium">{option.id.toUpperCase()}. {option.label}</span>
                            {showResult && isCorrectOption && (
                              <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-400 border-green-500/30">
                                Correct
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                {submitted && !isCorrect && !answerRevealed && (
                  <p className="text-sm text-destructive mt-2">
                    Incorrect. Try again or reveal the answer.
                  </p>
                )}
                {submitted && isCorrect && (
                  <p className="text-sm text-green-500 mt-2">
                    Correct! Sign up to access all questions.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              {!submitted || !isCorrect ? (
                <div className="mb-6">
                  <Button 
                    variant="hero" 
                    onClick={handleSubmit}
                    disabled={!selectedMcqOption || answerRevealed}
                    className="w-full"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Check Answer
                  </Button>
                </div>
              ) : null}

              {/* Hints */}
              <Card variant="glass" className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-difficulty-medium" />
                      <span className="font-medium">Hints</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        ({hintsRevealed}/{mcqQuestion.hints.length} revealed)
                      </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={revealNextHint}
                      disabled={hintsRevealed >= mcqQuestion.hints.length}
                    >
                      {hintsRevealed < mcqQuestion.hints.length ? "Reveal Hint" : "No more hints"}
                    </Button>
                    </div>
                  </div>
                  
                  {showHints && hintsRevealed > 0 && (
                    <ul className="space-y-2">
                      {mcqQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
                        <li 
                          key={index} 
                          className="p-3 rounded-lg bg-difficulty-medium/10 text-sm animate-fade-in"
                        >
                          💡 <LatexRenderer content={hint} />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Solution (if revealed) */}
              {answerRevealed && showSolution && (
                <Card variant="glass" className="border-yellow-500/30 bg-yellow-500/5 mb-6">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Eye className="w-5 h-5 text-yellow-500" />
                      Answer Revealed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Correct Answer:</p>
                      <p className="text-lg text-yellow-400"><LatexRenderer content={mcqQuestion.solution} /></p>
                    </div>
                    {mcqQuestion.solutionSteps && mcqQuestion.solutionSteps.length > 0 && (
                      <div>
                        <p className="font-semibold mb-2">Solution Steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {mcqQuestion.solutionSteps.map((step, index) => (
                            <li key={index}><LatexRenderer content={step} /></li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/pricing">
                    {submitted && isCorrect ? "Sign Up for More Questions" : "Sign Up to Access All Questions"}
                    <Check className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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

    </section>
  );
}
