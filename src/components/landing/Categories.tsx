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
  FunctionSquare
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
};

const colorMap: Record<string, string> = {
  logic: 'bg-category-logic/10 text-category-logic border-category-logic/30',
  probability: 'bg-category-probability/10 text-category-probability border-category-probability/30',
  estimation: 'bg-category-estimation/10 text-category-estimation border-category-estimation/30',
  strategy: 'bg-category-strategy/10 text-category-strategy border-category-strategy/30',
  math: 'bg-category-math/10 text-category-math border-category-math/30',
};

export function Categories() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Categories</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Master Every{' '}
            <span className="gradient-text">Puzzle Type</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From probability to market-making, we cover all the question types you'll face.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Brain;
            const colorClass = colorMap[category.color] || colorMap.logic;
            
            return (
              <Card 
                key={category.id}
                className={`group cursor-pointer border transition-all duration-300 hover:scale-[1.02] ${colorClass} hover:shadow-lg animate-scale-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-current/10">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm opacity-70">{category.count} puzzles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
