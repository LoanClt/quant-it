import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Brain, Star, X, BookOpen, User, Zap, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStripe } from "@/hooks/useStripe";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="container px-4 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h1>
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
          <Card className="mb-12 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                QuantIt vs. Traditional Methods
              </CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                See how we compare to books and coaches
              </p>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="w-[200px] text-muted-foreground">
                        Feature
                      </TableHead>

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

                      <TableHead className="text-center bg-green-500/5 border-l-2 border-r-2 border-green-500/40">
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Brain className="w-6 h-6 text-green-500" />
                          <span className="font-bold">QuantIt</span>
                          <Badge variant="glow" className="text-xs">
                            Premium
                          </Badge>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {[
                      ["Real Interview Questions", false, true, true],
                      ["Interactive Practice", false, true, true],
                      ["Instant Feedback", false, true, true],
                      ["Progressive Hints", false, true, true],
                      ["Progress Tracking", false, false, true],
                      ["Filter by Difficulty/Firm", false, false, true],
                      ["24/7 Availability", true, false, true],
                      ["Affordable Price", true, false, true],
                      ["Self-Paced Learning", true, false, true],
                      ["LaTeX Rendering", false, false, true],
                    ].map(([label, books, coaches, quantit]) => (
                      <TableRow
                        key={label as string}
                        className="transition-colors hover:bg-white/5"
                      >
                        <TableCell className="font-medium">
                          {label}
                        </TableCell>

                        <TableCell className="text-center">
                          {books ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          {coaches ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>

                        <TableCell className="text-center bg-green-500/5 border-l-2 border-r-2 border-green-500/40">
                          {quantit && (
                            <Check className="w-5 h-5 text-green-500 mx-auto drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Free */}
            <Card variant="glass">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      {f.included ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="text-sm">{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card variant="glow">
              <CardHeader className="text-center pb-6">
                <Badge variant="glow" className="mx-auto mb-4">
                  Most Popular
                </Badge>
                <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {premiumFeatures.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{f.text}</span>
                    </li>
                  ))}
                </ul>
                {isPaid ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/settings">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={createCheckoutSession}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

