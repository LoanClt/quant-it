import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/questions";
import { 
  Brain, 
  Percent, 
  Calculator, 
  Target, 
  Zap, 
  Grid3X3, 
  Lightbulb,
  FunctionSquare,
  FlaskConical
} from "lucide-react";

const iconMap: Record<string, any> = {
  Brain,
  Percent,
  Calculator,
  Target,
  Zap,
  Grid3X3,
  Lightbulb,
  FunctionSquare,
  FlaskConical,
};

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
        onClick={() => onSelect(null)}
      >
        All Categories
      </Badge>
      
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || Brain;
        const isSelected = selected === category.id;
        
        return (
          <Badge
            key={category.id}
            variant={isSelected ? category.color as any : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
              isSelected ? '' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => onSelect(isSelected ? null : category.id)}
          >
            <Icon className="w-3 h-3 mr-1.5" />
            {category.name}
          </Badge>
        );
      })}
    </div>
  );
}
