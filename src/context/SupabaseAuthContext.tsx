'use client';

import React, { createContext, useContext, useEffect, useReducer, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/lib/types';

// ===== AUTH STATE INTERFACE =====
interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== AUTH ACTION TYPES =====
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { session: Session | null; user: SupabaseUser | null } }
  | { type: 'SET_USER_PROFILE'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// ===== INITIAL STATE =====
const initialState: AuthState = {
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isLoading: typeof window !== 'undefined',
  error: null,
};

// ===== AUTH REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload.session,
        supabaseUser: action.payload.user,
        isAuthenticated: !!action.payload.session,
        isLoading: false,
      };

    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
}

// ===== AUTH CONTEXT INTERFACE =====
interface AuthContextType {
  state: AuthState;
  signUp: (email: string, password: string, userData?: { name: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut for compatibility
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
}

// ===== AUTH CONTEXT =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== AUTH PROVIDER =====
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // ===== LOAD USER PROFILE =====
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Debug: Log the user metadata
      console.log('🔍 Supabase user metadata:', supabaseUser.user_metadata);
      console.log('🔍 Supabase user raw metadata:', supabaseUser.raw_user_meta_data);
      console.log('🔍 User email:', supabaseUser.email);
      
      // Get user role from the users table in Supabase
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role, name, profile')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ Error loading user profile from database:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
        return;
      }

      if (!userProfile) {
        console.error('❌ User profile not found in database');
        dispatch({ type: 'SET_ERROR', payload: 'User profile not found' });
        return;
      }

      console.log('✅ User profile loaded from database:', userProfile);
      console.log('🔍 User role from database:', userProfile.role);
      
      // Create user profile from database data
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: userProfile.name || supabaseUser.email?.split('@')[0] || 'User',
        role: userProfile.role as UserRole,
        profile: userProfile.profile || {},
        createdAt: new Date(supabaseUser.created_at),
        updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
        isActive: true,
        lastLoginAt: new Date()
      };

      console.log('👤 User profile created:', user);
      console.log('🔍 User role detected:', user.role);
      console.log('🔍 User role type:', typeof user.role);
      dispatch({ type: 'SET_USER_PROFILE', payload: user });
      
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
    }
  };

  // ===== INITIALIZE AUTH =====
  useEffect(() => {
    let mounted = true;

    // Only run on client side and only once
    if (typeof window === 'undefined' || isInitialized) {
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to get session' });
          }
          return;
        }

        if (mounted) {
          dispatch({ 
            type: 'SET_SESSION', 
            payload: { 
              session, 
              user: session?.user || null 
            } 
          });

          if (session?.user) {
            await loadUserProfile(session.user);
          }
          
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted || typeof window === 'undefined' || !isInitialized) return;

        dispatch({ 
          type: 'SET_SESSION', 
          payload: { 
            session, 
            user: session?.user || null 
          } 
        });

        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  // ===== SIGN UP =====
  const signUp = async (
    email: string, 
    password: string, 
    userData?: { name: string; role?: UserRole }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name || email.split('@')[0],
            role: userData?.role || 'TRAVEL_AGENT',
            profile: {}
          }
        }
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== SIGN IN =====
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== SIGN OUT =====
  const signOut = async (): Promise<void> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to sign out' });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sign out' });
    }
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }

      if (!state.supabaseUser) {
        return { success: false, error: 'No user logged in' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Update user metadata in Supabase auth
      const { error } = await supabase.auth.updateUser({
        data: {
          name: updates.name || state.supabaseUser.user_metadata?.name,
          role: updates.role || state.supabaseUser.user_metadata?.role,
          profile: updates.profile || state.supabaseUser.user_metadata?.profile || {}
        }
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
        return { success: false, error: 'Failed to update profile' };
      }

      // Update local state
      const updatedUser: User = {
        ...state.user!,
        ...updates,
        updatedAt: new Date()
      };
      
      dispatch({ type: 'SET_USER_PROFILE', payload: updatedUser });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== ROLE CHECKING =====
  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  // ===== RESET PASSWORD =====
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== UPDATE PASSWORD =====
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        return { success: false, error: error.message };
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== CLEAR ERROR =====
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // ===== LOGOUT ALIAS =====
  const logout = async (): Promise<void> => {
    return signOut();
  };

  const value: AuthContextType = {
    state,
    signUp,
    signIn,
    signOut,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    hasRole,
    hasAnyRole,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===== USE AUTH HOOK =====
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
