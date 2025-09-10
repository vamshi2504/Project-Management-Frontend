import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../firebase';
import { authAPI } from '../../api';

// Async thunk for syncing Firebase user with backend
export const syncUserWithBackend = createAsyncThunk(
  'user/syncWithBackend',
  async (firebaseUser, { rejectWithValue }) => {
    try {
      const token = await firebaseUser.getIdToken();
      const backendUser = await authAPI.syncFirebaseUser(firebaseUser, token);
      // Return only serializable data
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        provider: firebaseUser.providerData[0]?.providerId || null,
        backendData: backendUser,
        token
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const updatedUser = await authAPI.updateProfile(user.uid, userData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Authentication state
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Firebase user data
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  emailVerified: false,
  provider: null,
  
  // Backend user data
  backendData: null,
  token: null,
  
  // User preferences
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en',
  },
  
  // User profile additional data
  profile: {
    firstName: '',
    lastName: '',
    bio: '',
    department: '',
    role: '',
    joinDate: null,
    lastLogin: null,
  },
  
  // User permissions and roles
  permissions: [],
  roles: [],
  
  // Activity tracking
  lastActivity: null,
  loginHistory: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user from Firebase auth
    setUser: (state, action) => {
      const user = action.payload;
      state.isAuthenticated = true;
      state.uid = user.uid;
      state.email = user.email;
      state.displayName = user.displayName;
      state.photoURL = user.photoURL;
      state.emailVerified = user.emailVerified;
      state.provider = user.providerData[0]?.providerId || null;
      state.lastActivity = new Date().toISOString();
      state.isLoading = false;
      state.error = null;
    },
    
    // Clear user data on logout
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.emailVerified = false;
      state.provider = null;
      state.backendData = null;
      state.token = null;
      state.permissions = [];
      state.roles = [];
      state.lastActivity = null;
      state.isLoading = false;
      state.error = null;
    },
    
    // Update user preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    // Update user profile
    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update last activity
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    
    // Add login to history
    addLoginHistory: (state, action) => {
      const loginEntry = {
        timestamp: new Date().toISOString(),
        provider: action.payload.provider,
        ipAddress: action.payload.ipAddress || 'unknown',
        userAgent: action.payload.userAgent || 'unknown',
      };
      
      state.loginHistory.unshift(loginEntry);
      // Keep only last 10 login entries
      if (state.loginHistory.length > 10) {
        state.loginHistory = state.loginHistory.slice(0, 10);
      }
    },
    
    // Set user token
    setToken: (state, action) => {
      state.token = action.payload;
    },
    
    // Set permissions and roles
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    // Sync with backend
    builder
      .addCase(syncUserWithBackend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncUserWithBackend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.backendData = action.payload.backendData;
        state.token = action.payload.token;
        state.profile = {
          ...state.profile,
          ...action.payload.backendData.profile,
        };
        state.permissions = action.payload.backendData.permissions || [];
        state.roles = action.payload.backendData.roles || [];
      })
      .addCase(syncUserWithBackend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
        if (state.backendData) {
          state.backendData.profile = {
            ...state.backendData.profile,
            ...action.payload,
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUser,
  clearUser,
  updatePreferences,
  updateProfile,
  setLoading,
  setError,
  clearError,
  updateLastActivity,
  addLoginHistory,
  setToken,
  setPermissions,
  setRoles,
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectUserPermissions = (state) => state.user.permissions;
export const selectUserRoles = (state) => state.user.roles;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;
