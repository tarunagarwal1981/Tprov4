'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';

// Authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_LOADING'; payload: boolean };

// Authentication context interface
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

// Register data interface
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

// Mock user data with simple credentials
const mockUsers: User[] = [
  {
    id: '1',
    email: 'operator@test.com',
    password: '1', // Simple password for tour operator
    name: 'John Operator',
    role: UserRole.TOUR_OPERATOR,
    profile: {
      firstName: 'John',
      lastName: 'Operator',
      phone: '+1-555-0001',
      bio: 'Experienced tour operator specializing in adventure packages.',
      address: {
        street: '123 Adventure St',
        city: 'Denver',
        state: 'CO',
        country: 'USA',
        postalCode: '80202'
      }
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: new Date()
  },
  {
    id: '2',
    email: 'agent@test.com',
    password: '1', // Simple password for travel agent
    name: 'Jane Agent',
    role: UserRole.TRAVEL_AGENT,
    profile: {
      firstName: 'Jane',
      lastName: 'Agent',
      phone: '+1-555-0002',
      bio: 'Professional travel agent with 10+ years of experience.',
      address: {
        street: '456 Travel Ave',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        postalCode: '33101'
      }
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: new Date()
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: '1', // Simple password for admin
    name: 'Admin User',
    role: UserRole.ADMIN,
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1-555-0003',
      bio: 'System administrator managing the travel booking platform.',
      address: {
        street: '789 Admin Blvd',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        postalCode: '94102'
      }
    },
    createdAt: new Date('2022-12-01'),
    updatedAt: new Date(),
    isActive: true,
    lastLoginAt: new Date()
  }
];

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock JWT token generation
  const generateMockToken = (user: User): string => {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };
    return btoa(JSON.stringify(payload));
  };

  // Mock JWT token validation
  const validateMockToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp < now) {
        return null; // Token expired
      }

      // Find user by ID
      const user = mockUsers.find(u => u.id === payload.userId);
      return user || null;
    } catch {
      return null;
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const user = validateMockToken(token);
          if (user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            localStorage.removeItem('auth_token');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize authentication' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (password !== user.password) {
        throw new Error('Invalid password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Update last login
      user.lastLoginAt = new Date();
      
      // Generate and store token
      const token = generateMockToken(user);
      localStorage.setItem('auth_token', token);

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          bio: 'New user account',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      // Add to mock users (in real app, this would be an API call)
      mockUsers.push(newUser);

      // Generate and store token
      const token = generateMockToken(newUser);
      localStorage.setItem('auth_token', token);

      dispatch({ type: 'AUTH_SUCCESS', payload: newUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  // Role checking functions
  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!state.user) return;

    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would fetch updated user data from API
      const updatedUser = mockUsers.find(u => u.id === state.user!.id);
      if (updatedUser) {
        dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    hasRole,
    hasAnyRole,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export types for use in other components
export type { RegisterData, AuthState };
