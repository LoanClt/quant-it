import { useState, useMemo, useEffect, useRef } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { FilterPanel } from "@/components/practice/FilterPanel";
import { QuestionList } from "@/components/practice/QuestionList";
import { questions, type Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shuffle, Lock, Search } from "lucide-react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserProgress } from "@/hooks/useUserProgress";

type SortOption = "difficulty-asc" | "difficulty-desc" | "default";

const getDifficultyLevel = (difficulty: number): string => {
  if (difficulty <= 4) return "easy";
  if (difficulty <= 7) return "medium";
  if (difficulty <= 9) return "hard";
  return "extreme";
};

export default function Practice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isPaid } = useSubscription();
  const { refetch, bookmarkedQuestions, completedQuestions } = useUserProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const prevLocationKey = useRef<string | undefined>(location.key);

  // Initialize difficulty from URL params
  useEffect(() => {
    const difficultyParam = searchParams.get('difficulty');
    if (difficultyParam && ['easy', 'medium', 'hard', 'extreme'].includes(difficultyParam)) {
      setSelectedDifficulty(difficultyParam);
    }
  }, [searchParams]);

  // Clear active question when navigating to practice page (e.g., clicking Practice in navbar)
  useEffect(() => {
    // If we're on /practice route and location key changed (indicating navigation)
    // Clear the active question to return to the list view
    if (location.pathname === '/practice') {
      // If location key changed, it's a new navigation
      if (location.key !== prevLocationKey.current) {
        // Only clear if there's no question in URL params
        if (!searchParams.get('question')) {
          setActiveQuestion(null);
        }
        prevLocationKey.current = location.key;
      }
    }
  }, [location.key, location.pathname, searchParams]);

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    // Filter by search query (by title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((q) => 
        q.title.toLowerCase().includes(query)
      );
    }

    // Filter by bookmarked only
    if (showBookmarkedOnly) {
      filtered = filtered.filter((q) => bookmarkedQuestions.has(q.id));
    }

    // Show all questions (including paid ones) so users can see what's locked
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((q) => getDifficultyLevel(q.difficulty) === selectedDifficulty);
    }

    // Filter by firm
    if (selectedFirm) {
      filtered = filtered.filter((q) => q.firm === selectedFirm);
    }

    // Sort by difficulty
    if (sortBy === "difficulty-asc") {
      filtered = [...filtered].sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortBy === "difficulty-desc") {
      filtered = [...filtered].sort((a, b) => b.difficulty - a.difficulty);
    }

    return filtered;
  }, [selectedCategory, selectedDifficulty, selectedFirm, sortBy, showBookmarkedOnly, bookmarkedQuestions, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty("all");
    setSelectedFirm(null);
    setShowBookmarkedOnly(false);
    setSortBy("default");
    setSearchQuery("");
  };

  const handleQuestionComplete = async (correct: boolean, time: number) => {
    // Refetch progress to update completed questions list
    if (correct) {
      await refetch();
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuestion) return;
    const currentIndex = filteredQuestions.findIndex((q) => q.id === activeQuestion.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    setActiveQuestion(filteredQuestions[nextIndex]);
  };

  const handlePreviousQuestion = () => {
    if (!activeQuestion) return;
    const currentIndex = filteredQuestions.findIndex((q) => q.id === activeQuestion.id);
    if (currentIndex === -1) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredQuestions.length - 1;
    setActiveQuestion(filteredQuestions[prevIndex]);
  };

  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setActiveQuestion(filteredQuestions[randomIndex]);
  };

  if (activeQuestion) {
    // Check if question requires paid access
    if (activeQuestion.requiresPaid && !isPaid) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container px-4 pt-24 pb-12">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setActiveQuestion(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Questions
            </Button>
            
            <Card variant="glass" className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">Premium Question</h2>
                <p className="text-muted-foreground mb-6">
                  This question is available for premium members only.
                </p>
                <Button variant="hero" onClick={() => navigate('/pricing')}>
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-12">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setActiveQuestion(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Questions
          </Button>
          
          {(() => {
            const currentQuestionIndex = filteredQuestions.findIndex((q) => q.id === activeQuestion.id);
            return (
              <QuestionCard
                key={activeQuestion.id}
                question={activeQuestion}
                onComplete={handleQuestionComplete}
                onNext={handleNextQuestion}
                onPrevious={handlePreviousQuestion}
                currentIndex={currentQuestionIndex}
                totalQuestions={filteredQuestions.length}
                isCompleted={completedQuestions.has(activeQuestion.id)}
              />
            );
          })()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Practice</h1>
          <Button variant="outline" size="sm" onClick={handleRandomQuestion}>
            <Shuffle className="w-4 h-4 mr-2" />
            Random
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search problems by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          selectedFirm={selectedFirm}
          showBookmarkedOnly={showBookmarkedOnly}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
          onFirmChange={setSelectedFirm}
          onBookmarkedOnlyChange={setShowBookmarkedOnly}
          onSortChange={(value) => setSortBy(value as SortOption)}
          onClear={handleClearFilters}
        />

        {/* Question List */}
        <QuestionList
          questions={filteredQuestions}
          onSelect={setActiveQuestion}
        />
      </main>
    </div>
  );
}
