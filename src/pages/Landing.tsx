import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { QuestionPreview } from "@/components/landing/QuestionPreview";
import { Benefits } from "@/components/landing/Benefits";
import { CompanyLogos } from "@/components/landing/CompanyLogos";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <CompanyLogos />
        <QuestionPreview />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}
