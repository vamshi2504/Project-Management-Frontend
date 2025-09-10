import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FaGoogle, FaGithub, FaProjectDiagram } from 'react-icons/fa';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get redirect param from URL if present
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    let providerInstance = null;
    if (provider === 'Google') providerInstance = googleProvider;
    if (provider === 'GitHub') providerInstance = githubProvider;
    if (!providerInstance) return;
    try {
      await signInWithPopup(auth, providerInstance);
      toast({
        title: 'Success',
        description: `Logged in with ${provider}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.900" position="relative">
      {/* Left Side - Login Form (Scrollable) */}
      <Box
        flex="1"
        minH="100vh"
        overflowY="auto"
        bg="gray.900"
        w={{ base: "100%", lg: "50%" }}
      >
        <Flex
          align="center"
          justify={{ base: "center", lg: "flex-start" }}
          p={8}
          pl={{ base: 8, lg: 16 }}
          minH="100vh"
        >
        <Box
          w="full"
          maxW="md"
          bg="gray.800"
          borderRadius="2xl"
          p={8}
          border="1px"
          borderColor="gray.700"
          boxShadow="2xl"
        >
          {/* Logo and Header */}
          <VStack spacing={6} mb={8}>
            <HStack spacing={3}>
              <Icon as={FaProjectDiagram} boxSize={8} color="blue.400" />
              <Heading size="lg" color="white">
                ProjectManager
              </Heading>
            </HStack>
            <VStack spacing={2}>
              <Heading size="md" color="white" textAlign="center">
                Welcome Back
              </Heading>
              <Text color="gray.400" textAlign="center">
                Sign in to your account to continue
              </Text>
            </VStack>
          </VStack>

          {/* Social Login Buttons */}
          <VStack spacing={3} mb={6}>
            <Button
              w="full"
              variant="outline"
              borderColor="gray.600"
              color="white"
              _hover={{ bg: "gray.700", borderColor: "gray.500" }}
              leftIcon={<Icon as={FaGoogle} color="red.400" />}
              onClick={() => handleSocialLogin('Google')}
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Continue with Google
            </Button>
            <Button
              w="full"
              variant="outline"
              borderColor="gray.600"
              color="white"
              _hover={{ bg: "gray.700", borderColor: "gray.500" }}
              leftIcon={<Icon as={FaGithub} />}
              onClick={() => handleSocialLogin('GitHub')}
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Continue with GitHub
            </Button>
          </VStack>
        </Box>
        </Flex>
      </Box>

      {/* Right Side - Visual (Fixed) */}
      <Box
        flex="1"
        position="fixed"
        right="0"
        top="0"
        w="50%"
        h="100vh"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        display={{ base: "none", lg: "flex" }}
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <VStack spacing={8} textAlign="center" color="white">
          <Icon as={FaProjectDiagram} boxSize={20} />
          <VStack spacing={4}>
            <Heading size="xl">
              Manage Your Projects
            </Heading>
            <Text fontSize="lg" maxW="md" opacity={0.9}>
              Streamline your workflow, collaborate with your team, and track progress all in one place.
            </Text>
          </VStack>
          <VStack spacing={3}>
            <HStack spacing={8}>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">500+</Text>
                <Text fontSize="sm" opacity={0.8}>Projects</Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">10K+</Text>
                <Text fontSize="sm" opacity={0.8}>Tasks</Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">99%</Text>
                <Text fontSize="sm" opacity={0.8}>Uptime</Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
