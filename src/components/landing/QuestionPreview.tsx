import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { questions } from "@/data/questions";

// Get a medium difficulty question (difficulty 5-7)
const getMediumQuestion = () => {
  return questions.find(q => q.difficulty >= 5 && q.difficulty <= 7) || questions[10];
};

const previewQuestion = getMediumQuestion();

export function QuestionPreview() {
  const [answer, setAnswer] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
    if (hintsRevealed < previewQuestion.hints.length) {
      setHintsRevealed((prev) => prev + 1);
      setShowHints(true);
    }
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
              <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                {previewQuestion.content}
              </p>

              {/* Answer Input */}
              <div className="mb-6">
                <label className="block mb-3 font-medium">Your Answer</label>
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
                  disabled={submitted && isCorrect}
                />
                {submitted && !isCorrect && (
                  <p className="text-sm text-destructive mt-2">
                    Incorrect. Try again or sign up to see the solution.
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
                    disabled={!answer || answer.trim() === ''}
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
                      <span className="text-sm text-muted-foreground">
                        ({hintsRevealed}/{previewQuestion.hints.length} revealed)
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={revealNextHint}
                      disabled={hintsRevealed >= previewQuestion.hints.length}
                    >
                      {hintsRevealed < previewQuestion.hints.length ? "Reveal Hint" : "No more hints"}
                    </Button>
                  </div>
                  
                  {showHints && hintsRevealed > 0 && (
                    <ul className="space-y-2">
                      {previewQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
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

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" className="flex-1" asChild>
                  <Link to="/pricing">
                    {submitted && isCorrect ? "Sign Up for More Questions" : "Sign Up to Access All Questions"}
                    <Check className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/practice">
                    View All Questions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

