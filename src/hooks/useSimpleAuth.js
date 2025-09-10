import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export const useSimpleAuth = () => {
  const [firebaseUser, loading, error] = useAuthState(auth);
  
  return {
    isAuthenticated: !!firebaseUser,
    loading,
    error,
    user: firebaseUser
  };
};
