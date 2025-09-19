'use client';

import React, { createContext, useContext, useEffect, useReducer, useState, useRef, useCallback, ReactNode } from 'react';
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
  isLoading: true, // Always start with loading true to prevent hydration mismatch
  error: null,
};

// ===== AUTH REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log('🔄 AuthReducer: Action dispatched:', action.type, 'payload' in action ? 'with payload' : 'no payload');
  console.log('🔄 AuthReducer: Current state before update:', { 
    isLoading: state.isLoading, 
    user: state.user ? { id: state.user.id, email: state.user.email, role: state.user.role } : null,
    error: state.error 
  });
  
  let newState: AuthState;
  switch (action.type) {
    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.payload,
      };
      break;

    case 'SET_SESSION':
      newState = {
        ...state,
        session: action.payload.session,
        supabaseUser: action.payload.user,
        isAuthenticated: !!action.payload.session,
        // Only keep loading true if we have a session AND no user profile yet
        // Set loading false if no session (signed out) OR if user profile already exists
        isLoading: action.payload.session && !state.user ? true : false,
      };
      break;

    case 'SET_USER_PROFILE':
      newState = {
        ...state,
        user: action.payload,
        isLoading: false,
      };
      break;

    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      break;

    case 'CLEAR_ERROR':
      newState = {
        ...state,
        error: null,
      };
      break;

    case 'LOGOUT':
      newState = {
        ...initialState,
        isLoading: false,
      };
      break;

    default:
      newState = state;
  }
  
  console.log('✅ AuthReducer: New state after update:', { 
    isLoading: newState.isLoading, 
    user: newState.user ? { id: newState.user.id, email: newState.user.email, role: newState.user.role } : null,
    error: newState.error 
  });
  
  return newState;
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
  const renderCountRef = useRef(0);
  const loadingProfileRef = useRef<Set<string>>(new Set()); // Track which users are being loaded
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout for loading state

  // Circuit breaker to prevent infinite loops
  renderCountRef.current += 1;
  if (renderCountRef.current > 100) {
    console.error('🚨 AuthProvider: Potential infinite render loop detected, breaking');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Auth Loop Detected</h2>
          <p className="text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  // ===== LOAD USER PROFILE =====
  const loadUserProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('🚫 loadUserProfile: Skipping server-side execution');
        return;
      }

      // Prevent multiple simultaneous loads of the same user
      if (loadingProfileRef.current.has(supabaseUser.id)) {
        console.log('⏳ loadUserProfile: Already loading profile for user:', supabaseUser.id);
        return;
      }

      loadingProfileRef.current.add(supabaseUser.id);
      console.log('🔍 loadUserProfile: Starting for user:', {
        id: supabaseUser.id,
        email: supabaseUser.email,
        created_at: supabaseUser.created_at
      });

      // Get user role from the users table in Supabase
      console.log('🔍 loadUserProfile: Querying database for user profile...');
      
      // Add timeout to prevent hanging
      const queryPromise = supabase
        .from('users')
        .select('role, name, profile')
        .eq('id', supabaseUser.id)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );
      
      const { data: userProfile, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('🔍 loadUserProfile: Database query result:', {
        userProfile,
        error: error ? { message: error.message, code: error.code } : null
      });

      if (error) {
        console.error('❌ Error loading user profile from database:', error);
        // Fallback user with default role to resolve loading state
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.email?.split('@')[0] || 'User',
          role: UserRole.TOUR_OPERATOR,
          profile: { firstName: '', lastName: '' },
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
          isActive: true,
          lastLoginAt: new Date()
        };
        console.warn('⚠️ Using fallback user profile due to DB error:', fallbackUser);
        console.log('🔄 loadUserProfile: Dispatching SET_USER_PROFILE with fallback user');
        dispatch({ type: 'SET_USER_PROFILE', payload: fallbackUser });
        console.log('✅ loadUserProfile: Fallback user dispatched successfully');
        return;
      }

      if (!userProfile) {
        console.error('❌ User profile not found in database');
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.email?.split('@')[0] || 'User',
          role: UserRole.TOUR_OPERATOR,
          profile: { firstName: '', lastName: '' },
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
          isActive: true,
          lastLoginAt: new Date()
        };
        console.log('🔄 loadUserProfile: Dispatching SET_USER_PROFILE with fallback user (no profile)');
        dispatch({ type: 'SET_USER_PROFILE', payload: fallbackUser });
        console.log('✅ loadUserProfile: Fallback user dispatched successfully');
        return;
      }

      console.log('✅ User profile loaded from database:', userProfile);

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
      console.log('🔄 loadUserProfile: Dispatching SET_USER_PROFILE with database user');
      dispatch({ type: 'SET_USER_PROFILE', payload: user });
      console.log('✅ loadUserProfile: Database user dispatched successfully');

    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
      const fallbackUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'User',
        role: UserRole.TOUR_OPERATOR,
        profile: { firstName: '', lastName: '' },
        createdAt: new Date(supabaseUser.created_at),
        updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
        isActive: true,
        lastLoginAt: new Date()
      };
      console.log('🔄 loadUserProfile: Dispatching SET_USER_PROFILE with catch fallback user');
      dispatch({ type: 'SET_USER_PROFILE', payload: fallbackUser });
      console.log('✅ loadUserProfile: Catch fallback user dispatched successfully');
    } finally {
      // Always clean up the loading state
      loadingProfileRef.current.delete(supabaseUser.id);
      console.log('🧹 loadUserProfile: Cleaned up loading state for user:', supabaseUser.id);
    }
  }, []);

  // ===== INITIALIZE AUTH =====
  useEffect(() => {
    let mounted = true;

    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Set a timeout to prevent infinite loading - reduced to 5 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      if (mounted && state.isLoading) {
        console.warn('⚠️ Auth loading timeout reached, forcing loading to false');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 5000); // 5 second timeout

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
            // Load user profile and ensure loading state is properly managed
            try {
              await loadUserProfile(session.user);
            } catch (error) {
              console.error('Error loading user profile:', error);
              // Ensure loading state is cleared even on error
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } else {
            // No session, ensure loading is false
            dispatch({ type: 'SET_LOADING', payload: false });
          }
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
      async (event: string, session: Session | null) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        console.log('🔐 Session details:', { 
          hasSession: !!session, 
          userId: session?.user?.id, 
          email: session?.user?.email 
        });
        
        if (!mounted || typeof window === 'undefined') {
          console.log('🚫 Auth state change ignored - not mounted or server-side');
          return;
        }

        // Prevent duplicate processing of the same session
        const currentSessionId = state.session?.user?.id;
        const newSessionId = session?.user?.id;
        
        if (event === 'SIGNED_IN' && currentSessionId === newSessionId && state.user) {
          console.log('⏳ Auth state change ignored - same session already processed and user loaded');
          return;
        }

        console.log('🔄 Dispatching SET_SESSION action');
        dispatch({ 
          type: 'SET_SESSION', 
          payload: { 
            session, 
            user: session?.user || null 
          } 
        });

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ SIGNED_IN event detected, calling loadUserProfile');
          try {
            await loadUserProfile(session.user);
          } catch (error) {
            console.error('Error loading user profile on sign in:', error);
            // Ensure loading state is cleared even on error
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 SIGNED_OUT event detected, dispatching LOGOUT');
          dispatch({ type: 'LOGOUT' });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 TOKEN_REFRESHED event detected, ensuring user profile is loaded');
          // Only load profile if we don't have it yet
          if (!state.user) {
            try {
              await loadUserProfile(session.user);
            } catch (error) {
              console.error('Error loading user profile on token refresh:', error);
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        }
      }
    );

    return () => {
      mounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      subscription.unsubscribe();
    };
  }, []);

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
  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

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
