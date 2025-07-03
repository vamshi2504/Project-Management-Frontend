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
  Divider,
  Checkbox,
  SimpleGrid,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaGoogle, FaGithub, FaProjectDiagram, FaUser, FaPhone } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignup = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the Terms of Service and Privacy Policy.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Success',
        description: 'Account created successfully! Welcome to ProjectManager!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialSignup = (provider) => {
    toast({
      title: 'Feature Coming Soon',
      description: `${provider} signup will be available soon!`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex minH="100vh" bg="gray.900" position="relative">
      {/* Left Side - Visual (Fixed) */}
      <Box
        flex="1"
        position="fixed"
        left="0"
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
              Join Our Community
            </Heading>
            <Text fontSize="lg" maxW="md" opacity={0.9}>
              Create your account and start managing projects like a pro. Join thousands of teams already using ProjectManager.
            </Text>
          </VStack>
          <VStack spacing={3}>
            <HStack spacing={8}>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">10K+</Text>
                <Text fontSize="sm" opacity={0.8}>Users</Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">50K+</Text>
                <Text fontSize="sm" opacity={0.8}>Projects</Text>
              </VStack>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold">24/7</Text>
                <Text fontSize="sm" opacity={0.8}>Support</Text>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Right Side - Signup Form (Scrollable) */}
      <Box
        flex="1"
        ml={{ base: "0", lg: "50%" }}
        minH="100vh"
        overflowY="auto"
        bg="gray.900"
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
          <VStack spacing={6} mb={6}>
            <HStack spacing={3}>
              <Icon as={FaProjectDiagram} boxSize={8} color="blue.400" />
              <Heading size="lg" color="white">
                ProjectManager
              </Heading>
            </HStack>
            <VStack spacing={2}>
              <Heading size="md" color="white" textAlign="center">
                Create Your Account
              </Heading>
              <Text color="gray.400" textAlign="center">
                Join us and start managing your projects efficiently
              </Text>
            </VStack>
          </VStack>

          {/* Social Signup Buttons */}
          <VStack spacing={3} mb={6}>
            <Button
              w="full"
              variant="outline"
              borderColor="gray.600"
              color="white"
              _hover={{ bg: "gray.700", borderColor: "gray.500" }}
              leftIcon={<Icon as={FaGoogle} color="red.400" />}
              onClick={() => handleSocialSignup('Google')}
            >
              Sign up with Google
            </Button>
            <Button
              w="full"
              variant="outline"
              borderColor="gray.600"
              color="white"
              _hover={{ bg: "gray.700", borderColor: "gray.500" }}
              leftIcon={<Icon as={FaGithub} />}
              onClick={() => handleSocialSignup('GitHub')}
            >
              Sign up with GitHub
            </Button>
          </VStack>

          {/* Divider */}
          <HStack spacing={4} mb={6}>
            <Divider borderColor="gray.600" />
            <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
              Or create with email
            </Text>
            <Divider borderColor="gray.600" />
          </HStack>

          {/* Signup Form */}
          <VStack spacing={4}>
            {/* Name Fields */}
            <SimpleGrid columns={2} spacing={3} w="full">
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm">
                  First Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm">
                  Last Name
                </FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </FormControl>
            </SimpleGrid>

            {/* Email */}
            <FormControl isRequired>
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

            {/* Phone (Optional) */}
            <FormControl>
              <FormLabel color="gray.300" fontSize="sm">
                Phone Number (Optional)
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaPhone} color="gray.500" />
                </InputLeftElement>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </InputGroup>
            </FormControl>

            {/* Password */}
            <FormControl isRequired>
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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm">
                Confirm Password
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    color="gray.400"
                    _hover={{ color: "white" }}
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Terms Agreement */}
            <FormControl>
              <Checkbox
                name="agreeToTerms"
                isChecked={formData.agreeToTerms}
                onChange={handleInputChange}
                colorScheme="blue"
                color="gray.300"
                size="sm"
              >
                <Text fontSize="sm">
                  I agree to the{' '}
                  <Link color="blue.400" _hover={{ color: "blue.300" }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link color="blue.400" _hover={{ color: "blue.300" }}>
                    Privacy Policy
                  </Link>
                </Text>
              </Checkbox>
            </FormControl>

            {/* Signup Button */}
            <Button
              w="full"
              colorScheme="blue"
              size="lg"
              onClick={handleSignup}
              isLoading={isLoading}
              loadingText="Creating account..."
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Create Account
            </Button>

            {/* Login Link */}
            <Text color="gray.400" fontSize="sm" textAlign="center">
              Already have an account?{' '}
              <Link 
                color="blue.400" 
                _hover={{ color: "blue.300" }}
                onClick={() => navigate('/')}
              >
                Sign in here
              </Link>
            </Text>
          </VStack>
        </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Signup;
