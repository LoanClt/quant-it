import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BarChart3, 
  Target, 
  Mic, 
  Zap, 
  Trophy,
  Clock,
  Lightbulb
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "500+ Expert-Curated Puzzles",
    description: "Logic, probability, estimation, market-making, and more. Each with step-by-step solutions.",
    badge: "Core",
  },
  {
    icon: BarChart3,
    title: "Smart Progress Tracking",
    description: "Per-skill mastery scores, speed metrics, accuracy by difficulty, and weak-spot detection.",
    badge: "Analytics",
  },
  {
    icon: Target,
    title: "Adaptive Learning Paths",
    description: "AI adjusts difficulty based on your performance. Focus on what matters most.",
    badge: "AI-Powered",
  },
  {
    icon: Mic,
    title: "Interview Simulation",
    description: "Timed sessions, verbal instructions, audio recording, and AI feedback on your reasoning.",
    badge: "Premium",
  },
  {
    icon: Zap,
    title: "Daily Challenges",
    description: "Fresh puzzles every day. Streaks, XP, and leaderboards to keep you motivated.",
    badge: "Gamification",
  },
  {
    icon: Lightbulb,
    title: "Detailed Solutions",
    description: "Step-by-step breakdowns, common mistakes to avoid, and benchmark times.",
    badge: "Learning",
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From first puzzle to final interview, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="glass"
              className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
