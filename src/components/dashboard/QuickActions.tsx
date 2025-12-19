import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Target, Zap, Timer } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Daily Challenge",
    description: "5 curated puzzles for today",
    icon: Zap,
    badge: "+50 XP",
    color: "text-difficulty-medium",
    bgColor: "bg-difficulty-medium/10",
    link: "/practice",
  },
  {
    title: "Fix Weaknesses",
    description: "Focus on probability & strategy",
    icon: Target,
    badge: "Recommended",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    link: "/practice",
  },
  {
    title: "Interview Mode",
    description: "Timed mixed-category session",
    icon: Timer,
    badge: "Premium",
    color: "text-accent",
    bgColor: "bg-accent/10",
    link: "/practice",
  },
  {
    title: "Random Puzzle",
    description: "Surprise me with anything",
    icon: Brain,
    badge: null,
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/practice",
  },
];

export function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Card 
          key={action.title}
          variant="glass"
          className="group hover:border-primary/50 transition-all duration-300 cursor-pointer animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-5">
            <Link to={action.link} className="block">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${action.bgColor}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                {action.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              
              <div className="flex items-center text-sm text-primary group-hover:gap-2 transition-all">
                <span>Start</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
