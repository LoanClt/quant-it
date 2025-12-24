import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { Features } from "@/components/landing/Features";
import { Categories } from "@/components/landing/Categories";
import { Benefits } from "@/components/landing/Benefits";
import { PracticeShowcase } from "@/components/landing/PracticeShowcase";
import { ChallengeShowcase } from "@/components/landing/ChallengeShowcase";
import { QuestionPreview } from "@/components/landing/QuestionPreview";
import { MCQPreview } from "@/components/landing/MCQPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { Timeline } from "@/components/landing/Timeline";
import { Pricing as LandingPricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CompanyLogos />

      <Section>
        <QuestionPreview />
      </Section>
      <Section>
        <MCQPreview />
      </Section>
      <Section>
        <PracticeShowcase />
      </Section>
      <Section>
        <ChallengeShowcase />
      </Section>
      <Section>
        <Timeline />
      </Section>
      <Section>
        <Benefits />
      </Section>
      <Footer />
    </div>
  );
}
