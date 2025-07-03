import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  Link,
  Icon,
  useToast,
  Image,
  Divider,
  Checkbox,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaGithub, FaProjectDiagram } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any email/password
      toast({
        title: 'Success',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: 'Feature Coming Soon',
      description: `${provider} login will be available soon!`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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
            >
              Continue with GitHub
            </Button>
          </VStack>

          {/* Divider */}
          <HStack spacing={4} mb={6}>
            <Divider borderColor="gray.600" />
            <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
              Or continue with email
            </Text>
            <Divider borderColor="gray.600" />
          </HStack>

          {/* Login Form */}
          <VStack spacing={4}>
            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Email Address
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Password
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    color="gray.400"
                    _hover={{ color: "white" }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Remember Me and Forgot Password */}
            <Flex justify="space-between" w="full" align="center">
              <Checkbox
                name="rememberMe"
                isChecked={formData.rememberMe}
                onChange={handleInputChange}
                colorScheme="blue"
                color="gray.300"
                size="sm"
              >
                Remember me
              </Checkbox>
              <Link color="blue.400" fontSize="sm" _hover={{ color: "blue.300" }}>
                Forgot password?
              </Link>
            </Flex>

            {/* Login Button */}
            <Button
              w="full"
              colorScheme="blue"
              size="lg"
              onClick={handleLogin}
              isLoading={isLoading}
              loadingText="Signing in..."
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            <Text color="gray.400" fontSize="sm" textAlign="center">
              Don't have an account?{' '}
              <Link 
                color="blue.400" 
                _hover={{ color: "blue.300" }}
                onClick={() => navigate('/signup')}
              >
                Sign up for free
              </Link>
            </Text>
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
