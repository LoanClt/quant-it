import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react";
import type { Question } from "@/data/questions";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserProgress } from "@/hooks/useUserProgress";
import { toast } from "sonner";

interface QuestionListProps {
  questions: Question[];
  onSelect: (question: Question) => void;
}

export function QuestionList({ questions, onSelect }: QuestionListProps) {
  const { isPaid } = useSubscription();
  const { completedQuestions, bookmarkedQuestions, toggleBookmark } = useUserProgress();

  const handleBookmarkClick = async (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation(); // Prevent card click
    const result = await toggleBookmark(questionId);
    if (result?.error) {
      toast.error("Failed to update bookmark");
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

  const getCategoryLabel = (category: string) => {
    if (category === 'probability') return 'Probability';
    if (category === 'brain-teaser') return 'Brain Teaser';
    return category;
  };


  return (
    <div className="grid gap-4">
      {questions.map((question, index) => {
        const isLocked = question.requiresPaid && !isPaid;
        const isCompleted = completedQuestions.has(question.id);
        const isBookmarked = bookmarkedQuestions.has(question.id);
        return (
          <Card
            key={question.id}
            variant="glass"
            className={`group cursor-pointer transition-all duration-300 animate-slide-up ${
              isLocked 
                ? 'opacity-75 border-dashed border-2 border-muted-foreground/50 hover:border-muted-foreground/70' 
                : isCompleted
                ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                : 'hover:border-primary/50'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onSelect(question)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getDifficultyVariant(question.difficulty) as any}>
                      {getDifficultyLabel(question.difficulty)}
                    </Badge>
                    <Badge variant={question.category as any}>
                      {getCategoryLabel(question.category)}
                    </Badge>
                    {isLocked && (
                      <Badge variant="outline" className="text-xs bg-muted/50">
                        <Lock className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {question.subcategory}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold transition-colors flex items-center gap-2 ${
                      isLocked 
                        ? 'text-muted-foreground' 
                        : isCompleted
                        ? 'text-green-400'
                        : 'group-hover:text-primary'
                    }`}>
                      {question.title}
                      {isLocked && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      {isCompleted && !isLocked && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 transition-opacity ${
                        isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => handleBookmarkClick(e, question.id)}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {question.firm && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {question.firm}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center transition-opacity ${
                  isLocked 
                    ? 'text-muted-foreground' 
                    : isCompleted
                    ? 'text-green-400 opacity-100'
                    : 'text-primary opacity-0 group-hover:opacity-100'
                }`}>
                  <span className="text-sm mr-2">
                    {isLocked ? 'Locked' : isCompleted ? 'Completed' : 'Solve'}
                  </span>
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
