import { useEffect, useState } from "react";

const companies = [
  { name: "Citadel", logo: "/slides/citadel.png" },
  { name: "Jane Street", logo: "/slides/jane street.png" },
  { name: "Susquehanna", logo: "/slides/susquehanna.png" },
];

export function CompanyLogos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % companies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Trusted by students who got into
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex justify-center items-center gap-6 md:gap-8">
              {companies.map((company, index) => (
                <div
                  key={company.name}
                  className={`
                    transition-all duration-700 ease-in-out
                    ${index === currentIndex
                      ? "opacity-100 scale-100 brightness-110 drop-shadow-lg" 
                      : "opacity-30 scale-85"}
                  `}
                >
                  <div className={`
                    flex items-center justify-center h-24 md:h-32 w-32 md:w-40 bg-background rounded-lg p-6 border transition-all duration-300 shadow-sm
                    ${index === currentIndex
                      ? "border-primary/80 shadow-primary/20 shadow-lg ring-2 ring-primary/30" 
                      : "border-border/50 hover:border-primary/50"}
                  `}>
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-16 md:max-h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm md:text-base text-muted-foreground italic">
              and many more...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
