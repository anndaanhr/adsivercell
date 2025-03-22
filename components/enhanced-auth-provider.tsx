"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut, updateUserProfile } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAuthProviderProps {
  children: ReactNode;
}

export function EnhancedAuthProvider({ children }: EnhancedAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session on load
    async function getInitialSession() {
      try {
        setIsLoading(true);

        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        // Setup auth state change listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getInitialSession();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await authSignIn(email, password);

      if (result.user && result.session) {
        setUser(result.user);
        setSession(result.session);
        router.push('/');

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
      }

      return result;
    } catch (error) {
      console.error('Error during sign in:', error);
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, userData: { name: string }) => {
    try {
      setIsLoading(true);
      const result = await authSignUp(email, password, userData);

      if (result.user) {
        // Check if email confirmation is required
        if (!result.session) {
          toast({
            title: 'Check your email',
            description: 'We\'ve sent you a confirmation email to verify your account.',
          });
          router.push('/auth/verify-email');
        } else {
          setUser(result.user);
          setSession(result.session);
          router.push('/');

          toast({
            title: 'Account created',
            description: 'Your account has been successfully created.',
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error during sign up:', error);
      toast({
        title: 'Sign up failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authSignOut();
      setUser(null);
      setSession(null);
      router.push('/');

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      return { success: true };
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: 'Error signing out',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (userData: { name?: string; avatar_url?: string }) => {
    try {
      setIsLoading(true);
      const result = await updateUserProfile(userData);

      if (result.user) {
        setUser(result.user);

        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      }

      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
