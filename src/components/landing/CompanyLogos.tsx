import { useEffect, useState } from "react";

const companies = [
  { name: "Citadel", logo: "/slides/citadel.png" },
  { name: "Jane Street", logo: "/slides/jane-street.png" },
  { name: "Susquehanna", logo: "/slides/susquehanna.png" },
  { name: "RBC", logo: "/slides/rbc.png" },
  { name: "Barclays", logo: "/slides/barclays.png" },
  { name: "BNP", logo: "/slides/bnp.png" },
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
    <section className="relative overflow-hidden py-16 md:py-20 bg-muted/30">
      {/* Ambient background pulses */}
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse [animation-delay:-2s]" />

      <div className="container relative z-10 px-4 mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Trusted by students who got into
          </p>
        </div>

        {/* Logos */}
        <div className="flex justify-center items-center gap-6 md:gap-10">
          {companies.map((company, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={company.name}
                className={`
                  relative transition-all duration-700 ease-in-out
                  ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-90"}
                `}
              >
                {/* Neon glow layers (ACTIVE ONLY) */}
                {isActive && (
                  <>
                    {/* Soft breathing glow */}
                    <div className="absolute inset-0 -z-10 rounded-xl bg-green-500/30 blur-2xl animate-neonPulse" />
                    
                    {/* Hard neon ring */}
                    <div className="absolute inset-0 -z-10 rounded-xl ring-2 ring-green-400/70 animate-neonFlicker" />
                  </>
                )}

                {/* Card */}
                <div
                  className={`
                    relative flex items-center justify-center
                    h-24 md:h-32 w-32 md:w-40
                    rounded-lg p-6 bg-background border
                    transition-all duration-300
                    ${isActive
                      ? "border-green-400 shadow-green-500/40 shadow-2xl"
                      : "border-border/50 hover:border-green-400/50"}
                  `}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    loading="lazy"
                    className={`
                      max-h-16 md:max-h-20 w-auto object-contain
                      transition-all duration-300
                      ${isActive ? "grayscale-0 brightness-110" : "grayscale"}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm md:text-base text-muted-foreground italic">
            and many more...
          </p>
        </div>
      </div>
    </section>
  );
}