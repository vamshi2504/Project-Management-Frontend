import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          'user/setUser',
          'user/syncWithBackend/pending',
          'user/syncWithBackend/fulfilled',
          'user/syncWithBackend/rejected'
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.user', 'payload.firebaseUser'],
      },
    }),
});

export default store;
