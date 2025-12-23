import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight, Play, Clock, Heart, Timer, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const challengeFeatures = [
  {
    icon: Timer,
    title: "30 Minutes",
    description: "Complete 3 questions under time pressure, just like in real interviews.",
  },
  {
    icon: Target,
    title: "3 Lives System",
    description: "Wrong answers cost you a life. Master precision and accuracy.",
  },
  {
    icon: Award,
    title: "Score Tracking",
    description: "Track your performance and compete with yourself to improve.",
  },
];

export function ChallengeShowcase() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const element = document.getElementById("challenge-showcase");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="challenge-showcase" className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden transition-all duration-500">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-2s' }} />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={cn(
            "text-center mb-12 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Badge variant="glow" className="mb-4 px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Premium Feature
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Test Your Skills with{" "}
              <span className="gradient-text">Company Challenges</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Face 3 questions in 30 minutes. Prove you can handle the pressure of real interviews.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Challenge Preview Mockup */}
              <div className={cn(
                "transition-all duration-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <Card className="border-2 border-green-500/50 bg-gradient-to-br from-card to-muted/30 shadow-2xl shadow-green-500/20 overflow-hidden relative">
                  {/* Subtle green neon blur effect */}
                  <div className="absolute -inset-20 bg-green-500/10 blur-3xl animate-pulse pointer-events-none opacity-50" />
                  
                  <div className="relative z-10 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        Citadel Challenge
                      </Badge>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          <span className="font-mono font-bold">29:45</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Heart
                              key={i}
                              className="w-5 h-5 text-red-500 fill-red-500"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>1 / 3</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: "33%" }} />
                      </div>
                    </div>

                    {/* Question Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">Coin Flip Probability</h3>
                        <Badge variant="outline">EASY</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        You flip a fair coin 3 times. What is the probability of getting exactly 2 heads?
                      </p>
                      
                      {/* Hints section */}
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Hints</span>
                          <span className="text-xs text-muted-foreground">0 / 3 used</span>
                        </div>
                      </div>

                      {/* Answer input */}
                      <div className="space-y-2">
                        <input
                          type="number"
                          placeholder="Enter your answer"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                          disabled
                        />
                        <Button className="w-full" disabled>
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feature Boxes Next to Mockup */}
              <div className={cn(
                "space-y-6 transition-all duration-1000 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                {challengeFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="p-6 border-2 border-border bg-card hover:border-green-500 hover:bg-green-500/5 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted group-hover:bg-green-500/10 transition-colors duration-300 flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary group-hover:text-green-500 transition-colors duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-green-500 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* CTA Button */}
            <div className={cn(
              "mt-12 text-center transition-all duration-1000 delay-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <Button
                variant="hero"
                size="lg"
                className="group relative overflow-hidden"
                asChild
              >
                <Link to="/challenge">
                  {/* Neon blur effect on button */}
                  <div className="absolute inset-0 bg-green-500/20 blur-xl animate-pulse pointer-events-none" />
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform relative z-10" />
                  <span className="relative z-10">Start Your First Challenge</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
