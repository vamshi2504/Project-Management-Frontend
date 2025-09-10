import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Store comprehensive user information
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          providerData: firebaseUser.providerData,
          accessToken: firebaseUser.accessToken,
          metadata: {
            creationTime: firebaseUser.metadata.creationTime,
            lastSignInTime: firebaseUser.metadata.lastSignInTime,
          }
        };

        setUser(userData);

        // Store in localStorage for persistence
        localStorage.setItem('projectManagementUser', JSON.stringify(userData));
        // Store login timestamp if not already set
        if (!localStorage.getItem('projectManagementLoginTime')) {
          localStorage.setItem('projectManagementLoginTime', Date.now().toString());
        }

        // Check if session is older than 2 days (48 hours)
        const loginTime = parseInt(localStorage.getItem('projectManagementLoginTime'), 10);
        if (!isNaN(loginTime)) {
          const now = Date.now();
          const twoDays = 2 * 24 * 60 * 60 * 1000;
          if (now - loginTime > twoDays) {
            // Session expired, force logout
            setUser(null);
            localStorage.removeItem('projectManagementUser');
            localStorage.removeItem('projectManagementLoginTime');
            auth.signOut();
            setLoading(false);
            return;
          }
        }

        // --- Backend user creation/update ---
        try {
          // Fallback helpers
          const provider = (firebaseUser.providerData && firebaseUser.providerData[0]) || {};
          const name = firebaseUser.displayName || provider.displayName || '';
          const email = firebaseUser.email || provider.email || '';
          const avatar = firebaseUser.photoURL || provider.photoURL || '';
          // Use import.meta.env for Vite projects
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
          await axios.post(
            `${apiUrl}/api/users`,
            {
              id: firebaseUser.uid,
              name,
              email,
              avatar
            }
          );
        } catch (err) {
          console.warn('Failed to create/update user in backend:', err);
        }

      } else {
        setUser(null);
        localStorage.removeItem('projectManagementUser');
        localStorage.removeItem('projectManagementLoginTime');
        console.log('User logged out');
      }
      setLoading(false);
    });

    // Check localStorage on app start
    const storedUser = localStorage.getItem('projectManagementUser');
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // The onAuthStateChanged will handle the actual validation
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('projectManagementUser');
        localStorage.removeItem('projectManagementLoginTime');
      }
    }

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    // Helper function to get user token for API calls
    getUserToken: () => {
      return user?.accessToken || null;
    },
    // Helper function to get user ID for API calls
    getUserId: () => {
      return user?.uid || null;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
