import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { categories } from "@/data/questions";
import { questions } from "@/data/questions";
import { Badge } from "@/components/ui/badge";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const firms = Array.from(new Set(questions.map(q => q.firm).filter(Boolean))) as string[];

const difficultyOptions = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "extreme", label: "Extreme" },
];

interface CompactFiltersProps {
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

const SortOptionContent = ({ value }: { value: string }) => {
  if (value === "default") {
    return <span>Default</span>;
  }
  if (value === "difficulty-asc") {
    return (
      <div className="flex items-center gap-1.5">
        <Badge variant="easy" className="text-xs px-1.5 py-0">Easy</Badge>
        <span className="text-xs">→</span>
        <Badge variant="medium" className="text-xs px-1.5 py-0">Medium</Badge>
        <span className="text-xs">→</span>
        <Badge variant="hard" className="text-xs px-1.5 py-0">Hard</Badge>
        <span className="text-xs">→</span>
        <Badge variant="extreme" className="text-xs px-1.5 py-0">Extreme</Badge>
      </div>
    );
  }
  if (value === "difficulty-desc") {
    return (
      <div className="flex items-center gap-1.5">
        <Badge variant="extreme" className="text-xs px-1.5 py-0">Extreme</Badge>
        <span className="text-xs">→</span>
        <Badge variant="hard" className="text-xs px-1.5 py-0">Hard</Badge>
        <span className="text-xs">→</span>
        <Badge variant="medium" className="text-xs px-1.5 py-0">Medium</Badge>
        <span className="text-xs">→</span>
        <Badge variant="easy" className="text-xs px-1.5 py-0">Easy</Badge>
      </div>
    );
  }
  return <span>{value}</span>;
};

const CustomSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    {children}
  </SelectPrimitive.Item>
));
CustomSelectItem.displayName = "CustomSelectItem";

export function CompactFilters({
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
}: CompactFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilters = selectedCategory !== null || selectedDifficulty !== "all" || selectedFirm !== null || showBookmarkedOnly || sortBy !== "default";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                Active
              </Badge>
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
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

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                {sortBy === "default" ? (
                  <SelectValue placeholder="Select sort order">Default</SelectValue>
                ) : (
                  <div className="flex items-center w-full">
                    <SortOptionContent value={sortBy} />
                  </div>
                )}
              </SelectTrigger>
              <SelectContent>
                <CustomSelectItem value="default">
                  <SortOptionContent value="default" />
                </CustomSelectItem>
                <CustomSelectItem value="difficulty-asc">
                  <SortOptionContent value="difficulty-asc" />
                </CustomSelectItem>
                <CustomSelectItem value="difficulty-desc">
                  <SortOptionContent value="difficulty-desc" />
                </CustomSelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
