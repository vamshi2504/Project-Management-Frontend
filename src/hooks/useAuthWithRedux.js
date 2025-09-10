import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase';
import { 
  setUser, 
  clearUser, 
  setLoading, 
  syncUserWithBackend,
  addLoginHistory,
  updateLastActivity 
} from '../store/slices/userSlice';

export const useAuthWithRedux = () => {
  const [firebaseUser, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);

  useEffect(() => {
    if (loading) {
      dispatch(setLoading(true));
      return;
    }

    if (error) {
      console.error('Firebase auth error:', error);
      dispatch(setLoading(false));
      return;
    }

    if (firebaseUser) {
      // User is logged in
      dispatch(setUser(firebaseUser));
      
      // Add login history entry
      dispatch(addLoginHistory({
        provider: firebaseUser.providerData[0]?.providerId || 'unknown',
        ipAddress: 'unknown', // You can get this from an IP service
        userAgent: navigator.userAgent,
      }));

      // Sync with backend
      dispatch(syncUserWithBackend(firebaseUser));
      
      // Update last activity
      dispatch(updateLastActivity());
    } else {
      // User is logged out
      dispatch(clearUser());
    }
  }, [firebaseUser, loading, error, dispatch]);

  return {
    user: firebaseUser,
    userState,
    loading: loading || userState.isLoading,
    error: error?.message || userState.error,
    isAuthenticated: userState.isAuthenticated,
  };
};

export default useAuthWithRedux;
