'use client';

import React, { createContext, useContext, useEffect, useReducer, useState, useRef, useCallback, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/lib/types';

// ===== IMPROVED AUTH STATE INTERFACE =====
interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // New: tracks if auth has been initialized
  error: string | null;
  lastActivity: number; // New: tracks last activity for session management
}

// ===== AUTH ACTION TYPES =====
type AuthAction =
  | { type: 'INITIALIZE'; payload: { session: Session | null; user: SupabaseUser | null } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_PROFILE'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_ACTIVITY' };

// ===== INITIAL STATE =====
const initialState: AuthState = {
  user: null,
  supabaseUser: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
  lastActivity: Date.now(),
};

// ===== IMPROVED AUTH REDUCER =====
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        session: action.payload.session,
        supabaseUser: action.payload.user,
        isAuthenticated: !!action.payload.session,
        isLoading: !!action.payload.session && !state.user, // Only load if we have session but no user
        isInitialized: true,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
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
        isInitialized: true,
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now(),
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
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  refreshSession: () => Promise<void>; // New: manual session refresh
}

// ===== AUTH CONTEXT =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== IMPROVED AUTH PROVIDER =====
interface AuthProviderProps {
  children: ReactNode;
}

export function ImprovedAuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const loadingProfileRef = useRef<Set<string>>(new Set());
  const initializationRef = useRef<boolean>(false);
  const sessionRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileCacheRef = useRef<Map<string, User>>(new Map()); // Add profile caching

  // ===== LOAD USER PROFILE WITH IMPROVED ERROR HANDLING =====
  const loadUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Check cache first
      const cachedProfile = profileCacheRef.current.get(supabaseUser.id);
      if (cachedProfile) {
        console.log('📋 Using cached profile for user:', supabaseUser.id);
        return cachedProfile;
      }

      // Prevent multiple simultaneous loads
      if (loadingProfileRef.current.has(supabaseUser.id)) {
        console.log('⏳ Profile already loading for user:', supabaseUser.id);
        return null;
      }

      loadingProfileRef.current.add(supabaseUser.id);
      console.log('🔍 Loading profile for user:', supabaseUser.id);

      // Improved timeout handling
      const queryPromise = supabase
        .from('users')
        .select('role, name, profile')
        .eq('id', supabaseUser.id)
        .single();
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile loading timeout')), 15000) // Increased to 15 seconds
      );
      
      const { data: userProfile, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Error loading user profile:', error);
        // Create fallback user with default role
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
        console.warn('⚠️ Using fallback user profile');
        // Cache the fallback profile
        profileCacheRef.current.set(supabaseUser.id, fallbackUser);
        return fallbackUser;
      }

      if (!userProfile) {
        console.error('❌ User profile not found');
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
        // Cache the fallback profile
        profileCacheRef.current.set(supabaseUser.id, fallbackUser);
        return fallbackUser;
      }

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

      console.log('✅ User profile loaded successfully');
      
      // Cache the profile
      profileCacheRef.current.set(supabaseUser.id, user);
      
      return user;

    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
      // Return fallback user on any error
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
      // Cache the fallback profile
      profileCacheRef.current.set(supabaseUser.id, fallbackUser);
      return fallbackUser;
    } finally {
      loadingProfileRef.current.delete(supabaseUser.id);
    }
  }, []);

  // ===== IMPROVED INITIALIZATION =====
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
          return;
        }

        console.log('📋 Initial session:', session ? 'Found' : 'None');
        
        // Initialize with session data
        dispatch({ 
          type: 'INITIALIZE', 
          payload: { 
            session, 
            user: session?.user || null 
          } 
        });

        // Load user profile if session exists
        if (session?.user) {
          const userProfile = await loadUserProfile(session.user);
          if (userProfile) {
            dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
          }
        }

        console.log('✅ Authentication initialized successfully');

      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        console.log('🔐 Auth state changed:', event);
        
        if (!initializationRef.current) return;

        // Update activity
        dispatch({ type: 'UPDATE_ACTIVITY' });

        // Handle different events
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user && !state.user) {
              dispatch({ 
                type: 'INITIALIZE', 
                payload: { 
                  session, 
                  user: session.user 
                } 
              });
              const userProfile = await loadUserProfile(session.user);
              if (userProfile) {
                dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
              }
            }
            break;

          case 'SIGNED_OUT':
            dispatch({ type: 'LOGOUT' });
            // Clear profile cache on logout
            profileCacheRef.current.clear();
            break;

          case 'TOKEN_REFRESHED':
            if (session?.user && !state.user) {
              // Only load profile if we don't have it yet
              const userProfile = await loadUserProfile(session.user);
              if (userProfile) {
                dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
              }
            }
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              dispatch({ 
                type: 'INITIALIZE', 
                payload: { 
                  session, 
                  user: session.user 
                } 
              });
              // Clear cache for this user to force reload
              profileCacheRef.current.delete(session.user.id);
            }
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (sessionRefreshTimeoutRef.current) {
        clearTimeout(sessionRefreshTimeoutRef.current);
      }
    };
  }, []);

  // ===== IMPROVED SIGN IN =====
  const signIn = async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
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
        // Don't set loading to false here - let the auth state change handler manage it
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // ===== IMPROVED SIGN OUT =====
  const signOut = async (): Promise<void> => {
    try {
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

  // ===== MANUAL SESSION REFRESH =====
  const refreshSession = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh session' });
      } else {
        console.log('✅ Session refreshed successfully');
        dispatch({ type: 'UPDATE_ACTIVITY' });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh session' });
    }
  };

  // ===== OTHER METHODS (keeping existing implementations) =====
  const signUp = async (
    email: string, 
    password: string, 
    userData?: { name: string; role?: UserRole }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
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

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!state.supabaseUser) {
        return { success: false, error: 'No user logged in' };
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

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

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
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

  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
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

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

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
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===== USE AUTH HOOK =====
export function useImprovedAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useImprovedAuth must be used within an ImprovedAuthProvider');
  }
  return context;
}
