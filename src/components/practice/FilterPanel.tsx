import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter, Bookmark } from "lucide-react";
import { categories } from "@/data/questions";
import { questions } from "@/data/questions";

const firms = Array.from(new Set(questions.map(q => q.firm).filter(Boolean))) as string[];

const difficultyOptions = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "extreme", label: "Extreme" },
];

interface FilterPanelProps {
  selectedCategory: string | null;
  selectedDifficulty: string;
  selectedFirm: string | null;
  showBookmarkedOnly: boolean;
  sortBy: string;
  onCategoryChange: (category: string | null) => void;
  onDifficultyChange: (difficulty: string) => void;
  onFirmChange: (firm: string | null) => void;
  onBookmarkedOnlyChange: (show: boolean) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
}

export function FilterPanel({
  selectedCategory,
  selectedDifficulty,
  selectedFirm,
  showBookmarkedOnly,
  sortBy,
  onCategoryChange,
  onDifficultyChange,
  onFirmChange,
  onBookmarkedOnlyChange,
  onSortChange,
  onClear,
}: FilterPanelProps) {
  const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== "all" || selectedFirm !== null || showBookmarkedOnly;

  return (
    <Card variant="glass" className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bookmarked Filter */}
        <div>
          <Button
            variant={showBookmarkedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => onBookmarkedOnlyChange(!showBookmarkedOnly)}
            className="w-full sm:w-auto"
          >
            <Bookmark className={`w-4 h-4 mr-2 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
            {showBookmarkedOnly ? "Show All Questions" : "Show Bookmarked Only"}
          </Button>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-xs transition-all hover:opacity-80"
              onClick={() => onCategoryChange(null)}
            >
              All
            </Badge>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <Badge
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 text-xs transition-all hover:opacity-80"
                  onClick={() => onCategoryChange(isSelected ? null : category.id)}
                >
                  {category.name}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Difficulty and Firm Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Firm Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Firm</label>
            <Select 
              value={selectedFirm || "all"} 
              onValueChange={(value) => onFirmChange(value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Firms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Firms</SelectItem>
                {firms.map((firm) => (
                  <SelectItem key={firm} value={firm}>
                    {firm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="difficulty-asc">Easy → Extreme</SelectItem>
              <SelectItem value="difficulty-desc">Extreme → Easy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}


