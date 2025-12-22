import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Brain, Star, X, BookOpen, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStripe } from "@/hooks/useStripe";
import { useSubscription } from "@/hooks/useSubscription";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Pricing() {
  const { user } = useAuth();
  const { isPaid } = useSubscription();
  const { createCheckoutSession } = useStripe();

  const freeFeatures = [
    { text: "Access to Easy & Medium questions", included: true },
    { text: "Progressive hints", included: true },
    { text: "Progress tracking", included: true },
    { text: "Filter by difficulty, firm, category", included: true },
    { text: "Hard & Extreme questions", included: false },
    { text: "Custom support via email", included: false },
    { text: "Community access", included: false },
  ];

  const premiumFeatures = [
    { text: "Access to all 40+ questions", included: true },
    { text: "All hints available", included: true },
    { text: "Custom support via email", included: true },
    { text: "Community access", included: true },
    { text: "Progress tracking", included: true },
    { text: "Filter by difficulty, firm, category", included: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pricing
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works for you
            </p>
            {isPaid && user && (
              <div className="mt-4">
                <Badge variant="glow" className="px-4 py-2 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Your Current Plan: Premium
                </Badge>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">QuantIt vs. Traditional Methods</CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                See how we compare to books and coaches
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      <TableHead className="text-center">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          <span>Books</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-5 h-5" />
                          <span>Coaches</span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center relative border-l-4 border-r-4 border-green-500">
                        <div className="flex flex-col items-center gap-2 py-2">
                          <div className="p-2 rounded-lg">
                            <Brain className="w-6 h-6 text-primary" />
                          </div>
                          <span className="font-bold">QuantIt</span>
                          <Badge variant="glow" className="text-xs">
                            Premium
                          </Badge>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Real Interview Questions</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Interactive Practice</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Instant Feedback</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Progressive Hints</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Progress Tracking</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Filter by Difficulty/Firm</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">24/7 Availability</TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Affordable Price</TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Self-Paced Learning</TableCell>
                      <TableCell className="text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">LaTeX Rendering</TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-center border-l-4 border-r-4 border-green-500">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Free Plan */}
            <Card variant="glass" className={!isPaid && user ? "ring-2 ring-primary" : ""}>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {!isPaid && user && (
                  <Badge variant="outline" className="mt-2">
                    Your Current Plan
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                {!user ? (
                  <Button variant="outline" className="w-full" size="lg" asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                ) : !isPaid ? (
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Downgrade
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card variant="glow" className={isPaid && user ? "ring-2 ring-primary" : ""}>
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {isPaid && user ? (
                    <Badge variant="glow" className="px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Your Current Plan
                    </Badge>
                  ) : (
                    <Badge variant="glow" className="px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cancel anytime
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                {user ? (
                  isPaid ? (
                    <Button variant="hero" className="w-full" size="lg" asChild>
                      <Link to="/dashboard">
                        <Zap className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="hero" 
                      className="w-full" 
                      size="lg"
                      onClick={createCheckoutSession}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )
                ) : (
                  <Button variant="hero" className="w-full" size="lg" asChild>
                    <Link to="/auth">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">What's Included</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <h3 className="font-semibold mb-2">All Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Access to 40+ quant interview questions from top firms
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Full Hints</h3>
                <p className="text-sm text-muted-foreground">
                  Progressive hints to guide your thinking
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support & Community</h3>
                <p className="text-sm text-muted-foreground">
                  Get help when you need it and connect with others
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

