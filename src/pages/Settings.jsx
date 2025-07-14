import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Container,
  Badge,
  Icon,
  Avatar,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Divider,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
} from '@chakra-ui/react';
import { 
  FaCog, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBell, 
  FaPalette, 
  FaLock, 
  FaCamera,
  FaSave,
  FaEdit,
  FaTrash,
  FaCheck,
  FaCalendarAlt,
} from 'react-icons/fa'; 

const Settings = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  
  // Modal controls
  const { isOpen: isAvatarOpen, onOpen: onAvatarOpen, onClose: onAvatarClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Profile state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate project manager with 5+ years of experience leading cross-functional teams and delivering successful projects.',
    avatar: null,
    title: 'Senior Project Manager',
    company: 'Tech Solutions Inc.',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    theme: 'system',
    dateFormat: 'MM/DD/YYYY',
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [activeTab, setActiveTab] = useState(0);

  const handleProfileChange = (field, value) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    
    toast({
      title: 'Preference Updated',
      description: 'Your preference has been saved successfully.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
    
    toast({
      title: 'Security Setting Updated',
      description: 'Your security setting has been saved successfully.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setIsEditing(false);
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditProfile(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
    onAvatarClose();
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call
    toast({
      title: 'Account Deletion Requested',
      description: 'Your account deletion request has been submitted. You will receive a confirmation email shortly.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
    onDeleteClose();
  };

  return (
    <Box bg={bgColor} minH="100vh">
      
      <Container maxW="7xl" py={6}>
        {/* Simple Header */}
        <Box mb={8}>
          <VStack spacing={2} align="start">
            <Heading 
              size="2xl" 
              color={textColor}
              fontWeight="semibold"
            >
              Settings
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Manage your profile, preferences, and account settings
            </Text>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box maxW="6xl" mx="auto">
          <Tabs colorScheme="blue" variant="enclosed" index={activeTab} onChange={setActiveTab}>
            <Box
              bg={cardBg}
              borderRadius="2xl"
              border="1px"
              borderColor={borderColor}
              overflow="hidden"
              boxShadow="xl"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "2xl",
                transform: "translateY(-2px)"
              }}
            >
              {/* Tab Navigation */}
              <Box bg={useColorModeValue('gray.50', 'gray.750')} px={6} py={4}>
                <TabList border="none" gap={2}>
                  <Tab 
                    _selected={{ 
                      color: "blue.500", 
                      bg: cardBg,
                      borderColor: "blue.500",
                      borderRadius: "lg",
                      boxShadow: "sm"
                    }}
                    _hover={{ 
                      bg: useColorModeValue('white', 'gray.700'),
                      borderRadius: "lg"
                    }}
                    px={6}
                    py={3}
                    borderRadius="lg"
                    transition="all 0.2s"
                  >
                    <Icon as={FaUser} mr={2} />
                    Profile
                  </Tab>
                  <Tab 
                    _selected={{ 
                      color: "blue.500", 
                      bg: cardBg,
                      borderColor: "blue.500",
                      borderRadius: "lg",
                      boxShadow: "sm"
                    }}
                    _hover={{ 
                      bg: useColorModeValue('white', 'gray.700'),
                      borderRadius: "lg"
                    }}
                    px={6}
                    py={3}
                    borderRadius="lg"
                    transition="all 0.2s"
                  >
                    <Icon as={FaBell} mr={2} />
                    Notifications
                  </Tab>
                  <Tab 
                    _selected={{ 
                      color: "blue.500", 
                      bg: cardBg,
                      borderColor: "blue.500",
                      borderRadius: "lg",
                      boxShadow: "sm"
                    }}
                    _hover={{ 
                      bg: useColorModeValue('white', 'gray.700'),
                      borderRadius: "lg"
                    }}
                    px={6}
                    py={3}
                    borderRadius="lg"
                    transition="all 0.2s"
                  >
                    <Icon as={FaPalette} mr={2} />
                    Appearance
                  </Tab>
                  <Tab 
                    _selected={{ 
                      color: "blue.500", 
                      bg: cardBg,
                      borderColor: "blue.500",
                      borderRadius: "lg",
                      boxShadow: "sm"
                    }}
                    _hover={{ 
                      bg: useColorModeValue('white', 'gray.700'),
                      borderRadius: "lg"
                    }}
                    px={6}
                    py={3}
                    borderRadius="lg"
                    transition="all 0.2s"
                  >
                    <Icon as={FaLock} mr={2} />
                    Security
                  </Tab>
                </TabList>
              </Box>

              {/* Tab Content */}
              <TabPanels>
            {/* Profile Tab */}
            <TabPanel p={8}>
              <VStack spacing={8} align="stretch">
                {/* Profile Header */}
                <Flex justify="space-between" align="center" mb={4}>
                  <VStack align="start" spacing={1}>
                    <Heading size="xl" color={textColor}>
                      Profile Information
                    </Heading>
                    <Text color="gray.500" fontSize="md">
                      Update your personal information and profile details
                    </Text>
                  </VStack>
                  {!isEditing ? (
                    <Button
                      leftIcon={<Icon as={FaEdit} />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      size="lg"
                      borderRadius="xl"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <HStack spacing={3}>
                      <Button
                        variant="ghost"
                        onClick={handleCancelEdit}
                        size="lg"
                        borderRadius="xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        leftIcon={<Icon as={FaSave} />}
                        colorScheme="blue"
                        onClick={handleSaveProfile}
                        size="lg"
                        borderRadius="xl"
                      >
                        Save Changes
                      </Button>
                    </HStack>
                  )}
                </Flex>

                <Divider />

                {/* Avatar Section */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <Heading size="lg" color={textColor} mb={6}>
                    Profile Picture
                  </Heading>
                  <HStack spacing={8} align="start">
                    <Avatar
                      size="2xl"
                      name={`${profile.firstName} ${profile.lastName}`}
                      src={profile.avatar || editProfile.avatar}
                      border="4px solid"
                      borderColor={useColorModeValue('gray.100', 'gray.600')}
                      boxShadow="xl"
                    />
                    <VStack align="start" spacing={4} flex="1">
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="semibold" color={textColor} fontSize="lg">
                          Choose your profile picture
                        </Text>
                        <Text fontSize="md" color="gray.500" maxW="md">
                          Upload a profile picture to help others recognize you across the platform. Recommended size is 400x400 pixels.
                        </Text>
                      </VStack>
                      {isEditing && (
                        <Button
                          leftIcon={<Icon as={FaCamera} />}
                          variant="outline"
                          colorScheme="blue"
                          onClick={onAvatarOpen}
                          size="lg"
                          borderRadius="xl"
                        >
                          Change Photo
                        </Button>
                      )}
                    </VStack>
                  </HStack>
                </Box>

                {/* Personal Information */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <Heading size="lg" color={textColor} mb={6}>
                    Personal Information
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        First Name
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaUser} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          value={isEditing ? editProfile.firstName : profile.firstName}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          isDisabled={!isEditing}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px"
                          borderColor={borderColor}
                          color={textColor}
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ borderColor: "blue.500" }}
                          size="lg"
                          borderRadius="xl"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Last Name
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaUser} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          value={isEditing ? editProfile.lastName : profile.lastName}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          isDisabled={!isEditing}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px"
                          borderColor={borderColor}
                          color={textColor}
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ borderColor: "blue.500" }}
                          size="lg"
                          borderRadius="xl"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Email Address
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaEnvelope} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          value={isEditing ? editProfile.email : profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          isDisabled={!isEditing}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px"
                          borderColor={borderColor}
                          color={textColor}
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ borderColor: "blue.500" }}
                          size="lg"
                          borderRadius="xl"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Phone Number
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaPhone} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          value={isEditing ? editProfile.phone : profile.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          isDisabled={!isEditing}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px"
                          borderColor={borderColor}
                          color={textColor}
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ borderColor: "blue.500" }}
                          size="lg"
                          borderRadius="xl"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Job Title
                      </FormLabel>
                      <Input
                        value={isEditing ? editProfile.title : profile.title}
                        onChange={(e) => handleProfileChange('title', e.target.value)}
                        isDisabled={!isEditing}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px"
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500" }}
                        size="lg"
                        borderRadius="xl"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Company
                      </FormLabel>
                      <Input
                        value={isEditing ? editProfile.company : profile.company}
                        onChange={(e) => handleProfileChange('company', e.target.value)}
                        isDisabled={!isEditing}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px"
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500" }}
                        size="lg"
                        borderRadius="xl"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <VStack spacing={6} mt={8}>
                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Location
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FaMapMarkerAlt} color="gray.500" />
                        </InputLeftElement>
                        <Input
                          value={isEditing ? editProfile.location : profile.location}
                          onChange={(e) => handleProfileChange('location', e.target.value)}
                          isDisabled={!isEditing}
                          bg={useColorModeValue('white', 'gray.700')}
                          border="1px"
                          borderColor={borderColor}
                          color={textColor}
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ borderColor: "blue.500" }}
                          size="lg"
                          borderRadius="xl"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                        Bio
                      </FormLabel>
                      <Textarea
                        value={isEditing ? editProfile.bio : profile.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        isDisabled={!isEditing}
                        bg={useColorModeValue('white', 'gray.700')}
                        border="1px"
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500" }}
                        rows={4}
                        resize="vertical"
                        placeholder="Tell us about yourself..."
                        borderRadius="xl"
                      />
                    </FormControl>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel p={8}>
              <VStack spacing={8} align="stretch">
                {/* Notifications Header */}
                <VStack align="start" spacing={1} mb={4}>
                  <Heading size="xl" color={textColor}>
                    Notification Preferences
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    Customize how and when you receive notifications about project activities
                  </Text>
                </VStack>

                <Divider />

                {/* Email Notifications Section */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaEnvelope} color="blue.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Email Notifications
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Control which events trigger email notifications
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <VStack spacing={6} align="stretch">
                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Project Updates
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Get notified when projects you're involved in are updated, including status changes, new assignments, and milestone completions
                            </Text>
                          </VStack>
                          <Switch
                            isChecked={preferences.emailNotifications}
                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                            colorScheme="blue"
                            size="lg"
                          />
                        </HStack>
                      </Box>

                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Weekly Reports
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Receive a comprehensive weekly summary of your project progress, completed tasks, and upcoming deadlines
                            </Text>
                          </VStack>
                          <Switch
                            isChecked={preferences.weeklyReports}
                            onChange={(e) => handlePreferenceChange('weeklyReports', e.target.checked)}
                            colorScheme="blue"
                            size="lg"
                          />
                        </HStack>
                      </Box>

                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Task Reminders
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Get reminded about upcoming task deadlines, overdue items, and priority assignments that need attention
                            </Text>
                          </VStack>
                          <Switch
                            isChecked={preferences.taskReminders}
                            onChange={(e) => handlePreferenceChange('taskReminders', e.target.checked)}
                            colorScheme="blue"
                            size="lg"
                          />
                        </HStack>
                      </Box>
                    </VStack>
                  </VStack>
                </Box>

                {/* Push Notifications Section */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaBell} color="green.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Push Notifications
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Real-time browser notifications for immediate updates
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Box
                      p={6}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderRadius="xl"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex="1">
                          <Text fontWeight="semibold" color={textColor} fontSize="lg">
                            Browser Notifications
                          </Text>
                          <Text fontSize="sm" color="gray.500" maxW="md">
                            Receive instant notifications in your browser for urgent updates, mentions, and time-sensitive project activities
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={preferences.pushNotifications}
                          onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                          colorScheme="blue"
                          size="lg"
                        />
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel p={8}>
              <VStack spacing={8} align="stretch">
                {/* Appearance Header */}
                <VStack align="start" spacing={1} mb={4}>
                  <Heading size="xl" color={textColor}>
                    Appearance Settings
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    Customize the visual appearance and display preferences of your workspace
                  </Text>
                </VStack>

                <Divider />

                {/* Theme Settings Section */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaPalette} color="purple.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Theme & Display
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Choose your preferred color scheme and visual style
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <FormControl>
                          <FormLabel color={textColor} fontSize="sm" fontWeight="semibold" mb={3}>
                            Color Theme
                          </FormLabel>
                          <Text fontSize="xs" color="gray.500" mb={4}>
                            Choose between light, dark, or automatic theme based on your system settings
                          </Text>
                          <Select
                            value={preferences.theme}
                            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                            bg={useColorModeValue('gray.50', 'gray.600')}
                            border="1px"
                            borderColor={borderColor}
                            color={textColor}
                            _hover={{ borderColor: "gray.500" }}
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            size="lg"
                            borderRadius="lg"
                          >
                            <option value="light" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              ☀️ Light Theme
                            </option>
                            <option value="dark" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              🌙 Dark Theme
                            </option>
                            <option value="system" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              🖥️ System Default
                            </option>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <FormControl>
                          <FormLabel color={textColor} fontSize="sm" fontWeight="semibold" mb={3}>
                            Date Format
                          </FormLabel>
                          <Text fontSize="xs" color="gray.500" mb={4}>
                            Choose how dates are displayed throughout the application
                          </Text>
                          <Select
                            value={preferences.dateFormat}
                            onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                            bg={useColorModeValue('gray.50', 'gray.600')}
                            border="1px"
                            borderColor={borderColor}
                            color={textColor}
                            _hover={{ borderColor: "gray.500" }}
                            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            size="lg"
                            borderRadius="lg"
                          >
                            <option value="MM/DD/YYYY" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              📅 MM/DD/YYYY (US Format)
                            </option>
                            <option value="DD/MM/YYYY" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              📅 DD/MM/YYYY (EU Format)
                            </option>
                            <option value="YYYY-MM-DD" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                              📅 YYYY-MM-DD (ISO Format)
                            </option>
                          </Select>
                        </FormControl>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                {/* Preview Section */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaCheck} color="green.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Preview
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          See how your settings will appear
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Box
                      p={6}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderRadius="xl"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <VStack spacing={4} align="start">
                        <HStack spacing={3}>
                          <Text fontWeight="semibold" color={textColor}>
                            Current Theme:
                          </Text>
                          <Badge
                            colorScheme={preferences.theme === 'dark' ? 'gray' : preferences.theme === 'light' ? 'yellow' : 'blue'}
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {preferences.theme === 'system' ? '🖥️ System' : preferences.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                          </Badge>
                        </HStack>
                        <HStack spacing={3}>
                          <Text fontWeight="semibold" color={textColor}>
                            Date Format:
                          </Text>
                          <Text color="blue.500" fontWeight="medium">
                            {new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: preferences.dateFormat.includes('MM/DD') ? '2-digit' : 'numeric',
                              day: '2-digit'
                            })}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel p={8}>
              <VStack spacing={8} align="stretch">
                {/* Security Header */}
                <VStack align="start" spacing={1} mb={4}>
                  <Heading size="xl" color={textColor}>
                    Security & Privacy
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    Manage your account security settings and privacy preferences
                  </Text>
                </VStack>

                <Divider />

                {/* Authentication Settings */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaLock} color="green.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Authentication & Access
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          Control how you access your account and enhance security
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <VStack spacing={6} align="stretch">
                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Two-Factor Authentication
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Add an extra layer of security to your account with SMS or authenticator app verification
                            </Text>
                            {security.twoFactorAuth && (
                              <Badge colorScheme="green" fontSize="xs" mt={2}>
                                ✓ Enabled
                              </Badge>
                            )}
                          </VStack>
                          <Switch
                            isChecked={security.twoFactorAuth}
                            onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                            colorScheme="blue"
                            size="lg"
                          />
                        </HStack>
                      </Box>

                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Login Alerts
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Get notified via email when someone logs into your account from a new device or location
                            </Text>
                          </VStack>
                          <Switch
                            isChecked={security.loginAlerts}
                            onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                            colorScheme="blue"
                            size="lg"
                          />
                        </HStack>
                      </Box>

                      <Box
                        p={6}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="xl"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <VStack align="start" spacing={4}>
                          <VStack align="start" spacing={2}>
                            <Text fontWeight="semibold" color={textColor} fontSize="lg">
                              Session Timeout
                            </Text>
                            <Text fontSize="sm" color="gray.500" maxW="md">
                              Automatically log out after a period of inactivity to protect your account
                            </Text>
                          </VStack>
                          <FormControl maxW="300px">
                            <Select
                              value={security.sessionTimeout}
                              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                              bg={useColorModeValue('gray.50', 'gray.600')}
                              border="1px"
                              borderColor={borderColor}
                              color={textColor}
                              _hover={{ borderColor: "gray.500" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                              size="lg"
                              borderRadius="lg"
                            >
                              <option value="15" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                                ⏱️ 15 minutes
                              </option>
                              <option value="30" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                                ⏱️ 30 minutes
                              </option>
                              <option value="60" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                                ⏱️ 1 hour
                              </option>
                              <option value="120" style={{ backgroundColor: useColorModeValue('white', '#2D3748') }}>
                                ⏱️ 2 hours
                              </option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </Box>
                    </VStack>
                  </VStack>
                </Box>

                {/* Danger Zone */}
                <Box
                  bg={useColorModeValue('gray.50', 'gray.750')}
                  borderRadius="2xl"
                  p={8}
                  border="1px"
                  borderColor={borderColor}
                  position="relative"
                >
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4} mb={2}>
                      <Icon as={FaTrash} color="red.500" boxSize={6} />
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color="red.600" _dark={{ color: "red.400" }}>
                          Danger Zone
                        </Heading>
                        <Text color="red.500" fontSize="sm" _dark={{ color: "red.300" }}>
                          Irreversible and destructive actions that cannot be undone
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Box
                      p={6}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderRadius="xl"
                      border="1px"
                      borderColor="red.200"
                      _dark={{
                        borderColor: "red.600"
                      }}
                    >
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex="1">
                          <Text fontWeight="semibold" color="red.700" fontSize="lg" _dark={{ color: "red.300" }}>
                            Delete Account
                          </Text>
                          <Text fontSize="sm" color="red.600" maxW="md" _dark={{ color: "red.400" }}>
                            Permanently delete your account and all associated data including projects, tasks, files, and settings. This action cannot be reversed.
                          </Text>
                          <Text fontSize="xs" color="red.500" fontStyle="italic" mt={2} _dark={{ color: "red.500" }}>
                            ⚠️ You will receive a confirmation email before deletion
                          </Text>
                        </VStack>
                        <Button
                          leftIcon={<Icon as={FaTrash} />}
                          colorScheme="red"
                          variant="outline"
                          onClick={onDeleteOpen}
                          size="lg"
                          borderRadius="xl"
                          _hover={{
                            bg: "red.600",
                            color: "white",
                            borderColor: "red.600"
                          }}
                        >
                          Delete Account
                        </Button>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
            </Box>
          </Tabs>
        </Box>
      </Container>

      {/* Avatar Upload Modal */}
      <Modal isOpen={isAvatarOpen} onClose={onAvatarClose}>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color={textColor}>
            <HStack spacing={3}>
              <Icon as={FaCamera} color="blue.400" />
              <Text>Change Profile Picture</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Choose a new profile picture. Recommended size is 400x400 pixels.
              </Text>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                display="none"
                id="avatar-upload"
              />
              <Button
                as="label"
                htmlFor="avatar-upload"
                leftIcon={<Icon as={FaCamera} />}
                colorScheme="blue"
                cursor="pointer"
                size="lg"
                w="full"
              >
                Select Image
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onAvatarClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Confirmation */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={cardBg} border="1px" borderColor={borderColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={textColor}>
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody color={textColor}>
              Are you sure you want to delete your account? This action cannot be undone.
              All your projects, tasks, and data will be permanently removed.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete Account
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Settings