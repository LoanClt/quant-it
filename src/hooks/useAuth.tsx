import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string, studyLevel?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      console.error('Supabase environment variables are missing. Check Vercel project settings.');
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      }).catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
    });

    return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error setting up auth:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return { 
        error: new Error('Authentication service is not configured. Please contact support.') 
      };
    }
    
    try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
      
      if (error) {
        // Handle network errors more gracefully
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('load failed') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Network request failed')) {
          return { 
            error: new Error('Unable to connect to authentication service. Please check your internet connection and try again.') 
          };
        }
      }
      
    return { error };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return { 
          error: new Error('Network error. Please check your connection and try again.') 
        };
      }
      return { 
        error: err instanceof Error 
          ? err 
          : new Error('An unexpected error occurred during sign in.') 
      };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string, studyLevel?: string) => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      return { 
        error: new Error('Authentication service is not configured. Please contact support.') 
      };
    }
    
    try {
      // Always use environment variable for email redirects (production URL)
      // This ensures emails redirect to production even if user signs up from localhost
      const siteUrl = import.meta.env.VITE_SITE_URL;
      
      if (!siteUrl) {
        console.warn('VITE_SITE_URL not set. Email verification links may not work correctly in production.');
      }
      
      // Use production URL if set, otherwise fallback to current origin (for development)
      const redirectUrl = siteUrl ? `${siteUrl}/` : `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
          study_level: studyLevel,
        },
      },
    });
      
      if (error) {
        // Handle network errors more gracefully
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('load failed') ||
            error.message.includes('NetworkError') ||
            error.message.includes('Network request failed')) {
          return { 
            error: new Error('Unable to connect to authentication service. Please check your internet connection and try again.') 
          };
        }
      }
      
    return { error };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        return { 
          error: new Error('Network error. Please check your connection and try again.') 
        };
      }
      return { 
        error: err instanceof Error 
          ? err 
          : new Error('An unexpected error occurred during sign up.') 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
