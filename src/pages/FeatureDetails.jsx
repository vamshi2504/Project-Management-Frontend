import React, { useState, useEffect } from 'react';
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
  Spinner,
  Alert,
  AlertIcon,
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
} from 'react-icons/fa';

import { fetchAllFeatures } from '../api/features';
import { fetchTasksByFeature } from '../api/fetchTasksByFeature';

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return 'gray';
    case 'In Progress':
      return 'blue';
    case 'Done':
      return 'green';
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'yellow';
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

const getTagColor = (tag) => {
  const colors = {
    'Frontend': 'blue',
    'Backend': 'purple',
    'UI/UX': 'pink',
    'API': 'orange',
    'Bug Fix': 'red',
    'Database': 'green',
    'Analytics': 'teal',
    'Security': 'yellow',
    'Real-time': 'cyan',
    'Search': 'gray',
    'Payment': 'red',
    'Testing': 'orange',
    'Export': 'green',
  };
  return colors[tag] || 'gray';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const FeatureDetailsPage = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure();
  
  // Comments state and management
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'This feature is progressing well. The authentication system looks solid.',
      timestamp: '2025-07-12T10:30:00Z',
      avatar: 'John Doe'
    },
    {
      id: 2,
      author: 'Sarah Wilson',
      content: 'I suggest we add two-factor authentication to enhance security further.',
      timestamp: '2025-07-12T14:15:00Z',
      avatar: 'Sarah Wilson'
    },
    {
      id: 3,
      author: 'Mike Johnson',
      content: 'The login page design looks great! Should we also consider social login options?',
      timestamp: '2025-07-13T09:45:00Z',
      avatar: 'Mike Johnson'
    }
  ]);
  const [newComment, setNewComment] = useState('');


  // State for feature, tasks, loading, error
  const [feature, setFeature] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all features and find the one with this ID
        const allFeatures = await fetchAllFeatures();
        const feat = allFeatures.find(f => f._id?.toString() === featureId?.toString() || f.id?.toString() === featureId?.toString());
        setFeature(feat);
        if (feat) {
          // Fetch tasks for this feature
          const featureTasks = await fetchTasksByFeature(feat._id || feat.id);
          setTasks(featureTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError('Failed to load feature details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [featureId]);

  const [editFormData, setEditFormData] = useState({
    name: feature?.name || '',
    description: feature?.description || '',
    status: feature?.status || '',
    priority: feature?.priority || '',
    dueDate: feature?.dueDate || '',
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'You',
    dueDate: '',
    status: 'To Do',
    priority: 'Medium',
    tags: [],
  });


  // Group tasks by status (from fetched tasks)
  const tasksByStatus = React.useMemo(() => {
    return {
      'To Do': tasks.filter(task => (task.status || '').toLowerCase() === 'to do' || (task.status || '').toLowerCase() === 'todo'),
      'In Progress': tasks.filter(task => (task.status || '').toLowerCase() === 'in progress' || (task.status || '').toLowerCase() === 'in_progress'),
      'Done': tasks.filter(task => (task.status || '').toLowerCase() === 'done' || (task.status || '').toLowerCase() === 'completed'),
    };
  }, [tasks]);

  // Calculate feature statistics
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => (task.status || '').toLowerCase() === 'done' || (task.status || '').toLowerCase() === 'completed').length;
    const inProgress = tasks.filter(task => (task.status || '').toLowerCase() === 'in progress' || (task.status || '').toLowerCase() === 'in_progress').length;
    const todo = tasks.filter(task => (task.status || '').toLowerCase() === 'to do' || (task.status || '').toLowerCase() === 'todo').length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveFeature = () => {
    // In a real app, this would update the feature in the backend
    toast({
      title: "Feature Updated",
      description: "Feature details have been updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onEditClose();
  };

  const handleCreateTask = () => {
    if (!taskFormData.title.trim() || !taskFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real app, this would create the task in the backend
    toast({
      title: "Task Created",
      description: `"${taskFormData.title}" has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setTaskFormData({
      title: '',
      description: '',
      assignedTo: 'You',
      dueDate: '',
      status: 'To Do',
      priority: 'Medium',
      tags: [],
    });
    onTaskClose();
  };

  // Comment functions
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      author: 'You', // In a real app, this would come from authentication
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

  const handleTaskClick = (taskId) => {
    // Tasks no longer have individual detail pages, stay on current page
  };

  const TaskCard = ({ task }) => (
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
      onClick={() => handleTaskClick(task.id)}
      mb={4}
    >
      <CardBody p={5}>
        {/* Priority and assignee */}
        <Flex align="center" justify="space-between" mb={3}>
          <Badge 
            colorScheme={getPriorityColor(task.priority)}
            variant="subtle"
            borderRadius="full"
            fontSize="xs"
            px={2}
          >
            {task.priority} Priority
          </Badge>
          <HStack spacing={2}>
            <Avatar name={task.assignedTo} size="xs" />
            <Text color="gray.400" fontSize="xs">
              {task.assignedTo}
            </Text>
          </HStack>
        </Flex>

        {/* Tags */}
        <Flex wrap="wrap" gap={2} mb={3}>
          {task.tags.map((tag, index) => (
            <Badge
              key={index}
              colorScheme={getTagColor(tag)}
              variant="subtle"
              borderRadius="full"
              fontSize="xs"
              px={2}
            >
              {tag}
            </Badge>
          ))}
        </Flex>

        {/* Title */}
        <Heading size="sm" color="white" mb={2} noOfLines={2}>
          {task.title}
        </Heading>

        {/* Description */}
        <Text color="gray.400" fontSize="sm" mb={4} noOfLines={3}>
          {task.description}
        </Text>

        <Divider borderColor="gray.700" mb={3} />

        {/* Footer */}
        <Flex justify="space-between" align="center">
          <HStack spacing={1}>
            <Icon as={FaClock} color="gray.500" boxSize={3} />
            <Text color="gray.400" fontSize="xs">
              Due: {formatDate(task.dueDate)}
            </Text>
          </HStack>
          <Badge 
            colorScheme={getStatusColor(task.status)}
            variant="subtle"
            borderRadius="full"
            fontSize="xs"
            px={2}
          >
            {task.status}
          </Badge>
        </Flex>
      </CardBody>
    </Card>
  );

  const StatusColumn = ({ status, tasks, count }) => (
    <Box
      bg="gray.900"
      borderRadius="2xl"
      p={6}
      border="1px"
      borderColor="gray.700"
      flex="1"
      minH="500px"
    >
      {/* Column Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <Box
            w={3}
            h={3}
            borderRadius="full"
            bg={`${getStatusColor(status)}.500`}
          />
          <Heading size="md" color="white">
            {status}
          </Heading>
        </HStack>
        <Badge
          colorScheme={getStatusColor(status)}
          variant="subtle"
          borderRadius="full"
          px={3}
        >
          {count}
        </Badge>
      </Flex>

      {/* Tasks */}
      <VStack spacing={0} align="stretch">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <Box
            border="2px dashed"
            borderColor="gray.700"
            borderRadius="xl"
            p={8}
            textAlign="center"
          >
            <Text color="gray.500" fontSize="sm">
              No {status.toLowerCase()} tasks
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );


  if (loading) {
    return (
      <Box px={8} py={6} bg="gray.900" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.400" />
        <Text color="white" fontSize="xl" ml={4}>Loading feature details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box px={8} py={6} bg="gray.900" minH="100vh">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text color="white">{error}</Text>
        </Alert>
      </Box>
    );
  }

  if (!feature) {
    return (
      <Box px={8} py={6} bg="gray.900" minH="100vh">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text color="white">Feature not found</Text>
        </Alert>
      </Box>
    );
  }


  return (
    <Box bg="gray.900" minH="100vh" p={{ base: 4, md: 8 }}>
      {/* Gradient Banner Heading */}
      <Box
        w="100%"
        borderRadius="2xl"
        p={{ base: 6, md: 10 }}
        mb={6}
        bgGradient="linear(to-r, purple.500, blue.400, teal.400, green.400, orange.300)"
        boxShadow="lg"
        display="flex"
        alignItems="center"
      >
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/board')}
          variant="ghost"
          color="whiteAlpha.800"
          _hover={{ color: "white", bg: "gray.700" }}
          size="lg"
          flexShrink={0}
          mr={4}
        />
        <Box>
          <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="extrabold" color="white" lineHeight="1.1">
            {feature.name || feature.title}
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.800" fontWeight="medium">
            Feature Details & Task Management
          </Text>
        </Box>
        <HStack ml="auto" spacing={3}>
          <Button
            leftIcon={<EditIcon />}
            onClick={onEditOpen}
            variant="outline"
            colorScheme="blue"
            borderRadius="xl"
            px={6}
            size="lg"
            _hover={{ bg: "blue.600", borderColor: "blue.600" }}
          >
            Edit Feature
          </Button>
          <Button 
            colorScheme="blue" 
            leftIcon={<AddIcon />}
            onClick={onTaskOpen}
            size="lg"
            borderRadius="xl"
            px={6}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s"
          >
            Add Task
          </Button>
        </HStack>
      </Box>

      {/* Feature Information Card */}
      <Card
        bg="gray.800"
        border="1px"
        borderColor="gray.700"
        mb={8}
      >
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="white">
              Feature Overview
            </Heading>
            <HStack spacing={3}>
              <Badge 
                colorScheme={getStatusColor(feature.status)}
                variant="subtle"
                borderRadius="full"
                fontSize="sm"
                px={4}
                py={2}
              >
                {feature.status}
              </Badge>
              <Badge 
                colorScheme={getPriorityColor(feature.priority)}
                variant="subtle"
                borderRadius="full"
                fontSize="sm"
                px={4}
                py={2}
              >
                {feature.priority} Priority
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
                {feature.description}
              </Text>
            </Box>

            {/* Progress */}
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text color="gray.300" fontSize="md" fontWeight="medium">
                  Progress
                </Text>
                <Text color="white" fontSize="lg" fontWeight="bold">
                  {feature.progress}%
                </Text>
              </Flex>
              <Progress 
                colorScheme={getStatusColor(feature.status)} 
                value={feature.progress} 
                borderRadius="full"
                size="lg"
                bg="gray.700"
              />
              <Flex justify="space-between" mt={2}>
                <Text color="gray.500" fontSize="sm">
                  {feature.tasksCompleted} of {feature.totalTasks} tasks completed
                </Text>
                <Text color="gray.500" fontSize="sm">
                  {feature.totalTasks - feature.tasksCompleted} remaining
                </Text>
              </Flex>
            </Box>

            {/* Timeline and Team */}
            <SimpleGrid columns={[1, 2]} spacing={6}>
              <Box>
                <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                  Timeline
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={CalendarIcon} color="green.400" boxSize={4} />
                    <Text color="gray.400" fontSize="sm">
                      Started: {formatDate(feature.startDate)}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FaCalendarAlt} color="orange.400" boxSize={4} />
                    <Text color="gray.400" fontSize="sm">
                      Due: {formatDate(feature.dueDate)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                  Team Members
                </Text>
                <Flex wrap="wrap" gap={2}>
                  {(feature.assignedTeam || []).map((member, index) => (
                    <HStack key={index} spacing={2} bg="gray.700" px={3} py={1} borderRadius="full">
                      <Avatar name={member} size="xs" />
                      <Text color="white" fontSize="sm">
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
      <SimpleGrid columns={4} spacing={6} mb={8}>
        <Stat
          bg="gray.800"
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">Total Tasks</StatLabel>
          <StatNumber color="white">{stats.total}</StatNumber>
        </Stat>
        <Stat
          bg="gray.800"
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">Completed</StatLabel>
          <StatNumber color="green.400">{stats.completed}</StatNumber>
        </Stat>
        <Stat
          bg="gray.800"
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">In Progress</StatLabel>
          <StatNumber color="blue.400">{stats.inProgress}</StatNumber>
        </Stat>
        <Stat
          bg="gray.800"
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">To Do</StatLabel>
          <StatNumber color="gray.400">{stats.todo}</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Tasks Board */}
      <Box>
        <Heading size="lg" color="white" mb={6}>
          Feature Tasks
        </Heading>
        <Flex gap={6} align="start" direction={{ base: "column", lg: "row" }}>
          <StatusColumn 
            status="To Do" 
            tasks={tasksByStatus['To Do']} 
            count={tasksByStatus['To Do'].length}
          />
          <StatusColumn 
            status="In Progress" 
            tasks={tasksByStatus['In Progress']} 
            count={tasksByStatus['In Progress'].length}
          />
          <StatusColumn 
            status="Done" 
            tasks={tasksByStatus['Done']} 
            count={tasksByStatus['Done'].length}
          />
        </Flex>
      </Box>

      {/* Comments Section */}
      <Card bg="gray.800" border="1px" borderColor="gray.700" mt={8}>
        <CardHeader>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FaCode} color="purple.400" boxSize={5} />
              <Heading size="md" color="white">
                Comments ({comments.length})
              </Heading>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Add Comment */}
            <Box>
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
              <Flex justify="flex-end" mt={3}>
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
            </Box>

            {/* Comments List */}
            <VStack spacing={4} align="stretch">
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  bg="gray.700"
                  p={4}
                  borderRadius="xl"
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
                  border="2px dashed"
                  borderColor="gray.600"
                  borderRadius="xl"
                >
                  <Icon as={FaCode} color="gray.500" boxSize={8} mb={3} />
                  <Text color="gray.500" fontSize="sm">
                    No comments yet. Be the first to comment!
                  </Text>
                </Box>
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Edit Feature Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={EditIcon} color="blue.400" />
              <Text>Edit Feature</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Feature Name */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Feature Name
                </FormLabel>
                <Input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </FormControl>

              {/* Description */}
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

              {/* Status and Priority */}
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
                    <option value="Completed" style={{ backgroundColor: '#2D3748' }}>Completed</option>
                    <option value="Pending" style={{ backgroundColor: '#2D3748' }}>Pending</option>
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

              {/* Due Date */}
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
              onClick={handleSaveFeature}
              leftIcon={<CheckIcon />}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskOpen} onClose={onTaskClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaTasks} color="blue.400" />
              <Text>Add New Task to {feature.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Task Title */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Task Title
                </FormLabel>
                <Input
                  name="title"
                  value={taskFormData.title}
                  onChange={handleTaskInputChange}
                  placeholder="Enter task title"
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                />
              </FormControl>

              {/* Description */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={taskFormData.description}
                  onChange={handleTaskInputChange}
                  placeholder="Describe the task..."
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

              {/* Assignee, Status, and Priority */}
              <SimpleGrid columns={3} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Assigned To
                  </FormLabel>
                  <Select
                    name="assignedTo"
                    value={taskFormData.assignedTo}
                    onChange={handleTaskInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                  >
                    {(feature?.assignedTeam || []).map(member => (
                      <option key={member} value={member} style={{ backgroundColor: '#2D3748' }}>
                        {member}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Status
                  </FormLabel>
                  <Select
                    name="status"
                    value={taskFormData.status}
                    onChange={handleTaskInputChange}
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
                    value={taskFormData.priority}
                    onChange={handleTaskInputChange}
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

              {/* Due Date */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Due Date
                </FormLabel>
                <Input
                  name="dueDate"
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={handleTaskInputChange}
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
              onClick={onTaskClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateTask}
              leftIcon={<AddIcon />}
            >
              Create Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FeatureDetailsPage;
