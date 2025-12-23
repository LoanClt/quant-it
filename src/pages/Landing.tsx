import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { QuestionPreview } from "@/components/landing/QuestionPreview";
import { MCQPreview } from "@/components/landing/MCQPreview";
import { Benefits } from "@/components/landing/Benefits";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { Timeline } from "@/components/landing/Timeline";
import { PracticeShowcase } from "@/components/landing/PracticeShowcase";
import { ChallengeShowcase } from "@/components/landing/ChallengeShowcase";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="scroll-smooth">
        <Hero />
        <CompanyLogos />
        <QuestionPreview />
        <MCQPreview />
        <Timeline />
        <PracticeShowcase />
        <ChallengeShowcase />
        <Benefits />
        {/* CTA Section before Footer */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Join thousands of students preparing for top quantitative firms. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    Sign Up Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/practice">
                    Start Practicing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
