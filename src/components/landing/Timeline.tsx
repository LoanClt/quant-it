import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  title: string;
  description: string;
  image?: string;
}

const steps: TimelineStep[] = [
  {
    title: "Joining QuantIt",
    description: "Start your journey by creating an account and exploring our comprehensive question bank from top quant firms.",
  },
  {
    title: "Practicing",
    description: "Work through questions of increasing difficulty, use progressive hints, and track your progress in real-time.",
    image: "/screenshot/pratice screen.png",
  },
  {
    title: "Follow-up Advice to Get into Top Form",
    description: "Receive personalized feedback, learn from detailed solutions, and identify areas for improvement.",
  },
  {
    title: "Get the Offer",
    description: "Master the skills needed to ace your interviews and land your dream job at top quantitative trading firms.",
  },
];

export function Timeline() {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSteps((prev) => new Set([...prev, index]));
            }
          });
        },
        {
          threshold: 0.3, // Trigger when 30% of the element is visible
          rootMargin: "-50px 0px", // Start animation slightly before element is fully visible
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden transition-all duration-500">
      {/* Subtle white blinking effects */}
      <div className="absolute top-1/4 right-1/3 w-44 h-44 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-0.3s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-52 h-52 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '-1.8s' }} />
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Path to Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these steps to master quantitative interviews
            </p>
          </div>

          <div className="relative">
            {/* Vertical line base */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border/30 transform md:-translate-x-1/2" />
            
            {/* Progressive green fill */}
            <div className="absolute left-8 md:left-1/2 top-0 w-1 bg-green-500 transform md:-translate-x-1/2 transition-all duration-1000 ease-out"
              style={{
                height: `${(visibleSteps.size / steps.length) * 100}%`,
              }}
            />

            {/* Timeline steps */}
            <div className="space-y-16 md:space-y-20">
              {steps.map((step, index) => {
                const isVisible = visibleSteps.has(index);

                return (
                  <div
                    key={index}
                    ref={(el) => {
                      stepRefs.current[index] = el;
                    }}
                    className="relative flex flex-col md:flex-row items-start gap-6 md:gap-8"
                  >
                    {/* Circle indicator - just a dot */}
                    <div className="relative z-20 flex-shrink-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                      <div
                        className={cn(
                          "w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-700",
                          isVisible
                            ? "bg-green-500 scale-125 shadow-lg shadow-green-500/50"
                            : "bg-muted-foreground/30 scale-100"
                        )}
                      />
                    </div>

                    {/* Content card */}
                    <div
                      className={cn(
                        "flex-1 pt-2 transition-all duration-700 md:ml-auto md:w-[calc(50%-60px)]",
                        index % 2 === 0 ? "md:mr-auto md:ml-0" : "",
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-50 translate-y-8"
                      )}
                    >
                      <div
                        className={cn(
                          "p-6 md:p-8 rounded-xl border-2 transition-all duration-700 shadow-lg relative overflow-hidden",
                          isVisible
                            ? "border-green-500 bg-card shadow-green-500/20"
                            : "border-border bg-muted/30"
                        )}
                      >
                        {/* Green neon blur effect below box when visible */}
                        {isVisible && (
                          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-green-500/20 blur-3xl animate-pulse pointer-events-none" />
                        )}
                        <h3
                          className={cn(
                            "text-xl md:text-2xl font-bold mb-3 transition-colors duration-500",
                            isVisible ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={cn(
                            "text-sm md:text-base mb-4 transition-colors duration-500",
                            isVisible
                              ? "text-muted-foreground"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {step.description}
                        </p>
                        
                        {/* Screenshot for practicing step */}
                        {step.image && (
                          <div className={cn(
                            "mt-6 rounded-lg overflow-hidden border transition-all duration-700",
                            isVisible
                              ? "border-green-500/50 shadow-lg shadow-green-500/20"
                              : "border-border opacity-60"
                          )}>
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
