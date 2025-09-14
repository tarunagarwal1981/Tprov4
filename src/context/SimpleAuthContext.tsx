'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/types';

// ===== SIMPLE USER INTERFACE =====
interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: any;
}

// ===== AUTH STATE =====
interface AuthState {
  user: SimpleUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

// ===== AUTH CONTEXT =====
interface AuthContextType {
  state: AuthState;
  signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== AUTH PROVIDER =====
interface AuthProviderProps {
  children: ReactNode;
}

export function SimpleAuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  // ===== LOAD USER PROFILE =====
  const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<SimpleUser | null> => {
    try {
      console.log('🔍 Loading user profile for:', supabaseUser.id);
      
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Error loading user profile:', error);
        return null;
      }

      if (userProfile) {
        console.log('✅ User profile loaded:', userProfile);
        console.log('🔍 User role from database:', userProfile.role);
        console.log('🔍 User role type:', typeof userProfile.role);
        return {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role as UserRole,
          profile: userProfile.profile,
        };
      } else {
        console.log('❌ No user profile found in database for user:', supabaseUser.id);
        console.log('🔍 User email:', supabaseUser.email);
      }

      return null;
    } catch (error) {
      console.error('💥 Error in loadUserProfile:', error);
      return null;
    }
  };

  // ===== INITIALIZE AUTH =====
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setState(prev => ({ ...prev, isLoading: false, error: 'Failed to get session' }));
          }
          return;
        }

        if (mounted) {
          if (session?.user) {
            console.log('🔐 Initial session found:', session.user.id);
            const userProfile = await loadUserProfile(session.user);
            setState({
              user: userProfile,
              session,
              isLoading: false,
              error: null,
            });
          } else {
            console.log('🔓 No initial session');
            setState({
              user: null,
              session: null,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        console.error('💥 Error in getInitialSession:', error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false, error: 'Failed to initialize authentication' }));
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in');
          const userProfile = await loadUserProfile(session.user);
          setState({
            user: userProfile,
            session,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setState({
            user: null,
            session: null,
            isLoading: false,
            error: null,
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed');
          const userProfile = await loadUserProfile(session.user);
          setState(prev => ({
            ...prev,
            user: userProfile,
            session,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ===== SIGN UP =====
  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = UserRole.TRAVEL_AGENT
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Signing up user:', { email, name, role });
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Sign up successful:', data.user.id);
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      console.error('💥 Sign up error:', errorMessage);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  // ===== SIGN IN =====
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Signing in user:', email);
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        setState(prev => ({ ...prev, isLoading: false, error: error.message }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('✅ Sign in successful:', data.user.id);
        setState(prev => ({ ...prev, isLoading: false }));
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      console.error('💥 Sign in error:', errorMessage);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  // ===== SIGN OUT =====
  const signOut = async (): Promise<void> => {
    try {
      console.log('👋 Signing out user');
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        setState(prev => ({ ...prev, isLoading: false, error: 'Failed to sign out' }));
      } else {
        console.log('✅ Sign out successful');
        setState({
          user: null,
          session: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('💥 Sign out error:', error);
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to sign out' }));
    }
  };

  // ===== CLEAR ERROR =====
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    state,
    signUp,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===== USE AUTH HOOK =====
export function useSimpleAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
