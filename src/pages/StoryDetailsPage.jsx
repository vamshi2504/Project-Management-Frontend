import React, { useState, useMemo, useEffect } from 'react';
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


import { fetchStoryById } from '../api/stories';

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
  // Board type filter state
  const [boardType, setBoardType] = useState('features');
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isFeatureOpen, onOpen: onFeatureOpen, onClose: onFeatureClose } = useDisclosure();

  const [story, setStory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
  });
  // Normalize backend status/priority to frontend expected values
  const normalizeStatus = (status) => {
    if (!status) return '';
    switch (status.toUpperCase()) {
      case 'TODO':
        return 'To Do';
      case 'INPROGRESS':
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'DONE':
        return 'Done';
      case 'SATISFIED':
        return 'Satisfied';
      default:
        // Try to prettify any other status
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  const normalizePriority = (priority) => {
    if (!priority) return '';
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStoryById(id);
        // Normalize status and priority
        const normalizedData = {
          ...data,
          status: normalizeStatus(data.status),
          priority: normalizePriority(data.priority),
        };
        setStory(normalizedData);
        setEditFormData({
          title: normalizedData.title || '',
          description: normalizedData.description || '',
          status: normalizedData.status || '',
          priority: normalizedData.priority || '',
          dueDate: normalizedData.dueDate || '',
        });
      } catch (err) {
        setStory(null);
      }
    };
    fetchData();
  }, [id]);
  console.log('Story Details:', story);
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

  // Fetch features and tasks under this story
  const [features, setFeatures] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!story?._id) return;
      // Fetch all features and filter by storyId/featureId
      try {
        const allFeatures = await import('../api/features').then(m => m.fetchAllFeatures());
        setFeatures(allFeatures.filter(f => f.storyId === story._id || f.story === story._id));
      } catch (e) {
        setFeatures([]);
      }
      try {
        const allTasks = await import('../api/tasks').then(m => m.fetchAllTasks());
        setTasks(allTasks.filter(t => t.storyId === story._id || t.story === story._id));
      } catch (e) {
        setTasks([]);
      }
    };
    fetchData();
  }, [story?._id]);

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
        {/* Modern Gradient Banner Heading */}
        <Box
          w="100%"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          mb={2}
          bgGradient="linear(to-r, purple.500, blue.400, teal.400, green.400, orange.300)"
          boxShadow="lg"
          display="flex"
          alignItems="center"
        >
          <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="extrabold" color="white" mr={4}>
            🚀
          </Text>
          <Box>
            <Text fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="extrabold" color="white" lineHeight="1.1">
              {story ? story.title : 'Story Details'}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.800" fontWeight="medium">
              Feature Details & Task Management
            </Text>
          </Box>
        </Box>

        {/* Header Actions */}
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
                  {story ? `${story.project || ''} • User Story #${story.id || ''}` : ''}
                </Text>
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
                  colorScheme={getStatusColor(story?.status)}
                  variant="subtle"
                  borderRadius="full"
                  fontSize="sm"
                  px={4}
                  py={2}
                >
                  {story?.status || ''}
                </Badge>
                <Badge 
                  colorScheme={getPriorityColor(story?.priority)}
                  variant="subtle"
                  borderRadius="full"
                  fontSize="sm"
                  px={4}
                  py={2}
                >
                  {story?.priority ? `${story.priority} Priority` : ''}
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
                  {story?.description || ''}
                </Text>
              </Box>

              {/* Progress */}
              <Box>
                <Flex justify="space-between" align="center" mb={3}>
                  <Text color="gray.300" fontSize="md" fontWeight="medium">
                    Progress
                  </Text>
                  <Text color="white" fontSize="lg" fontWeight="bold">
                    {story?.progress != null ? `${story.progress}%` : ''}
                  </Text>
                </Flex>
                <Progress 
                  colorScheme={getStatusColor(story?.status)} 
                  value={story?.progress || 0} 
                  borderRadius="full"
                  size="lg"
                  bg="gray.700"
                />
                <Flex justify="space-between" mt={2}>
                  <Text color="gray.500" fontSize="sm">
                    {/* removed stats.completedFeatures of stats.totalFeatures features completed */}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {story?.loggedHours != null && story?.estimatedHours != null ? `${story.loggedHours}h / ${story.estimatedHours}h logged` : ''}
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
                        Started: {story?.startDate ? formatDate(story.startDate) : 'N/A'}
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FaCalendarAlt} color="orange.400" boxSize={4} />
                      <Text color="gray.400" fontSize="sm">
                        Due: {story?.dueDate ? formatDate(story.dueDate) : 'N/A'}
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FaProjectDiagram} color="purple.400" boxSize={4} />
                      <Text color="gray.400" fontSize="sm">
                        Epic: {story?.epic || 'N/A'}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                    Team Members
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {Array.isArray(story?.assignedTeam) && story.assignedTeam.length > 0 ? (
                      story.assignedTeam.map((member, index) => (
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
                      ))
                    ) : (
                      <Text color="gray.500" fontSize="sm">No team members assigned</Text>
                    )}
                  </Flex>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>






        {/* Board Layout for Features or Tasks - Filtered */}
        <Box w="100%" mb={8}>
          <Flex mb={4} align="center" gap={4}>
            <Text fontWeight="bold" color="white" fontSize="xl">Board Type:</Text>
            <Select
              value={boardType}
              onChange={e => setBoardType(e.target.value)}
              maxW="200px"
              bg="gray.800"
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.400' }}
            >
              <option value="features" style={{ backgroundColor: '#2D3748' }}>Features</option>
              <option value="tasks" style={{ backgroundColor: '#2D3748' }}>Tasks</option>
            </Select>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {['To Do', 'In Progress', 'Done'].map((status, idx) => {
              const statusColors = [
                { dot: 'gray.400', label: 'To Do', countBg: 'gray.700', countColor: 'gray.200' },
                { dot: 'blue.400', label: 'In Progress', countBg: 'gray.700', countColor: 'blue.200' },
                { dot: 'green.400', label: 'Done', countBg: 'gray.700', countColor: 'green.200' }
              ];
              return (
                <Box key={status} bg={cardBg} borderRadius="2xl" border="1px" borderColor={borderColor} p={6} minH="320px">
                  <HStack mb={2} spacing={3} align="center">
                    <Box boxSize={4} borderRadius="full" bg={statusColors[idx].dot} />
                    <Text fontWeight="extrabold" color="white" fontSize="2xl">{status}</Text>
                    <Box ml="auto" px={3} py={1} borderRadius="full" bg={statusColors[idx].countBg} color={statusColors[idx].countColor} fontWeight="bold" fontSize="md">
                      {boardType === 'features'
                        ? features.filter(f => f.status === status).length
                        : tasks.filter(t => t.status === status).length}
                    </Box>
                  </HStack>
                  <Flex direction="column" gap={6} mt={4}>
                    {boardType === 'features' ? (
                      <Box border="2px dashed" borderColor={statusColors[idx].dot} borderRadius="xl" p={4} minH="100px">
                        {features.filter(f => f.status === status).length === 0 ? (
                          <Text color={statusColors[idx].dot} fontWeight="medium" textAlign="center">
                            No {status.toLowerCase()} features
                          </Text>
                        ) : (
                          features.filter(f => f.status === status).map((feature) => (
                            <FeatureCard key={feature._id || feature.id} feature={feature} />
                          ))
                        )}
                      </Box>
                    ) : (
                      <Box border="2px dashed" borderColor={statusColors[idx].dot} borderRadius="xl" p={4} minH="100px">
                        {tasks.filter(t => t.status === status).length === 0 ? (
                          <Text color={statusColors[idx].dot} fontWeight="medium" textAlign="center">
                            No {status.toLowerCase()} tasks
                          </Text>
                        ) : (
                          tasks.filter(t => t.status === status).map((task) => (
                            <Box key={task._id || task.id} bg="gray.700" p={4} borderRadius="xl" border="1px" borderColor="gray.600" mb={2}>
                              <VStack align="stretch" spacing={2}>
                                <Flex justify="space-between" align="center">
                                  <HStack spacing={3}>
                                    <Badge colorScheme={getPriorityColor(task.priority)} variant="subtle" borderRadius="full" fontSize="xs" px={2}>
                                      {task.priority}
                                    </Badge>
                                    <Badge colorScheme={getStatusColor(task.status)} variant="subtle" borderRadius="full" fontSize="xs" px={2}>
                                      {task.status}
                                    </Badge>
                                  </HStack>
                                  <Text color="gray.400" fontSize="xs">Due: {task.dueDate ? formatDate(task.dueDate) : 'N/A'}</Text>
                                </Flex>
                                <Heading size="sm" color="white">{task.title}</Heading>
                                <Text color="gray.400" fontSize="sm">{task.description}</Text>
                              </VStack>
                            </Box>
                          ))
                        )}
                      </Box>
                    )}
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
  // Board type filter state
  const [boardType, setBoardType] = useState('features');

        {/* Comments Section - Full Width Under Board */}
        <Box w="100%">
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={3} mb={2}>
                  <Icon as={FaComment} color="purple.400" boxSize={5} />
                  <Heading size="sm" color="white">
                    Comments ({comments.length})
                  </Heading>
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
        </Box>

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
                      {(story?.assignedTeam ?? []).map(member => (
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
