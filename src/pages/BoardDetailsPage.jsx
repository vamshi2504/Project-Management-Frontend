import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Avatar,
  AvatarGroup,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  List,
  ListItem,
  ListIcon,
  Checkbox,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaEdit,
  FaComment,
  FaHistory,
  FaUsers,
  FaClock,
  FaFlag,
  FaCalendarAlt,
  FaTasks,
  FaLink,
  FaFileAlt,
  FaCheckCircle,
  FaCircle,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
  FaEye,
  FaPaperclip,
  FaDownload,
  FaCode,
  FaBug,
  FaLightbulb,
} from 'react-icons/fa';

const BoardDetailsPage = () => {
  const { id, type } = useParams(); // id = item id, type = 'task' | 'feature' | 'story'
  const navigate = useNavigate();
  const toast = useToast();

  // Using consistent dark theme like FeatureDetails
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Mock data based on type
  const [item, setItem] = useState(() => {
    const baseItem = {
      id: parseInt(id),
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
      createdBy: 'John Doe',
      assignedTo: 'Jane Smith',
      project: 'E-commerce Platform',
      projectId: 1,
    };

    switch (type) {
      case 'task':
        return {
          ...baseItem,
          title: 'Implement User Authentication API',
          description: 'Create REST API endpoints for user registration, login, logout, and password reset functionality. Include JWT token management and email verification.',
          type: 'Task',
          status: 'In Progress',
          priority: 'High',
          estimatedHours: 16,
          loggedHours: 8,
          dueDate: '2024-02-15',
          tags: ['Backend', 'API', 'Security', 'Authentication'],
          acceptanceCriteria: [
            'User can register with email and password',
            'User can login with valid credentials',
            'JWT tokens are properly generated and validated',
            'Password reset functionality works via email',
            'Email verification is required for new accounts',
            'API endpoints are properly documented'
          ],
          subtasks: [
            { id: 1, title: 'Design API endpoints', completed: true },
            { id: 2, title: 'Implement user registration', completed: true },
            { id: 3, title: 'Implement login functionality', completed: false },
            { id: 4, title: 'Add JWT token management', completed: false },
            { id: 5, title: 'Implement password reset', completed: false },
            { id: 6, title: 'Add email verification', completed: false },
          ],
          dependencies: ['Setup database schema', 'Configure email service'],
          linkedItems: ['Feature: User Management System'],
        };
      case 'feature':
        return {
          ...baseItem,
          title: 'Shopping Cart System',
          description: 'Complete shopping cart functionality including add/remove items, quantity management, price calculations, and cart persistence across sessions.',
          type: 'Feature',
          status: 'In Progress',
          priority: 'High',
          estimatedHours: 80,
          loggedHours: 45,
          dueDate: '2024-03-30',
          tags: ['Frontend', 'Backend', 'E-commerce', 'Database'],
          acceptanceCriteria: [
            'Users can add products to cart',
            'Users can modify quantities in cart',
            'Users can remove items from cart',
            'Cart totals are calculated correctly',
            'Cart persists across browser sessions',
            'Cart is synchronized across devices when logged in',
            'Cart has maximum item limits',
            'Responsive design on all devices'
          ],
          subtasks: [
            { id: 1, title: 'Cart UI components', completed: true },
            { id: 2, title: 'Add to cart functionality', completed: true },
            { id: 3, title: 'Quantity management', completed: true },
            { id: 4, title: 'Cart calculations', completed: false },
            { id: 5, title: 'Session persistence', completed: false },
            { id: 6, title: 'User synchronization', completed: false },
          ],
          dependencies: ['Product Catalog API', 'User Authentication'],
          linkedItems: ['Story: Guest Checkout', 'Task: Cart API Integration'],
        };
      case 'story':
        return {
          ...baseItem,
          title: 'As a customer, I want to filter products so I can find what I need quickly',
          description: 'Users should be able to filter products by category, price range, brand, ratings, and availability. Filters should be combinable and results should update in real-time.',
          type: 'User Story',
          status: 'To Do',
          priority: 'Medium',
          estimatedHours: 24,
          loggedHours: 0,
          dueDate: '2024-04-15',
          tags: ['Frontend', 'UX', 'Search', 'Filtering'],
          acceptanceCriteria: [
            'Filter panel is easily accessible on product pages',
            'Users can filter by category, price, brand, rating',
            'Multiple filters can be applied simultaneously',
            'Filter results update without page reload',
            'Applied filters are clearly visible to users',
            'Users can easily clear individual or all filters',
            'Filter state persists during browsing session',
            'Mobile-friendly filter interface'
          ],
          subtasks: [
            { id: 1, title: 'Design filter UI mockups', completed: false },
            { id: 2, title: 'Implement filter panel component', completed: false },
            { id: 3, title: 'Add filter logic and API integration', completed: false },
            { id: 4, title: 'Implement real-time filtering', completed: false },
            { id: 5, title: 'Add filter state management', completed: false },
            { id: 6, title: 'Mobile responsive design', completed: false },
          ],
          dependencies: ['Product Catalog API', 'Search Infrastructure'],
          linkedItems: ['Feature: Product Catalog', 'Task: Search API Optimization'],
        };
      default:
        return baseItem;
    }
  });

  // Comments and activity data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'Started working on the API design. Should we use OAuth 2.0 or stick with JWT?',
      timestamp: '2024-01-20T09:15:00Z',
      type: 'comment'
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'JWT should be sufficient for our use case. Let\'s keep it simple.',
      timestamp: '2024-01-20T09:45:00Z',
      type: 'comment'
    },
    {
      id: 3,
      author: 'System',
      content: 'Status changed from "To Do" to "In Progress"',
      timestamp: '2024-01-20T10:00:00Z',
      type: 'activity'
    },
    {
      id: 4,
      author: 'Jane Smith',
      content: 'Database schema has been updated with the new user fields.',
      timestamp: '2024-01-20T14:30:00Z',
      type: 'comment'
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'gray';
      case 'In Progress': return 'blue';
      case 'Review': return 'yellow';
      case 'Done': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Task': return FaTasks;
      case 'Feature': return FaLightbulb;
      case 'User Story': return FaUsers;
      case 'Bug': return FaBug;
      default: return FaCircle;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Task': return 'blue';
      case 'Feature': return 'purple';
      case 'User Story': return 'green';
      case 'Bug': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    if (!item.subtasks || item.subtasks.length === 0) return 0;
    const completed = item.subtasks.filter(task => task.completed).length;
    return Math.round((completed / item.subtasks.length) * 100);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString(),
      type: 'comment'
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    
    toast({
      title: 'Comment added',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleSubtask = (subtaskId) => {
    setItem(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(task =>
        task.id === subtaskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const progress = calculateProgress();

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack align="stretch" spacing={6} maxW="1400px" mx="auto">
        {/* Header */}
        <HStack spacing={4}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate('/board')}
            color="gray.400"
            _hover={{ color: "white", bg: "gray.700" }}
          >
            Back to Board
          </Button>
          <Divider orientation="vertical" h={6} borderColor="gray.600" />
          <HStack>
            <Icon as={getTypeIcon(item.type)} color={`${getTypeColor(item.type)}.400`} boxSize={6} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="gray.400">
                {item.project} • {item.type} #{item.id}
              </Text>
              <Heading size="lg" noOfLines={1} color="white">{item.title}</Heading>
            </VStack>
          </HStack>
        </HStack>

        <Flex gap={6} align="start">
          {/* Main Content */}
          <VStack flex={2} align="stretch" spacing={6}>
            {/* Item Details Card */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  {/* Header with actions */}
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={3} flex={1}>
                      <HStack spacing={3}>
                        <Badge colorScheme={getStatusColor(item.status)} px={3} py={1} borderRadius="full">
                          {item.status}
                        </Badge>
                        <Badge colorScheme={getPriorityColor(item.priority)} px={3} py={1} borderRadius="full">
                          {item.priority} Priority
                        </Badge>
                        <Badge colorScheme={getTypeColor(item.type)} px={3} py={1} borderRadius="full">
                          {item.type}
                        </Badge>
                      </HStack>
                      
                      <Text color="gray.300">{item.description}</Text>
                      
                      <HStack spacing={6} fontSize="sm" color="gray.400">
                        <HStack>
                          <Icon as={FaCalendarAlt} />
                          <Text>Due: {formatDate(item.dueDate)}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaClock} />
                          <Text>{item.loggedHours}h / {item.estimatedHours}h logged</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaUsers} />
                          <Text>Assigned to: {item.assignedTo}</Text>
                        </HStack>
                      </HStack>
                    </VStack>

                    <VStack spacing={2}>
                      <Button 
                        size="sm" 
                        leftIcon={<FaEdit />} 
                        onClick={onEditOpen}
                        variant="outline"
                        colorScheme="blue"
                        color="gray.300"
                        borderColor="gray.600"
                        _hover={{ bg: "blue.600", borderColor: "blue.600", color: "white" }}
                      >
                        Edit
                      </Button>
                      <Avatar size="md" name={item.assignedTo} />
                    </VStack>
                  </Flex>

                  {/* Progress */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold" color="gray.300">Progress</Text>
                      <Text fontSize="lg" fontWeight="bold" color="white">
                        {progress}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={progress} 
                      colorScheme={getStatusColor(item.status)} 
                      size="lg" 
                      borderRadius="full"
                      bg="gray.700"
                    />
                  </Box>

                  {/* Tags */}
                  <Box>
                    <Text fontWeight="semibold" mb={2} color="gray.300">Tags</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {item.tags.map(tag => (
                        <Tag key={tag} size="md" colorScheme="blue" variant="subtle" borderRadius="full">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Tabs for detailed content */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
              <CardBody p={0}>
                <Tabs colorScheme="blue">
                  <TabList borderColor="gray.600">
                    <Tab color="gray.400" _selected={{ color: "blue.400", borderColor: "blue.400" }}>Acceptance Criteria</Tab>
                    <Tab color="gray.400" _selected={{ color: "blue.400", borderColor: "blue.400" }}>Subtasks ({item.subtasks?.length || 0})</Tab>
                    <Tab color="gray.400" _selected={{ color: "blue.400", borderColor: "blue.400" }}>Dependencies</Tab>
                    <Tab color="gray.400" _selected={{ color: "blue.400", borderColor: "blue.400" }}>Linked Items</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <VStack align="stretch" spacing={3}>
                        <Heading size="sm" color="gray.300">Acceptance Criteria</Heading>
                        <List spacing={2}>
                          {item.acceptanceCriteria?.map((criteria, index) => (
                            <ListItem key={index} color="gray.400">
                              <ListIcon as={FaCheckCircle} color="green.400" />
                              {criteria}
                            </ListItem>
                          ))}
                        </List>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <Heading size="sm" color="gray.300">Subtasks</Heading>
                          <Button 
                            size="sm" 
                            leftIcon={<FaPlus />} 
                            colorScheme="blue" 
                            variant="outline"
                            color="gray.300"
                            borderColor="gray.600"
                            _hover={{ bg: "blue.600", borderColor: "blue.600", color: "white" }}
                          >
                            Add Subtask
                          </Button>
                        </HStack>
                        
                        <VStack align="stretch" spacing={2}>
                          {item.subtasks?.map((subtask) => (
                            <HStack key={subtask.id} p={3} borderRadius="md" bg="gray.700">
                              <Checkbox
                                isChecked={subtask.completed}
                                onChange={() => toggleSubtask(subtask.id)}
                                colorScheme="green"
                              />
                              <Text 
                                flex={1} 
                                textDecoration={subtask.completed ? 'line-through' : 'none'}
                                color={subtask.completed ? 'gray.500' : 'gray.300'}
                              >
                                {subtask.title}
                              </Text>
                              <Button size="xs" variant="ghost" color="gray.400" _hover={{ color: "red.400" }}>
                                <FaTrash />
                              </Button>
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="stretch" spacing={3}>
                        <Heading size="sm" color="gray.300">Dependencies</Heading>
                        {item.dependencies?.length > 0 ? (
                          <VStack align="stretch" spacing={2}>
                            {item.dependencies.map((dep, index) => (
                              <HStack key={index} p={3} borderRadius="md" bg="yellow.900" border="1px" borderColor="yellow.700">
                                <Icon as={FaExclamationTriangle} color="yellow.400" />
                                <Text flex={1} color="gray.300">{dep}</Text>
                                <Badge colorScheme="yellow">Blocked</Badge>
                              </HStack>
                            ))}
                          </VStack>
                        ) : (
                          <Text color="gray.500">No dependencies</Text>
                        )}
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack align="stretch" spacing={3}>
                        <Heading size="sm" color="gray.300">Linked Items</Heading>
                        {item.linkedItems?.length > 0 ? (
                          <VStack align="stretch" spacing={2}>
                            {item.linkedItems.map((link, index) => (
                              <HStack key={index} p={3} borderRadius="md" bg="blue.900" border="1px" borderColor="blue.700">
                                <Icon as={FaLink} color="blue.400" />
                                <Text flex={1} color="gray.300">{link}</Text>
                                <Button size="xs" variant="ghost" color="gray.400" _hover={{ color: "blue.400" }}>
                                  <FaEye />
                                </Button>
                              </HStack>
                            ))}
                          </VStack>
                        ) : (
                          <Text color="gray.500">No linked items</Text>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </VStack>

          {/* Sidebar */}
          <VStack flex={1} align="stretch" spacing={6}>
            {/* Quick Stats */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="sm" color="gray.300">Quick Stats</Heading>
                  
                  <SimpleGrid columns={1} spacing={3} w="full">
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">Time Spent</StatLabel>
                      <StatNumber fontSize="md" color="blue.400">
                        {item.loggedHours}h / {item.estimatedHours}h
                      </StatNumber>
                    </Stat>
                    
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">Completion</StatLabel>
                      <StatNumber fontSize="md" color="green.400">
                        {progress}%
                      </StatNumber>
                    </Stat>
                    
                    <Stat textAlign="center" bg="gray.700" p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color="gray.400">Subtasks Done</StatLabel>
                      <StatNumber fontSize="md" color="purple.400">
                        {item.subtasks?.filter(t => t.completed).length || 0} / {item.subtasks?.length || 0}
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Comments & Activity */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
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
                        size="sm" 
                        colorScheme="purple" 
                        onClick={handleAddComment}
                        isDisabled={!newComment.trim()}
                        leftIcon={<FaComment />}
                      >
                        Add Comment
                      </Button>
                    </Flex>
                  </VStack>

                  <Divider borderColor="gray.600" />

                  {/* Comments List */}
                  <VStack spacing={3} w="full" maxH="400px" overflowY="auto">
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
                              size="sm" 
                              name={comment.author}
                              bg="purple.500"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="semibold" color="white">
                                {comment.author}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                {formatDate(comment.timestamp)}
                              </Text>
                            </VStack>
                          </HStack>
                          {comment.type === 'activity' && (
                            <Badge size="sm" colorScheme="blue">Activity</Badge>
                          )}
                        </HStack>
                        <Text 
                          fontSize="sm" 
                          color="gray.300" 
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

            {/* Item Information */}
            <Card bg={cardBg} borderColor={borderColor} border="1px">
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Heading size="sm" color="gray.300">Item Information</Heading>
                  
                  <VStack spacing={2} align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <Text color="gray.400">Created:</Text>
                      <Text color="gray.300">{formatDate(item.createdAt)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.400">Updated:</Text>
                      <Text color="gray.300">{formatDate(item.updatedAt)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.400">Created by:</Text>
                      <Text color="gray.300">{item.createdBy}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.400">Project:</Text>
                      <Link 
                        color="blue.400" 
                        onClick={() => navigate(`/projects/${item.projectId}`)}
                        _hover={{ color: "blue.300" }}
                      >
                        {item.project}
                      </Link>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Flex>
      
      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color="white">Edit {item.type}</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Title</FormLabel>
                <Input 
                  defaultValue={item.title} 
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Description</FormLabel>
                <Textarea 
                  defaultValue={item.description} 
                  rows={4} 
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  resize="vertical"
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300">Status</FormLabel>
                  <Select 
                    defaultValue={item.status}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  >
                    <option value="To Do" style={{ backgroundColor: '#2D3748' }}>To Do</option>
                    <option value="In Progress" style={{ backgroundColor: '#2D3748' }}>In Progress</option>
                    <option value="Review" style={{ backgroundColor: '#2D3748' }}>Review</option>
                    <option value="Done" style={{ backgroundColor: '#2D3748' }}>Done</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300">Priority</FormLabel>
                  <Select 
                    defaultValue={item.priority}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  >
                    <option value="Low" style={{ backgroundColor: '#2D3748' }}>Low</option>
                    <option value="Medium" style={{ backgroundColor: '#2D3748' }}>Medium</option>
                    <option value="High" style={{ backgroundColor: '#2D3748' }}>High</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300">Assigned To</FormLabel>
                  <Select 
                    defaultValue={item.assignedTo}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  >
                    <option value="Jane Smith" style={{ backgroundColor: '#2D3748' }}>Jane Smith</option>
                    <option value="John Doe" style={{ backgroundColor: '#2D3748' }}>John Doe</option>
                    <option value="Mike Johnson" style={{ backgroundColor: '#2D3748' }}>Mike Johnson</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300">Due Date</FormLabel>
                  <Input 
                    type="date" 
                    defaultValue={item.dueDate} 
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300">Estimated Hours</FormLabel>
                  <Input 
                    type="number" 
                    defaultValue={item.estimatedHours} 
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300">Logged Hours</FormLabel>
                  <Input 
                    type="number" 
                    defaultValue={item.loggedHours} 
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  />
                </FormControl>
              </HStack>
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
            <Button colorScheme="blue" onClick={onEditClose}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </VStack>
    </Box>
  );
};

export default BoardDetailsPage;
