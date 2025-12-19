import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProgress {
  streak_days: number;
  last_activity_date: string | null;
  questions_completed: number;
  correct_answers: number;
  total_practice_time: number;
}

export interface SkillScore {
  skill_name: string;
  score: number;
  questions_attempted: number;
}

export interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

export interface QuestionCompletion {
  question_id: string;
  completed_at: string;
  time_taken: number | null;
  is_correct: boolean;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [skills, setSkills] = useState<SkillScore[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setSkills([]);
      setProfile(null);
      setCompletedQuestions(new Set());
      setBookmarkedQuestions(new Set());
      setLoading(false);
      return;
    }

    fetchUserData();
    
    // Diagnostic: Check if table exists (only in development)
    if (import.meta.env.DEV) {
      (supabase as any)
        .from('question_completions')
        .select('id')
        .limit(1)
        .then((result: any) => {
          if (result.error) {
            if (result.error.message?.includes('relation') || result.error.message?.includes('does not exist')) {
              console.error('❌ question_completions table does not exist!');
              console.error('Please run the migration: supabase/migrations/20251213150000_add_question_completions.sql');
            } else {
              console.warn('⚠️ Error checking question_completions table:', result.error);
            }
          } else {
            console.log('✅ question_completions table exists');
          }
        });
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const [progressRes, skillsRes, profileRes, completionsRes, bookmarksRes] = await Promise.all([
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('skill_scores')
        .select('skill_name, score, questions_attempted')
        .eq('user_id', user.id),
      supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle(),
      (supabase as any)
        .from('question_completions')
        .select('question_id, is_correct')
        .eq('user_id', user.id)
        .eq('is_correct', true),
      (supabase as any)
        .from('bookmarks')
        .select('question_id')
        .eq('user_id', user.id),
    ]);

    if (progressRes.data) {
      setProgress(progressRes.data);
    }
    
    if (skillsRes.data) {
      setSkills(skillsRes.data);
    }
    
    if (profileRes.data) {
      setProfile(profileRes.data);
    }

    if (completionsRes.error) {
      console.error('Error fetching question completions:', completionsRes.error);
      // Check if it's a table not found error
      if (completionsRes.error.message?.includes('relation') || completionsRes.error.message?.includes('does not exist')) {
        console.warn('The question_completions table does not exist. Please run the migration.');
      }
    } else if (completionsRes.data && Array.isArray(completionsRes.data)) {
      const completedSet = new Set<string>(completionsRes.data.map((c: any) => c.question_id as string));
      setCompletedQuestions(completedSet);
      console.log('Loaded completed questions:', completedSet.size);
    }

    if (bookmarksRes.error) {
      console.error('Error fetching bookmarks:', bookmarksRes.error);
      if (bookmarksRes.error.message?.includes('relation') || bookmarksRes.error.message?.includes('does not exist')) {
        console.warn('The bookmarks table does not exist. Please run the migration.');
      }
    } else if (bookmarksRes.data && Array.isArray(bookmarksRes.data)) {
      const bookmarkedSet = new Set<string>(bookmarksRes.data.map((b: any) => b.question_id as string));
      setBookmarkedQuestions(bookmarkedSet);
      console.log('Loaded bookmarked questions:', bookmarkedSet.size);
    }

    setLoading(false);
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProgress(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return { error };
  };

  const saveQuestionCompletion = async (questionId: string, isCorrect: boolean, timeTaken: number) => {
    if (!user) {
      console.error('Cannot save completion: User not authenticated');
      return { error: new Error('User not authenticated') };
    }
    
    try {
      // First try to insert, if it fails due to conflict, update instead
      let data, error;
      
      // Try insert first
      const insertResult = await (supabase as any)
        .from('question_completions')
        .insert({
          user_id: user.id,
          question_id: questionId,
          is_correct: isCorrect,
          time_taken: timeTaken,
        })
        .select();
      
      if (insertResult.error) {
        // If insert fails (likely due to unique constraint), try update
        if (insertResult.error.code === '23505' || insertResult.error.message?.includes('duplicate')) {
          const updateResult = await (supabase as any)
            .from('question_completions')
            .update({
              is_correct: isCorrect,
              time_taken: timeTaken,
              completed_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('question_id', questionId)
            .select();
          
          data = updateResult.data;
          error = updateResult.error;
        } else {
          data = insertResult.data;
          error = insertResult.error;
        }
      } else {
        data = insertResult.data;
        error = insertResult.error;
      }

      if (error) {
        console.error('Error saving question completion to database:', error);
        // Check if it's a table not found error
        if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('The question_completions table does not exist. Please run the migration.');
          return { error: new Error('Database table not found. Please run migrations.') };
        }
        return { error };
      }

      console.log('Question completion saved:', { questionId, isCorrect, timeTaken, data });

      if (isCorrect) {
        // Update completed questions set immediately for UI responsiveness
        setCompletedQuestions(prev => new Set([...prev, questionId]));
        
        // Update user_progress stats
        const today = new Date().toISOString().split('T')[0];
        const updates: Partial<UserProgress> = {
          questions_completed: (progress?.questions_completed || 0) + 1,
          correct_answers: (progress?.correct_answers || 0) + 1,
          total_practice_time: (progress?.total_practice_time || 0) + timeTaken,
          last_activity_date: today,
        };

        // Update streak if last activity was yesterday or today
        if (progress?.last_activity_date) {
          const lastDate = new Date(progress.last_activity_date);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            // Same day, no change to streak
          } else if (diffDays === 1) {
            // Consecutive day, increment streak
            updates.streak_days = (progress.streak_days || 0) + 1;
          } else {
            // Streak broken, reset to 1
            updates.streak_days = 1;
          }
        } else {
          // First activity, start streak
          updates.streak_days = 1;
        }

        const progressResult = await updateProgress(updates);
        if (progressResult?.error) {
          console.error('Error updating user progress:', progressResult.error);
        } else {
          // Update local progress state
          setProgress(prev => prev ? { ...prev, ...updates } : null);
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error('Exception saving question completion:', err);
      return { error: err as Error };
    }
  };

  const toggleBookmark = async (questionId: string) => {
    if (!user) {
      console.error('Cannot bookmark: User not authenticated');
      return { error: new Error('User not authenticated') };
    }

    const isBookmarked = bookmarkedQuestions.has(questionId);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await (supabase as any)
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId);

        if (error) {
          console.error('Error removing bookmark:', error);
          // Check if it's a table not found error
          if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            console.error('The bookmarks table does not exist. Please run the migration.');
            return { error: new Error('Database table not found. Please run migrations.') };
          }
          return { error };
        }

        setBookmarkedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });
        console.log('Bookmark removed:', questionId);
      } else {
        // Add bookmark - try insert first, if conflict then update
        let error;
        const insertResult = await (supabase as any)
          .from('bookmarks')
          .insert({
            user_id: user.id,
            question_id: questionId,
          })
          .select();

        if (insertResult.error) {
          // If insert fails due to unique constraint, that's fine (already bookmarked)
          if (insertResult.error.code === '23505' || insertResult.error.message?.includes('duplicate')) {
            // Already bookmarked, just update state
            setBookmarkedQuestions(prev => new Set([...prev, questionId]));
            console.log('Bookmark already exists:', questionId);
            return { error: null };
          }
          
          error = insertResult.error;
          console.error('Error adding bookmark:', error);
          
          // Check if it's a table not found error
          if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            console.error('The bookmarks table does not exist. Please run the migration.');
            return { error: new Error('Database table not found. Please run migrations.') };
          }
          
          return { error };
        }

        setBookmarkedQuestions(prev => new Set([...prev, questionId]));
        console.log('Bookmark added:', questionId);
      }

      return { error: null };
    } catch (err) {
      console.error('Exception toggling bookmark:', err);
      return { error: err as Error };
    }
  };

  return {
    progress,
    skills,
    profile,
    completedQuestions,
    bookmarkedQuestions,
    loading,
    updateProgress,
    updateProfile,
    saveQuestionCompletion,
    toggleBookmark,
    refetch: fetchUserData,
  };
}
