import { Navbar } from "@/components/landing/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { useStripe } from "@/hooks/useStripe";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { user } = useAuth();
  const { isPaid, isAdmin, togglePaidStatus, loading } = useSubscription();
  const { profile, loading: profileLoading } = useUserProgress();
  const { createCustomerPortalSession } = useStripe();

  const handleTogglePaid = async () => {
    if (!isAdmin) {
      toast.error("Admin access required");
      return;
    }

    const { error } = await togglePaidStatus();
    if (error) {
      toast.error("Failed to toggle paid status");
    } else {
      toast.success(`Paid status: ${!isPaid ? 'Enabled - All questions unlocked!' : 'Disabled - Premium questions locked'}`);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container px-4 pt-24 pb-12 max-w-2xl mx-auto animate-pulse">
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-32 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-12 max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Subscription Status */}
          <div className="animate-slide-up [animation-delay:0ms]">
            <Card
              variant="glass"
              className="
                transition-all duration-300
                hover:shadow-lg hover:shadow-primary/20
                hover:-translate-y-0.5
              "
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isPaid ? "Premium" : "Free"}
                    </p>
                  </div>
                  <Badge
                    variant={isPaid ? "default" : "outline"}
                    className={isPaid ? "bg-primary/90 shadow-md shadow-primary/30" : ""}
                  >
                    {isPaid ? (
                      <>
                        <Unlock className="w-3 h-3 mr-1" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Free
                      </>
                    )}
                  </Badge>
                </div>
                {!isPaid && (
                  <Button
                    variant="hero"
                    className="w-full animate-pulse-soft"
                    asChild
                  >
                    <Link to="/pricing">Upgrade to Premium</Link>
                  </Button>
                )}
                {isPaid && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={createCustomerPortalSession}
                  >
                    Manage Subscription
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Admin Controls */}
          {isAdmin && (
            <div className="animate-slide-up [animation-delay:120ms]">
              <Card
                variant="glass"
                className="
                  border-primary/30
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-primary/20
                  hover:-translate-y-0.5
                "
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Admin Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Paid Subscription Status</p>
                          <p className="text-sm text-muted-foreground">
                            Toggle your paid subscription status for testing
                          </p>
                        </div>
                        <Badge variant={isPaid ? "default" : "outline"}>
                          {isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant={isPaid ? "outline" : "default"}
                          onClick={handleTogglePaid}
                          disabled={loading}
                          className="flex-1"
                        >
                          {isPaid ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Switch to Unpaid
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 mr-2" />
                              Switch to Paid
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Current status: {isPaid ? "You have access to all questions" : "Some questions are locked"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isAdmin && <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />}

          {/* Profile */}
          <div className="animate-slide-up [animation-delay:240ms]">
            <Card
              variant="glass"
              className="
                transition-all duration-300
                hover:shadow-lg hover:shadow-primary/20
                hover:-translate-y-0.5
              "
            >
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Display Name</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.display_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
