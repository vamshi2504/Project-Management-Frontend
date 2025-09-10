import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clearUser } from '../store/slices/userSlice';
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Sign out from Firebase
        await signOut(auth);
        
        // Clear Redux state
        dispatch(clearUser());
        
        // Clear browser storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Navigate to login page
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('Logout error:', error);
        // Force navigation even if error occurs
        navigate('/', { replace: true });
      }
    };

    performLogout();
  }, [navigate, dispatch]);

  return (
    <Box 
      minH="100vh" 
      bg="gray.900" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" />
        <Text color="white" fontSize="lg">
          Logging out...
        </Text>
        <Text color="gray.400" fontSize="sm">
          Clearing authentication state
        </Text>
      </VStack>
    </Box>
  );
};

export default LogoutPage;
