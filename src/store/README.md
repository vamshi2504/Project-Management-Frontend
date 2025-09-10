# Redux Store Implementation

This project uses **Redux Toolkit** for state management, specifically for handling user authentication and project data. The store is configured to work seamlessly with Firebase authentication and your Spring Boot backend.

## 📁 Store Structure

```
src/
├── store/
│   ├── index.js                 # Store configuration
│   ├── hooks.js                 # Typed Redux hooks
│   └── slices/
│       ├── userSlice.js         # User state management
│       └── projectSlice.js      # Project state management
├── hooks/
│   ├── useAuthWithRedux.js      # Firebase + Redux integration
│   └── useUser.js               # User state utilities
└── components/
    └── ui/
        └── UserProfile.jsx      # Example component using Redux
```

## 🔧 Setup

### 1. Store Configuration

The store is configured in `src/store/index.js` and includes:
- **User slice**: Authentication and user profile management
- **Project slice**: Project data and operations
- **Middleware**: Serializable check configuration for Firebase compatibility

### 2. Provider Setup

The Redux Provider is set up in `src/main.jsx`:

```jsx
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>
);
```

## 👤 User State Management

### User Slice Features

- **Authentication state**: Login status, loading states, errors
- **Firebase data**: UID, email, display name, photo URL, provider info
- **Backend sync**: Integration with Spring Boot API
- **Profile data**: Extended user information (name, department, role)
- **Preferences**: Theme, notifications, language settings
- **Activity tracking**: Last activity, login history
- **Permissions & roles**: Authorization management

### Using User State

#### With Custom Hook (Recommended)

```jsx
import { useUser } from '../hooks/useUser';

const MyComponent = () => {
  const {
    user,
    profile,
    preferences,
    isAuthenticated,
    isLoading,
    updateUserPreferences,
    getUserDisplayName,
    hasPermission
  } = useUser();

  return (
    <div>
      <h1>Welcome, {getUserDisplayName()}!</h1>
      <p>Theme: {preferences.theme}</p>
      {hasPermission('admin') && <AdminPanel />}
    </div>
  );
};
```

#### With Direct Redux Hooks

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updatePreferences } from '../store/slices/userSlice';

const MyComponent = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleThemeChange = (theme) => {
    dispatch(updatePreferences({ theme }));
  };

  return <div>User: {user.displayName}</div>;
};
```

### Available User Selectors

```jsx
import {
  selectUser,              // Complete user object
  selectIsAuthenticated,   // Boolean authentication status
  selectUserProfile,       // Extended profile data
  selectUserPreferences,   // User preferences
  selectUserPermissions,   // User permissions array
  selectUserRoles,         // User roles array
  selectIsLoading,         // Loading state
  selectUserError,         // Error state
} from '../store/slices/userSlice';
```

### User Actions

```jsx
import {
  setUser,                 // Set user from Firebase
  clearUser,               // Clear user on logout
  updatePreferences,       // Update user preferences
  updateProfile,           // Update profile data
  setLoading,              // Set loading state
  setError,                // Set error state
  updateLastActivity,      // Update activity timestamp
  syncUserWithBackend,     // Async: Sync with backend
  updateUserProfile,       // Async: Update profile via API
} from '../store/slices/userSlice';
```

## 🚀 Project State Management

### Project Slice Features

- **Projects list**: User's projects and all projects
- **Current project**: Active project details
- **Loading states**: Create, update, fetch operations
- **Filters**: Status, priority, date range, search
- **Pagination**: Page management and limits
- **View preferences**: Grid/list/kanban modes, sorting

### Using Project State

```jsx
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserProjects,
  selectCurrentProject,
  fetchUserProjects,
  setCurrentProject
} from '../store/slices/projectSlice';

const ProjectsList = () => {
  const projects = useSelector(selectUserProjects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProjects(userId));
  }, [dispatch, userId]);

  const handleProjectSelect = (project) => {
    dispatch(setCurrentProject(project));
  };

  return (
    <div>
      {projects.map(project => (
        <div key={project.id} onClick={() => handleProjectSelect(project)}>
          {project.name}
        </div>
      ))}
    </div>
  );
};
```

## 🔐 Authentication Integration

### Firebase + Redux Hook

The `useAuthWithRedux` hook automatically syncs Firebase authentication with Redux:

```jsx
import { useAuthWithRedux } from '../hooks/useAuthWithRedux';

const App = () => {
  const { user, isAuthenticated, loading } = useAuthWithRedux();

  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated ? <Dashboard /> : <Login />;
};
```

### Protected Routes

```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthWithRedux();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## 🎯 Best Practices

### 1. Use Custom Hooks

Create custom hooks for specific functionality:

```jsx
// hooks/useUserProfile.js
export const useUserProfile = () => {
  const { profile, updateUserProfile } = useUser();
  
  const updateProfile = async (data) => {
    // Validation and API calls
    await updateUserProfile(data);
  };
  
  return { profile, updateProfile };
};
```

### 2. Organize by Feature

Keep related state in the same slice:

```jsx
// userSlice.js - Everything related to user
// projectSlice.js - Everything related to projects
// uiSlice.js - UI state (modals, sidebars, etc.)
```

### 3. Use Async Thunks for API Calls

```jsx
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      return await authAPI.updateProfile(user.uid, userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 4. Error Handling

Always handle errors in your components:

```jsx
const { error, clearUserError } = useUser();

useEffect(() => {
  if (error) {
    toast.error(error);
    clearUserError();
  }
}, [error, clearUserError]);
```

## 📊 State Shape

### User State

```javascript
{
  user: {
    // Authentication
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
    
    // Backend data
    backendData: null,
    token: null,
    
    // Profile
    profile: {
      firstName: '',
      lastName: '',
      bio: '',
      department: '',
      role: '',
      joinDate: null,
      lastLogin: null,
    },
    
    // Preferences
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en',
    },
    
    // Authorization
    permissions: [],
    roles: [],
    
    // Activity
    lastActivity: null,
    loginHistory: [],
  }
}
```

### Project State

```javascript
{
  project: {
    // Data
    projects: [],
    userProjects: [],
    currentProject: null,
    currentProjectId: null,
    
    // Loading
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    
    // Errors
    error: null,
    createError: null,
    updateError: null,
    
    // Filters
    filters: {
      status: 'all',
      priority: 'all',
      dateRange: null,
      search: '',
    },
    
    // Pagination
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
    },
    
    // View
    viewMode: 'grid',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  }
}
```

## 🔄 Integration with Existing Features

### Chat System

The Redux store works alongside your existing Firebase chat system:

```jsx
const ChatComponent = () => {
  const { user } = useUser(); // Get user from Redux
  const { sendMessage } = useChat(); // Use existing chat context
  
  const handleSendMessage = (message) => {
    sendMessage({
      ...message,
      userId: user.uid,
      userName: user.displayName,
    });
  };
};
```

### API Integration

Redux integrates with your API middleware:

```jsx
// In userSlice.js
export const syncUserWithBackend = createAsyncThunk(
  'user/syncWithBackend',
  async (firebaseUser, { rejectWithValue }) => {
    try {
      const token = await firebaseUser.getIdToken();
      const backendUser = await authAPI.syncFirebaseUser(firebaseUser, token);
      return { ...firebaseUser, backendData: backendUser, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 🧪 Testing

Test your Redux store with Redux Toolkit's testing utilities:

```jsx
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';

const createTestStore = (initialState) => {
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: initialState,
  });
};

test('should handle user login', () => {
  const store = createTestStore();
  const user = { uid: '123', email: 'test@example.com' };
  
  store.dispatch(setUser(user));
  
  expect(store.getState().user.isAuthenticated).toBe(true);
  expect(store.getState().user.uid).toBe('123');
});
```

## 🚀 Getting Started

1. **User information is automatically stored** when users log in through Firebase
2. **Access user data** anywhere in your app using the `useUser()` hook
3. **Sync with backend** automatically through the `useAuthWithRedux()` hook
4. **Update user preferences** with `updateUserPreferences()`
5. **Track user activity** with `updateActivity()`

The Redux store is now ready to manage your user information throughout the application!
