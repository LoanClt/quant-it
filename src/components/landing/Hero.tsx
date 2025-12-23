import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      {/* Subtle white blinking effects */}
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '-1s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '-2s' }} />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in">
            <Badge variant="glow" className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Questions from Jane Street, Citadel, Two Sigma, and more
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
            {/* Green neon blur effect behind text */}
            <div className="absolute -inset-16 bg-green-500/20 blur-3xl rounded-full animate-pulse pointer-events-none -z-10" />
            <span className="relative z-10">
              Master the{' '}
              <span className="gradient-text text-green-400">Brain Teasers</span>
              <br />
              That <span className="text-green-400">Land</span> Top <span className="text-green-400">Jobs</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Ace quant interviews with probability and brain teaser questions from top firms. 
            Practice with real interview questions and master the skills you need.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                Start Training
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
