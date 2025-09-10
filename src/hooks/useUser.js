import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to manage user state from AuthContext
 * Provides easy access to user data and common user operations
 */
export const useUser = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Return user data in the format expected by Dashboard
  return {
    user: user || null,
    isAuthenticated,
    loading,
    error: null,
    profile: user ? {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    } : null,
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    },
    permissions: user ? ['read', 'write'] : [],
    roles: user ? ['user'] : [],
    
    // Helper methods (simplified for now)
    updatePreferences: () => console.log('Update preferences'),
    updateProfile: () => console.log('Update profile'),
    updateLastActivity: () => console.log('Update activity'),
    clearError: () => console.log('Clear error'),
  };
};
