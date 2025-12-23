import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Lightbulb, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const practiceFeatures = [
  {
    icon: Building2,
    title: "Questions from Top Firms",
    description: "Practice with real interview questions from Citadel, Jane Street, Two Sigma, and other leading quantitative firms.",
  },
  {
    icon: Lightbulb,
    title: "Progressive Hints",
    description: "Get guided hints when you're stuck, helping you learn step-by-step without giving away the answer.",
  },
  {
    icon: BookOpen,
    title: "Detailed Solutions",
    description: "Understand every step with comprehensive explanations that teach you the underlying concepts.",
  },
];

export function PracticeShowcase() {
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

    const element = document.getElementById("practice-showcase");
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
    <section id="practice-showcase" className="py-16 md:py-24 bg-background relative overflow-hidden transition-all duration-500">
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Master Through{" "}
              <span className="gradient-text">Practice</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your skills with hundreds of carefully curated questions from top quantitative firms.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Screenshot Display */}
            <div className={cn(
              "transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className="relative rounded-xl overflow-hidden border-2 border-green-500/50 shadow-2xl">
                {/* Neon blur effect - green */}
                <div className="absolute inset-0 bg-green-500/30 blur-3xl animate-pulse pointer-events-none" />
                
                <img
                  src="/screenshot/pratice screen.png"
                  alt="Practice Screen"
                  className="w-full h-auto object-cover relative z-10"
                  loading="lazy"
                />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 border-2 border-green-500/50 rounded-xl animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Feature Boxes Below Screenshot */}
            <div className={cn(
              "mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {practiceFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 border-2 border-border bg-card hover:border-green-500 hover:bg-green-500/5 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-lg bg-muted group-hover:bg-green-500/10 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-primary group-hover:text-green-500 transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-green-500 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
