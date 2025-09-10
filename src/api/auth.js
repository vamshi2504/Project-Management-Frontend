import apiClient from './apiClient';

/**
 * Login with credentials
 * POST /auth/login
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    if (!response.ok) throw new Error("Login failed");
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * POST /auth/register
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    if (!response.ok) throw new Error("Registration failed");
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Refresh authentication token
 * POST /auth/refresh
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    if (!response.ok) throw new Error("Token refresh failed");
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

/**
 * Verify authentication token
 * GET /auth/verify
 */
export const verifyToken = async () => {
  try {
    const response = await apiClient.get('/auth/verify');
    if (!response.ok) throw new Error("Token verification failed");
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    // If token is invalid, clear local storage
    logout();
    throw error;
  }
};

/**
 * Update user profile
 * PUT /auth/profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/auth/profile', profileData);
    if (!response.ok) throw new Error("Profile update failed");
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

/**
 * Change password
 * PUT /auth/change-password
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth/change-password', passwordData);
    if (!response.ok) throw new Error("Password change failed");
    return response.data;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

/**
 * Request password reset
 * POST /auth/forgot-password
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    if (!response.ok) throw new Error("Password reset request failed");
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * POST /auth/reset-password
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await apiClient.post('/auth/reset-password', resetData);
    if (!response.ok) throw new Error("Password reset failed");
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Login with Firebase token
 * POST /auth/firebase
 */
export const loginWithFirebase = async (firebaseToken) => {
  try {
    const data = await apiClient.post('/auth/firebase', { token: firebaseToken });
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
};

/**
 * Sync Firebase user with backend
 * For now, just return Firebase user data since backend endpoints are not ready
 */
export const syncFirebaseUser = async (firebaseUser, token) => {
  try {
    // Prepare user data for backend
    const userPayload = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL || ''
    };
    // Sync with backend (create or update user)
    const backendUser = await apiClient.post('/users', userPayload);
    // Return merged user info
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      provider: firebaseUser.providerData[0]?.providerId || null,
      token,
      backendSynced: true,
      backendUser: backendUser,
      role: 'user',
      permissions: ['read', 'write']
    };
  } catch (error) {
    console.error('Firebase user sync error:', error);
    throw error;
  }
}
