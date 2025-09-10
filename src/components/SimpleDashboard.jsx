import React from 'react';
import { Box, Text, VStack, Heading, Avatar, HStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const SimpleDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Box 
      minH="100vh" 
      bg="gray.900"
      p={8}
    >
      <VStack spacing={6} align="stretch">
        <Heading color="white" size="xl">
          Dashboard
        </Heading>
        
        {isAuthenticated && user && (
          <Box 
            bg="gray.800" 
            p={6} 
            borderRadius="lg"
            border="1px"
            borderColor="gray.700"
          >
            <VStack spacing={4} align="start">
              <Heading color="white" size="md">
                Welcome back!
              </Heading>
              <HStack spacing={4}>
                <Avatar 
                  src={user.photoURL} 
                  name={user.displayName} 
                  size="md"
                />
                <VStack align="start" spacing={1}>
                  <Text color="white" fontSize="lg" fontWeight="bold">
                    {user.displayName || 'User'}
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    {user.email}
                  </Text>
                  <Text color="green.400" fontSize="xs">
                    ✅ Authenticated
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        )}
        
        <Text color="gray.300" fontSize="lg">
          Welcome to your project management dashboard!
        </Text>
        <Box 
          bg="gray.800" 
          p={6} 
          borderRadius="lg"
          border="1px"
          borderColor="gray.700"
        >
          <Text color="white" fontSize="md">
            🎉 Dashboard is working correctly!
          </Text>
          <Text color="gray.400" fontSize="sm" mt={2}>
            The authentication flow and routing are functioning properly.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SimpleDashboard;
