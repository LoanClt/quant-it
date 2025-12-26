import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth state to be determined
    if (loading) return;

    if (user) {
      // Successfully authenticated, redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // Authentication failed or no user, redirect to auth page
      navigate('/auth?error=authentication_failed', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Completing sign in...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

