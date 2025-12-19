import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  CheckCircle2,
  Zap,
  Award,
  BarChart3,
  Users
} from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Real Interview Questions",
    description: "40+ questions from actual interviews at Jane Street, Citadel, Two Sigma, Goldman Sachs, and Morgan Stanley."
  },
  {
    icon: Brain,
    title: "Probability & Brain Teasers",
    description: "Master the two core question types that appear in every quant interview."
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor completion rates for Easy, Medium, Hard, and Extreme difficulty levels."
  },
  {
    icon: CheckCircle2,
    title: "Instant Feedback",
    description: "Get immediate validation on your answers with clear correct/incorrect feedback."
  },
  {
    icon: Zap,
    title: "Progressive Hints",
    description: "Reveal hints one by one to guide your thinking without giving away the answer."
  },
  {
    icon: Award,
    title: "Difficulty Levels",
    description: "Questions ranked from Easy to Extreme to match your skill level and preparation stage."
  },
  {
    icon: BarChart3,
    title: "Filter & Sort",
    description: "Find questions by difficulty, category, firm, or sort by complexity."
  },
  {
    icon: Users,
    title: "Firm-Specific Practice",
    description: "Practice with questions that actually appeared at your target companies."
  }
];

export function Benefits() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You Get
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to ace your quant interview
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  variant="glass" 
                  className="hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

