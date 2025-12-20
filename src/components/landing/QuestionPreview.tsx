import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Check, Eye, Lock } from "lucide-react";
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

// Get the Ants on a Square question
const getAntsQuestion = () => {
  return questions.find(q => q.id === "q37") || questions[0];
};

const previewQuestion = getAntsQuestion();

export function QuestionPreview() {
  const [answer, setAnswer] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRevealDialog, setShowRevealDialog] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const checkAnswer = (userAnswer: string): boolean => {
    if (previewQuestion.answerType === 'number' && previewQuestion.numericAnswer !== undefined) {
      const userNum = parseFloat(userAnswer);
      if (isNaN(userNum)) return false;
      const correctNum = previewQuestion.numericAnswer;
      // Allow small tolerance for floating point comparisons
      return Math.abs(userNum - correctNum) < 0.0001;
    }
    return false;
  };

  const handleSubmit = () => {
    if (previewQuestion.answerType === 'number') {
      const correct = checkAnswer(answer);
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
    // Free users can only reveal 1 hint
    const maxHints = 1;
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
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try a Question
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience our platform with a real interview question
            </p>
          </div>

          <Card variant="glass" className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={getDifficultyVariant(previewQuestion.difficulty) as any}>
                  {getDifficultyLabel(previewQuestion.difficulty)}
                </Badge>
                {previewQuestion.firm && (
                  <Badge variant="outline" className="text-xs">
                    {previewQuestion.firm}
                  </Badge>
                )}
                <Badge variant={previewQuestion.category as any}>
                  {previewQuestion.category === 'probability' ? 'Probability' : 'Brain Teaser'}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{previewQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg leading-relaxed text-foreground/90 mb-6">
                <LatexRenderer content={previewQuestion.content} />
              </div>

              {/* Answer Input */}
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
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => {
                    const value = e.target.value;
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
                    disabled={(!answer || answer.trim() === '') || answerRevealed}
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
                        {hintsRevealed < 1 ? "1 free hint remaining" : "None free hints remaining"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={revealNextHint}
                        disabled={hintsRevealed >= 1}
                      >
                        {hintsRevealed < 1 ? "Reveal Hint" : "Upgrade for more hints"}
                      </Button>
                    </div>
                  </div>
                  
                  {showHints && hintsRevealed > 0 && (
                    <ul className="space-y-2">
                      {previewQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
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
                      <p className="text-lg text-yellow-400"><LatexRenderer content={previewQuestion.solution} /></p>
                    </div>
                    {previewQuestion.solutionSteps && previewQuestion.solutionSteps.length > 0 && (
                      <div>
                        <p className="font-semibold mb-2">Solution Steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {previewQuestion.solutionSteps.map((step, index) => (
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

