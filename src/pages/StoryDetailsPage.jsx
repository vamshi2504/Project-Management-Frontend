import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Avatar,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  useDisclosure,
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  IconButton,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { 
  ArrowBackIcon, 
  EditIcon, 
  AddIcon,
  CalendarIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import { 
  FaGripVertical, 
  FaUser, 
  FaClock, 
  FaTasks, 
  FaCalendarAlt, 
  FaTag, 
  FaProjectDiagram, 
  FaCode,
  FaChartLine,
  FaBookOpen,
  FaLightbulb,
  FaCheckCircle,
  FaUsers,
  FaComment,
  FaBullseye,
  FaListUl,
} from 'react-icons/fa';
import ProjectCalendar from '../components/ui/ProjectCalendar';

// Mock data for story details
const mockStoryData = {
  id: 1,
  title: 'As a customer, I want to filter products so I can find what I need quickly',
  description: 'Users should be able to filter products by category, price range, brand, ratings, and availability. Filters should be combinable and results should update in real-time.',
  status: 'In Progress',
  priority: 'High',
  startDate: '2025-06-01',
  dueDate: '2025-08-15',
  assignedTeam: ['You', 'Sarah Wilson', 'Tom Brown', 'Alice Davis'],
  project: 'E-commerce Platform',
  progress: 60,
  estimatedHours: 80,
  loggedHours: 48,
  epic: 'Product Discovery Enhancement',
  features: [
    {
      id: 1,
      name: 'Filter Panel Component',
      description: 'Create a reusable filter panel with multiple filter options',
      status: 'Done',
      progress: 100,
      assignee: 'Sarah Wilson',
      estimatedHours: 16,
      loggedHours: 18,
      dueDate: '2025-07-10',
      priority: 'High',
    },
    {
      id: 2,
      name: 'Real-time Filter Logic',
      description: 'Implement real-time filtering with debounced search',
      status: 'In Progress',
      progress: 75,
      assignee: 'Tom Brown',
      estimatedHours: 24,
      loggedHours: 18,
      dueDate: '2025-07-20',
      priority: 'High',
    },
    {
      id: 3,
      name: 'Filter State Management',
      description: 'Manage filter state across page navigation and sessions',
      status: 'To Do',
      progress: 0,
      assignee: 'Alice Davis',
      estimatedHours: 20,
      loggedHours: 0,
      dueDate: '2025-08-05',
      priority: 'Medium',
    },
    {
      id: 4,
      name: 'Mobile Filter Interface',
      description: 'Design and implement mobile-responsive filter UI',
      status: 'To Do',
      progress: 0,
      assignee: 'You',
      estimatedHours: 20,
      loggedHours: 0,
      dueDate: '2025-08-10',
      priority: 'Medium',
    },
  ],
  userRequirements: [
    {
      id: 1,
      requirement: 'Filter panel must be easily accessible on product pages',
      priority: 'High',
      status: 'Satisfied',
      validationCriteria: 'Filter panel visible within 3 seconds of page load',
    },
    {
      id: 2,
      requirement: 'Users can filter by category, price, brand, rating',
      priority: 'High',
      status: 'In Progress',
      validationCriteria: 'All filter types functional with immediate visual feedback',
    },
    {
      id: 3,
      requirement: 'Multiple filters can be applied simultaneously',
      priority: 'High',
      status: 'In Progress',
      validationCriteria: 'Up to 10 filters can be active without performance issues',
    },
    {
      id: 4,
      requirement: 'Filter results update without page reload',
      priority: 'High',
      status: 'In Progress',
      validationCriteria: 'Results update within 500ms of filter change',
    },
    {
      id: 5,
      requirement: 'Applied filters are clearly visible to users',
      priority: 'Medium',
      status: 'To Do',
      validationCriteria: 'Active filters shown as removable tags above results',
    },
    {
      id: 6,
      requirement: 'Users can easily clear individual or all filters',
      priority: 'Medium',
      status: 'To Do',
      validationCriteria: 'Clear individual and clear all buttons are prominently displayed',
    },
    {
      id: 7,
      requirement: 'Filter state persists during browsing session',
      priority: 'Low',
      status: 'To Do',
      validationCriteria: 'Filters maintained when navigating between product pages',
    },
    {
      id: 8,
      requirement: 'Mobile-friendly filter interface',
      priority: 'Medium',
      status: 'To Do',
      validationCriteria: 'Filter interface usable on screens 320px and larger',
    },
  ],
};

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return 'gray';
    case 'In Progress':
      return 'blue';
    case 'Done':
      return 'green';
    case 'Satisfied':
      return 'green';
    default:
      return 'gray';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'green';
    default:
      return 'gray';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFeatureOpen, onOpen: onFeatureOpen, onClose: onFeatureClose } = useDisclosure();

  const [story, setStory] = useState(mockStoryData);
  const [editFormData, setEditFormData] = useState({
    title: story.title,
    description: story.description,
    status: story.status,
    priority: story.priority,
    dueDate: story.dueDate,
  });

  const [featureFormData, setFeatureFormData] = useState({
    name: '',
    description: '',
    assignee: 'You',
    dueDate: '',
    priority: 'Medium',
    estimatedHours: '',
  });

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sarah Wilson',
      content: 'I\'ve completed the filter panel component. The design is responsive and follows our design system guidelines.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      avatar: 'Sarah Wilson'
    },
    {
      id: 2,
      author: 'Tom Brown',
      content: 'Working on the real-time filtering logic. Should have it ready by end of week. Performance is looking good so far.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      avatar: 'Tom Brown'
    },
    {
      id: 3,
      author: 'You',
      content: 'Great progress team! Let me know if you need any help with the mobile interface implementation.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      avatar: 'You'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  // Calculate story statistics
  const stats = useMemo(() => {
    const totalFeatures = story.features.length;
    const completedFeatures = story.features.filter(feature => feature.status === 'Done').length;
    const inProgressFeatures = story.features.filter(feature => feature.status === 'In Progress').length;
    const todoFeatures = story.features.filter(feature => feature.status === 'To Do').length;
    
    const totalRequirements = story.userRequirements.length;
    const satisfiedRequirements = story.userRequirements.filter(req => req.status === 'Satisfied').length;
    const inProgressRequirements = story.userRequirements.filter(req => req.status === 'In Progress').length;
    
    return { 
      totalFeatures, 
      completedFeatures, 
      inProgressFeatures, 
      todoFeatures,
      totalRequirements,
      satisfiedRequirements,
      inProgressRequirements
    };
  }, [story]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureInputChange = (e) => {
    const { name, value } = e.target;
    setFeatureFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveStory = () => {
    toast({
      title: "Story Updated",
      description: "Story details have been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onEditClose();
  };

  const handleCreateFeature = () => {
    if (!featureFormData.name.trim() || !featureFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Feature Created",
      description: `"${featureFormData.name}" has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setFeatureFormData({
      name: '',
      description: '',
      assignee: 'You',
      dueDate: '',
      priority: 'Medium',
      estimatedHours: '',
    });
    onFeatureClose();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      avatar: 'You'
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    
    toast({
      title: "Comment added.",
      description: "Your comment has been posted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const formatCommentDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleFeatureClick = (featureId) => {
    navigate(`/features/${featureId}`);
  };

  const FeatureCard = ({ feature }) => (
    <Card
      bg="gray.800"
      borderRadius="xl"
      border="1px"
      borderColor="gray.700"
      _hover={{ 
        boxShadow: 'xl', 
        transform: 'translateY(-2px)',
        borderColor: 'gray.600',
        cursor: 'pointer'
      }}
      transition="all 0.2s"
      onClick={() => handleFeatureClick(feature.id)}
      mb={4}
    >
      <CardBody p={5}>
        {/* Priority and assignee */}
        <Flex align="center" justify="space-between" mb={3}>
          <Badge 
            colorScheme={getPriorityColor(feature.priority)}
            variant="subtle"
            borderRadius="full"
            fontSize="xs"
            px={2}
          >
            {feature.priority} Priority
          </Badge>
          <HStack spacing={2}>
            <Avatar name={feature.assignee} size="xs" />
            <Text color="gray.400" fontSize="xs">
              {feature.assignee}
            </Text>
          </HStack>
        </Flex>

        {/* Title */}
        <Heading size="sm" color="white" mb={2} noOfLines={2}>
          {feature.name}
        </Heading>

        {/* Description */}
        <Text color="gray.400" fontSize="sm" mb={4} noOfLines={3}>
          {feature.description}
        </Text>

        {/* Progress */}
        <Box mb={3}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text color="gray.400" fontSize="xs">Progress</Text>
            <Text color="white" fontSize="sm" fontWeight="bold">
              {feature.progress}%
            </Text>
          </Flex>
          <Progress 
            colorScheme={getStatusColor(feature.status)} 
            value={feature.progress} 
            borderRadius="full"
            size="sm"
            bg="gray.700"
          />
        </Box>

        <Divider borderColor="gray.700" mb={3} />

        {/* Footer */}
        <Flex justify="space-between" align="center">
          <HStack spacing={1}>
            <Icon as={FaClock} color="gray.500" boxSize={3} />
            <Text color="gray.400" fontSize="xs">
              Due: {formatDate(feature.dueDate)}
            </Text>
          </HStack>
          <Badge 
            colorScheme={getStatusColor(feature.status)}
            variant="subtle"
            borderRadius="full"
            fontSize="xs"
            px={2}
          >
            {feature.status}
          </Badge>
        </Flex>
      </CardBody>
    </Card>
  );

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={6} maxW="1400px" mx="auto">
        {/* Header */}
        <Flex 
          justify="space-between" 
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <HStack spacing={4} w="full" overflowX="auto">
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={() => navigate('/board')}
              variant="ghost"
              colorScheme="blue"
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
              flexShrink={0}
            >
              Back to Board
            </Button>
            <Divider 
              orientation="vertical" 
              h={6} 
              borderColor="gray.600" 
              display={{ base: "none", md: "block" }}
            />
            <HStack spacing={3} flex={1} minW={0}>
              <Icon 
                as={FaBookOpen} 
                color="purple.400" 
                boxSize={{ base: 5, md: 6 }}
                flexShrink={0}
              />
              <VStack align="start" spacing={0} minW={0}>
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.400"
                  noOfLines={1}
                >
                  {story.project} • User Story #{story.id}
                </Text>
                <Heading 
                  size={{ base: "md", md: "lg" }} 
                  color="white" 
                  noOfLines={2}
                >
                  {story.title}
                </Heading>
              </VStack>
            </HStack>
          </HStack>

          <HStack 
            spacing={3}
            flexWrap={{ base: "wrap", md: "nowrap" }}
            w={{ base: "full", md: "auto" }}
            justify={{ base: "stretch", md: "flex-end" }}
          >
            <Button
              leftIcon={<EditIcon />}
              onClick={onEditOpen}
              variant="outline"
              colorScheme="blue"
              color="gray.300"
              borderColor="gray.600"
              _hover={{ bg: "blue.600", borderColor: "blue.600", color: "white" }}
              size={{ base: "md", md: "md" }}
              flex={{ base: 1, md: "none" }}
            >
              Edit Story
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<AddIcon />}
              onClick={onFeatureOpen}
              size={{ base: "md", md: "lg" }}
              borderRadius="xl"
              px={{ base: 4, md: 6 }}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
              transition="all 0.2s"
              flex={{ base: 1, md: "none" }}
            >
              Add Feature
            </Button>
          </HStack>
        </Flex>

        {/* Story Information Card */}
        <Card bg={cardBg} border="1px" borderColor={borderColor} mb={8}>
          <CardHeader>
            <Flex 
              justify="space-between" 
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Heading size={{ base: "md", lg: "lg" }} color="white">
                Story Overview
              </Heading>
              <HStack 
                spacing={3}
                flexWrap="wrap"
                justify={{ base: "start", md: "end" }}
              >
                <Badge 
                  colorScheme={getStatusColor(story.status)}
                  variant="subtle"
                  borderRadius="full"
                  fontSize="sm"
                  px={4}
                  py={2}
                >
                  {story.status}
                </Badge>
                <Badge 
                  colorScheme={getPriorityColor(story.priority)}
                  variant="subtle"
                  borderRadius="full"
                  fontSize="sm"
                  px={4}
                  py={2}
                >
                  {story.priority} Priority
                </Badge>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={6} align="stretch">
              {/* Description */}
              <Box>
                <Text color="gray.300" fontSize="md" mb={2} fontWeight="medium">
                  Description
                </Text>
                <Text color="gray.400" fontSize="sm" lineHeight="1.6">
                  {story.description}
                </Text>
              </Box>

              {/* Progress */}
              <Box>
                <Flex justify="space-between" align="center" mb={3}>
                  <Text color="gray.300" fontSize="md" fontWeight="medium">
                    Progress
                  </Text>
                  <Text color="white" fontSize="lg" fontWeight="bold">
                    {story.progress}%
                  </Text>
                </Flex>
                <Progress 
                  colorScheme={getStatusColor(story.status)} 
                  value={story.progress} 
                  borderRadius="full"
                  size="lg"
                  bg="gray.700"
                />
                <Flex justify="space-between" mt={2}>
                  <Text color="gray.500" fontSize="sm">
                    {stats.completedFeatures} of {stats.totalFeatures} features completed
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {story.loggedHours}h / {story.estimatedHours}h logged
                  </Text>
                </Flex>
              </Box>

              {/* Timeline and Team */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                    Timeline
                  </Text>
                  <VStack spacing={2} align="stretch">
                    <HStack spacing={3}>
                      <Icon as={CalendarIcon} color="green.400" boxSize={4} />
                      <Text color="gray.400" fontSize="sm">
                        Started: {formatDate(story.startDate)}
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FaCalendarAlt} color="orange.400" boxSize={4} />
                      <Text color="gray.400" fontSize="sm">
                        Due: {formatDate(story.dueDate)}
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FaProjectDiagram} color="purple.400" boxSize={4} />
                      <Text color="gray.400" fontSize="sm">
                        Epic: {story.epic}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                    Team Members
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {story.assignedTeam.map((member, index) => (
                      <HStack 
                        key={index} 
                        spacing={2} 
                        bg="gray.700" 
                        px={3} 
                        py={1} 
                        borderRadius="full"
                        minW={0}
                      >
                        <Avatar name={member} size="xs" />
                        <Text 
                          color="white" 
                          fontSize="sm"
                          noOfLines={1}
                        >
                          {member}
                        </Text>
                      </HStack>
                    ))}
                  </Flex>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
          <Stat bg={cardBg} p={4} borderRadius="xl" border="1px" borderColor={borderColor}>
            <StatLabel color="gray.400">Total Features</StatLabel>
            <StatNumber color="white">{stats.totalFeatures}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="xl" border="1px" borderColor={borderColor}>
            <StatLabel color="gray.400">Completed</StatLabel>
            <StatNumber color="green.400">{stats.completedFeatures}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="xl" border="1px" borderColor={borderColor}>
            <StatLabel color="gray.400">In Progress</StatLabel>
            <StatNumber color="blue.400">{stats.inProgressFeatures}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} borderRadius="xl" border="1px" borderColor={borderColor}>
            <StatLabel color="gray.400">To Do</StatLabel>
            <StatNumber color="gray.400">{stats.todoFeatures}</StatNumber>
          </Stat>
        </SimpleGrid>

        <Flex gap={6} align="start" direction={{ base: "column", lg: "row" }}>
          {/* Main Content */}
          <VStack flex={2} align="stretch" spacing={6}>
            {/* Features Section */}
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack 
                  justify="space-between" 
                  align="center"
                  flexWrap={{ base: "wrap", sm: "nowrap" }}
                  gap={3}
                >
                  <HStack spacing={3}>
                    <Icon as={FaLightbulb} color="blue.400" boxSize={5} />
                    <Heading size={{ base: "sm", md: "md" }} color="white">
                      Features ({stats.totalFeatures})
                    </Heading>
                  </HStack>
                  <Button
                    size="sm"
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={onFeatureOpen}
                    color="gray.300"
                    borderColor="gray.600"
                    _hover={{ bg: "blue.600", borderColor: "blue.600", color: "white" }}
                    flexShrink={0}
                  >
                    Add Feature
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {story.features.map((feature) => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* User Requirements Section */}
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3} flexWrap="wrap">
                  <Icon as={FaBullseye} color="green.400" boxSize={5} />
                  <Heading size={{ base: "sm", md: "md" }} color="white">
                    User Requirements ({story.userRequirements.length})
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {story.userRequirements.map((requirement) => (
                    <Box
                      key={requirement.id}
                      bg="gray.700"
                      p={4}
                      borderRadius="xl"
                      border="1px"
                      borderColor="gray.600"
                    >
                      <VStack align="stretch" spacing={3}>
                        <Flex 
                          justify="space-between" 
                          align="start"
                          direction={{ base: "column", sm: "row" }}
                          gap={3}
                        >
                          <HStack spacing={3} flex={1} minW={0}>
                            <Icon 
                              as={requirement.status === 'Satisfied' ? FaCheckCircle : FaListUl} 
                              color={requirement.status === 'Satisfied' ? 'green.400' : 'gray.400'}
                              boxSize={4}
                              mt={0.5}
                              flexShrink={0}
                            />
                            <Text 
                              color="gray.300" 
                              fontSize="sm" 
                              lineHeight="1.6"
                              minW={0}
                            >
                              {requirement.requirement}
                            </Text>
                          </HStack>
                          <HStack 
                            spacing={2}
                            flexWrap="wrap"
                            justify={{ base: "start", sm: "end" }}
                          >
                            <Badge 
                              colorScheme={getStatusColor(requirement.status)}
                              variant="subtle"
                              borderRadius="full"
                              fontSize="xs"
                              px={2}
                            >
                              {requirement.status}
                            </Badge>
                            <Badge 
                              colorScheme={getPriorityColor(requirement.priority)}
                              variant="outline"
                              borderRadius="full"
                              fontSize="xs"
                              px={2}
                            >
                              {requirement.priority}
                            </Badge>
                          </HStack>
                        </Flex>
                        <Box pl={{ base: 7, sm: 7 }}>
                          <Text color="gray.500" fontSize="xs" fontWeight="medium">
                            Validation: {requirement.validationCriteria}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Sidebar */}
          <VStack flex={1} align="stretch" spacing={6} minW={{ base: "full", lg: "300px" }}>
            {/* Project Calendar */}
            <ProjectCalendar storyData={story} />

            {/* Requirements Stats */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="sm" color="gray.300">Requirements Status</Heading>
                  
                  <SimpleGrid columns={{ base: 3, lg: 1 }} spacing={3} w="full">
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">Total</StatLabel>
                      <StatNumber fontSize="md" color="white">
                        {stats.totalRequirements}
                      </StatNumber>
                    </Stat>
                    
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">Satisfied</StatLabel>
                      <StatNumber fontSize="md" color="green.400">
                        {stats.satisfiedRequirements}
                      </StatNumber>
                    </Stat>
                    
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">In Progress</StatLabel>
                      <StatNumber fontSize="md" color="blue.400">
                        {stats.inProgressRequirements}
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Comments Section */}
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4}>
                  <HStack justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Icon as={FaComment} color="purple.400" boxSize={5} />
                      <Heading size="sm" color="white">
                        Comments ({comments.length})
                      </Heading>
                    </HStack>
                  </HStack>
                  
                  {/* Add Comment */}
                  <VStack spacing={2} w="full">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                      rows={3}
                      resize="vertical"
                    />
                    <Flex justify="flex-end" w="full">
                      <Button
                        colorScheme="purple"
                        size="sm"
                        onClick={handleAddComment}
                        isDisabled={!newComment.trim()}
                        leftIcon={<AddIcon />}
                      >
                        Add Comment
                      </Button>
                    </Flex>
                  </VStack>

                  <Divider borderColor="gray.600" />

                  {/* Comments List */}
                  <VStack spacing={4} w="full" maxH="400px" overflowY="auto">
                    {comments.map((comment) => (
                      <Box
                        key={comment.id}
                        w="full"
                        p={4}
                        borderRadius="xl"
                        bg="gray.700"
                        border="1px"
                        borderColor="gray.600"
                      >
                        <HStack justify="space-between" align="start" mb={3}>
                          <HStack spacing={3}>
                            <Avatar 
                              name={comment.author} 
                              size="sm"
                              bg="purple.500"
                            />
                            <VStack align="start" spacing={0}>
                              <Text 
                                color="white" 
                                fontSize="sm" 
                                fontWeight="semibold"
                              >
                                {comment.author}
                              </Text>
                              <Text 
                                color="gray.400" 
                                fontSize="xs"
                              >
                                {formatCommentDate(comment.timestamp)}
                              </Text>
                            </VStack>
                          </HStack>
                        </HStack>
                        <Text 
                          color="gray.300" 
                          fontSize="sm" 
                          lineHeight="1.6"
                          pl={12}
                        >
                          {comment.content}
                        </Text>
                      </Box>
                    ))}
                    
                    {comments.length === 0 && (
                      <Box
                        textAlign="center"
                        py={8}
                        color="gray.500"
                      >
                        <Text>No comments yet. Be the first to comment!</Text>
                      </Box>
                    )}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Flex>

        {/* Edit Story Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
            <ModalHeader color="white">
              <HStack spacing={3}>
                <Icon as={FaBookOpen} color="purple.400" />
                <Text>Edit User Story</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="gray.400" />
            
            <ModalBody pb={6}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Story Title
                  </FormLabel>
                  <Textarea
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    rows={2}
                    resize="vertical"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Description
                  </FormLabel>
                  <Textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    rows={4}
                    resize="vertical"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                      Status
                    </FormLabel>
                    <Select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    >
                      <option value="To Do" style={{ backgroundColor: '#2D3748' }}>To Do</option>
                      <option value="In Progress" style={{ backgroundColor: '#2D3748' }}>In Progress</option>
                      <option value="Done" style={{ backgroundColor: '#2D3748' }}>Done</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                      Priority
                    </FormLabel>
                    <Select
                      name="priority"
                      value={editFormData.priority}
                      onChange={handleEditInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    >
                      <option value="High" style={{ backgroundColor: '#2D3748' }}>High</option>
                      <option value="Medium" style={{ backgroundColor: '#2D3748' }}>Medium</option>
                      <option value="Low" style={{ backgroundColor: '#2D3748' }}>Low</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Due Date
                  </FormLabel>
                  <Input
                    name="dueDate"
                    type="date"
                    value={editFormData.dueDate}
                    onChange={handleEditInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onEditClose}
                color="gray.400"
                _hover={{ color: "white", bg: "gray.700" }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSaveStory}
                leftIcon={<CheckIcon />}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Feature Modal */}
        <Modal isOpen={isFeatureOpen} onClose={onFeatureClose} size="xl">
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
            <ModalHeader color="white">
              <HStack spacing={3}>
                <Icon as={FaLightbulb} color="blue.400" />
                <Text>Add New Feature to Story</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="gray.400" />
            
            <ModalBody pb={6}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Feature Name
                  </FormLabel>
                  <Input
                    name="name"
                    value={featureFormData.name}
                    onChange={handleFeatureInputChange}
                    placeholder="Enter feature name"
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Description
                  </FormLabel>
                  <Textarea
                    name="description"
                    value={featureFormData.description}
                    onChange={handleFeatureInputChange}
                    placeholder="Describe the feature..."
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    rows={4}
                    resize="vertical"
                  />
                </FormControl>

                <SimpleGrid columns={3} spacing={4} w="full">
                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                      Assigned To
                    </FormLabel>
                    <Select
                      name="assignee"
                      value={featureFormData.assignee}
                      onChange={handleFeatureInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    >
                      {story.assignedTeam.map(member => (
                        <option key={member} value={member} style={{ backgroundColor: '#2D3748' }}>
                          {member}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                      Priority
                    </FormLabel>
                    <Select
                      name="priority"
                      value={featureFormData.priority}
                      onChange={handleFeatureInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    >
                      <option value="High" style={{ backgroundColor: '#2D3748' }}>High</option>
                      <option value="Medium" style={{ backgroundColor: '#2D3748' }}>Medium</option>
                      <option value="Low" style={{ backgroundColor: '#2D3748' }}>Low</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                      Estimated Hours
                    </FormLabel>
                    <Input
                      name="estimatedHours"
                      type="number"
                      value={featureFormData.estimatedHours}
                      onChange={handleFeatureInputChange}
                      placeholder="Hours"
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Due Date
                  </FormLabel>
                  <Input
                    name="dueDate"
                    type="date"
                    value={featureFormData.dueDate}
                    onChange={handleFeatureInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onFeatureClose}
                color="gray.400"
                _hover={{ color: "white", bg: "gray.700" }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleCreateFeature}
                leftIcon={<AddIcon />}
              >
                Create Feature
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default StoryDetailsPage;
