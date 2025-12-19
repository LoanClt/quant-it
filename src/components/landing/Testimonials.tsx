import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Hired at McKinsey",
    content: "The probability questions were exactly what I faced in my final round. This platform was a game-changer.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    role: "Quant Researcher at Citadel",
    content: "The market-making puzzles and timed practice mode perfectly simulated the actual interview pressure.",
    avatar: "MW",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "PM at Google",
    content: "I went from struggling with estimation questions to acing them in 3 weeks. The step-by-step solutions are invaluable.",
    avatar: "ER",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Success Stories</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join Thousands of{' '}
            <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our users landed their dream jobs at top firms.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              variant="glass"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-difficulty-medium text-difficulty-medium" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
