import { useState, useMemo, useEffect, useRef } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { QuestionCard } from "@/components/practice/QuestionCard";
import { CompactFilters } from "@/components/practice/CompactFilters";
import { QuestionList } from "@/components/practice/QuestionList";
import { questions, type Question } from "@/data/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { ArrowLeft, Shuffle, Lock, Search, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const prevLocationKey = useRef<string | undefined>(location.key);
  
  const QUESTIONS_PER_PAGE = 30;

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

    // Filter by difficulty FIRST (before sorting)
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((q) => getDifficultyLevel(q.difficulty) === selectedDifficulty);
    }

    // Filter by firm
    if (selectedFirm) {
      filtered = filtered.filter((q) => q.firm === selectedFirm);
    }

    // Sort by difficulty (only applies to filtered results)
    // When a single difficulty is selected, sorting still works but only within that difficulty
    if (sortBy === "difficulty-asc") {
      filtered = [...filtered].sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortBy === "difficulty-desc") {
      filtered = [...filtered].sort((a, b) => b.difficulty - a.difficulty);
    }

    return filtered;
  }, [selectedCategory, selectedDifficulty, selectedFirm, sortBy, showBookmarkedOnly, bookmarkedQuestions, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDifficulty, selectedFirm, showBookmarkedOnly, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty("all");
    setSelectedFirm(null);
    setShowBookmarkedOnly(false);
    setSortBy("default");
    setSearchQuery("");
    setCurrentPage(1);
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
        <div className="mb-4">
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

        {/* Quick Filters Below Search */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Show Bookmarked Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bookmarked-only"
              checked={showBookmarkedOnly}
              onCheckedChange={(checked) => setShowBookmarkedOnly(checked === true)}
            />
            <Label
              htmlFor="bookmarked-only"
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Bookmark className={`w-4 h-4 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
              Show Bookmarked Only
            </Label>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="difficulty-filter" className="text-sm font-medium whitespace-nowrap">
              Difficulty:
            </Label>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger id="difficulty-filter" className="w-[180px]">
                {selectedDifficulty === "all" ? (
                  <SelectValue placeholder="All Difficulties" />
                ) : (
                  <div className="flex items-center w-full">
                    <Badge variant={selectedDifficulty as any} className="text-xs">
                      {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                    </Badge>
                  </div>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="text-sm">All Difficulties</span>
                </SelectItem>
                <SelectItem value="easy">
                  <Badge variant="easy" className="text-xs">Easy</Badge>
                </SelectItem>
                <SelectItem value="medium">
                  <Badge variant="medium" className="text-xs">Medium</Badge>
                </SelectItem>
                <SelectItem value="hard">
                  <Badge variant="hard" className="text-xs">Hard</Badge>
                </SelectItem>
                <SelectItem value="extreme">
                  <Badge variant="extreme" className="text-xs">Extreme</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compact Filters Dropdown */}
        <CompactFilters
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

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedQuestions.length > 0 ? (currentPage - 1) * QUESTIONS_PER_PAGE + 1 : 0} - {Math.min(currentPage * QUESTIONS_PER_PAGE, filteredQuestions.length)} of {filteredQuestions.length} problems
        </div>

        {/* Pagination - Top */}
        {totalPages > 1 && (
          <div className="mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {/* Page Numbers */}
                {(() => {
                  const pages: (number | 'ellipsis')[] = [];
                  
                  if (totalPages <= 7) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);
                    
                    if (currentPage > 3) {
                      pages.push('ellipsis');
                    }
                    
                    // Show pages around current
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(i);
                      }
                    }
                    
                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis');
                    }
                    
                    // Always show last page
                    pages.push(totalPages);
                  }
                  
                  return pages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "outline" : "ghost"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className="h-9 w-9"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    );
                  });
                })()}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Question List */}
        <QuestionList
          questions={paginatedQuestions}
          onSelect={setActiveQuestion}
        />

        {/* Pagination - Bottom */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {/* Page Numbers */}
                {(() => {
                  const pages: (number | 'ellipsis')[] = [];
                  
                  if (totalPages <= 7) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);
                    
                    if (currentPage > 3) {
                      pages.push('ellipsis');
                    }
                    
                    // Show pages around current
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = start; i <= end; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(i);
                      }
                    }
                    
                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis');
                    }
                    
                    // Always show last page
                    pages.push(totalPages);
                  }
                  
                  return pages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={page}>
                        <Button
                          variant={currentPage === page ? "outline" : "ghost"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className="h-9 w-9"
                        >
                          {page}
                        </Button>
                      </PaginationItem>
                    );
                  });
                })()}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
