import { useUser } from '../hooks/useUser';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  AvatarGroup,
  Avatar,
  Badge,
  Progress,
  Button,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlus, FaTasks, FaCog, FaUsers, FaFlag } from 'react-icons/fa';
import { fetchProjectById, fetchProjectMembers } from '../api/projects';
import { inviteProjectMember } from '../api/projectMembers';
import { fetchUsersByIds } from '../api/users';
import { fetchTasksByProject, createTask } from '../api/tasks';
import { fetchFeaturesByProject, createFeature } from '../api/features';
import { fetchStoriesByProject, createStory } from '../api/stories';




  
  const ProjectDetailsPage = () => {
    const { user } = useUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const {
      isOpen: isAddMemberOpen,
    onOpen: onAddMemberOpen,
    onClose: onAddMemberClose
  } = useDisclosure();
  const {
    isOpen: isAddTaskOpen,
    onOpen: onAddTaskOpen,
    onClose: onAddTaskClose
  } = useDisclosure();
  const {
    isOpen: isAddFeatureOpen,
    onOpen: onAddFeatureOpen,
    onClose: onAddFeatureClose
  } = useDisclosure();
  const {
    isOpen: isAddStoryOpen,
    onOpen: onAddStoryOpen,
    onClose: onAddStoryClose
  } = useDisclosure();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberUsers, setMemberUsers] = useState([]); // [{userId, role, name, email, avatar}]
  const [tasks, setTasks] = useState([]);
  const [features, setFeatures] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({ email: '', role: 'Developer' });
  const [isInviting, setIsInviting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'TODO', dueDate: '', featureId: '', storyId: '', assignedTo: '' });
  const [newFeature, setNewFeature] = useState({ title: '', description: '', priority: 'Medium', status: 'PLANNING', storyId: '', dueDate: '' });
  const [newStory, setNewStory] = useState({ title: '', description: '', acceptanceCriteria: [''], storyPoints: 5, priority: 'Medium', status: 'TODO', featureId: '', dueDate: '' });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  
  const handleAddStory = async () => {
    if (!newStory.title.trim() || !newStory.description.trim() || !newStory.priority || !newStory.status) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      // Convert dueDate to ISO string if present and not already ISO
      let dueDateISO = newStory.dueDate;
      if (dueDateISO && !dueDateISO.includes('T')) {
        dueDateISO = new Date(dueDateISO + 'T00:00:00Z').toISOString();
      }
      await createStory({
        ...newStory,
        dueDate: dueDateISO,
        projectId: id,
        createdBy: user?.uid || user?.id || user?.email,
        createdAt: new Date().toISOString(),
      });
      toast({
        title: 'Success',
        description: 'Story created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewStory({ title: '', description: '', acceptanceCriteria: [''], storyPoints: 5, priority: 'Medium', status: 'TODO', featureId: '', dueDate: '' });
      onAddStoryClose();
      // Reload stories
      const storiesData = await fetchStoriesByProject(id);
      setStories(storiesData);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create story',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  // Fetch project details, members, tasks, features, and stories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch project details
        const projectData = await fetchProjectById(id);
        setProject(projectData);

        // Fetch project members
        const membersData = await fetchProjectMembers(id);
        setMembers(membersData);

        // Fetch user info for members
        if (membersData && membersData.length > 0) {
          const userIds = membersData.map(m => m.userId);
          const users = await fetchUsersByIds(userIds);
          // Merge user info with member role
          const merged = membersData.map(member => {
            const user = users.find(u => u.id === member.userId) || {};
            // Fallback to Google/Firebase avatar if available in member object
            let avatar = user.avatar || member.avatar || '';
            // If still no avatar, try to use member.photoURL (if present from Firebase)
            if (!avatar && member.photoURL) avatar = member.photoURL;
            return {
              userId: member.userId,
              role: member.role,
              name: user.name || member.name || '',
              email: user.email || member.email || '',
              avatar
            };
          });
          setMemberUsers(merged);
        } else {
          setMemberUsers([]);
        }

        // Fetch project tasks
        const tasksData = await fetchTasksByProject(id);
        setTasks(tasksData);

        // Fetch project features
        const featuresData = await fetchFeaturesByProject(id);
        setFeatures(featuresData);

        // Fetch project stories
        const storiesData = await fetchStoriesByProject(id);
        setStories(storiesData);
      } catch (err) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Invite Member logic
  const handleAddMember = async () => {
    if (!newMember.email.trim() || !newMember.role) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email and select a role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsInviting(true);
    try {
      await inviteProjectMember({ projectId: id, email: newMember.email, role: newMember.role });
      toast({
        title: 'Invite Sent',
        description: 'Invitation email sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewMember({ email: '', role: 'Developer' });
      onAddMemberClose();
      // Optionally reload members if backend adds immediately after invite accepted
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to send invite',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsInviting(false);
    }
  };

  // Helper to reload tasks after add
  const loadTasks = async () => {
    try {
      const tasksData = await fetchTasksByProject(id);
      setTasks(tasksData);
    } catch (err) {
      // Optionally show a toast or log error
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.featureId || !newTask.assignedTo) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields, select a feature, and assign a member',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createTask({
        ...newTask,
        projectId: id,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      toast({
        title: 'Success',
        description: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'TODO',
        dueDate: '',
        featureId: '',
        storyId: '',
        assignedTo: ''
      });
      onAddTaskClose();
      loadTasks();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create task',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Helper to reload features after add
  const loadFeatures = async () => {
    try {
      const featuresData = await fetchFeaturesByProject(id);
      setFeatures(featuresData);
    } catch (err) {
      // Optionally show a toast or log error
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.title.trim() || !newFeature.description.trim() || !newFeature.storyId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and select a story',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Find the selected story's due date
    const selectedStory = stories.find(story => (story.id || story._id) === newFeature.storyId);
    let maxDueDate = selectedStory && selectedStory.dueDate ? selectedStory.dueDate : null;
    if (newFeature.dueDate && maxDueDate) {
      // Compare as YYYY-MM-DD
      const featureDue = new Date(newFeature.dueDate + 'T00:00:00Z');
      const storyDue = new Date(maxDueDate);
      if (featureDue > storyDue) {
        toast({
          title: 'Error',
          description: 'Feature due date cannot be after the selected story\'s due date',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      // Convert dueDate to ISO string if present and not already ISO
      let dueDateISO = newFeature.dueDate;
      if (dueDateISO && !dueDateISO.includes('T')) {
        dueDateISO = new Date(dueDateISO + 'T00:00:00Z').toISOString();
      }
      await createFeature({
        ...newFeature,
        dueDate: dueDateISO,
        projectId: id,
        storyIds: [newFeature.storyId],
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      toast({
        title: 'Success',
        description: 'Feature created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewFeature({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'PLANNING',
        storyId: '',
        dueDate: ''
      });
      onAddFeatureClose();
      loadFeatures();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create feature',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'in_progress': case 'in-progress': return 'green';
      case 'planning': case 'todo': return 'blue';
      case 'completed': case 'done': return 'gray';
      case 'on_hold': case 'on-hold': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color={textColor}>Loading project details...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh" p={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading project!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} leftIcon={<FaArrowLeft />} onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box bg={bgColor} minH="100vh" p={8}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Project not found!</AlertTitle>
            <AlertDescription>The project you're looking for doesn't exist.</AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} leftIcon={<FaArrowLeft />} onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 2, md: 8 }}>
      {/* Modern Gradient Header */}
      <Box
        mb={10}
        borderRadius="2xl"
        px={{ base: 4, md: 10 }}
        py={{ base: 6, md: 8 }}
        bgGradient="linear(90deg, #7B61FF 0%, #3B82F6 40%, #22C55E 80%, #FACC15 100%)"
        boxShadow="2xl"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        gap={6}
      >
        <Button
          leftIcon={<FaArrowLeft />}
          variant="solid"
          colorScheme="whiteAlpha"
          fontWeight="bold"
          onClick={() => navigate('/projects')}
          bg="rgba(255,255,255,0.15)"
          color="white"
          _hover={{ bg: 'rgba(255,255,255,0.25)' }}
          size="lg"
        >
          Back
        </Button>
        <Heading
          size="xl"
          color="white"
          fontWeight="extrabold"
          letterSpacing="tight"
          textShadow="0 2px 8px rgba(0,0,0,0.18)"
          mr={4}
        >
          {project.name}
        </Heading>
        <Badge
          colorScheme={getStatusColor(project.status)}
          borderRadius="full"
          px={4}
          py={2}
          fontWeight="bold"
          fontSize="md"
          variant="solid"
          textTransform="uppercase"
          letterSpacing="wide"
          bg="rgba(255,255,255,0.18)"
          color="white"
        >
          {project.status}
        </Badge>
      </Box>

      {/* Project Overview - Glassy Modern Styling */}
      <Card
        bg={useColorModeValue('rgba(255,255,255,0.08)', 'rgba(30,41,59,0.7)')}
        borderColor={useColorModeValue('blue.100', 'gray.700')}
        mb={10}
        borderRadius="2xl"
        shadow="2xl"
        px={{ base: 3, md: 6 }}
        py={6}
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <CardBody>
          <VStack align="stretch" spacing={6}>
            {/* Description full width */}
            <Box>
              <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Description</Text>
              <Text color={textColor} fontSize="md" fontWeight="medium" noOfLines={5} mb={2}>{project.description}</Text>
            </Box>
            {/* Priority, Start, Due in one row */}
            <HStack spacing={4} flexWrap="wrap">
              <Box>
                <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Priority</Text>
                <Badge
                  colorScheme={getPriorityColor(project.priority)}
                  borderRadius="full"
                  px={4}
                  py={1}
                  fontWeight="bold"
                  fontSize="sm"
                  variant="solid"
                  letterSpacing="wide"
                >
                  {project.priority}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Start Date</Text>
                <Badge colorScheme="blue" borderRadius="full" px={4} py={1} fontWeight="bold" fontSize="sm" variant="solid" letterSpacing="wide">
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                </Badge>
              </Box>
              <Box>
                <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Due Date</Text>
                <Badge colorScheme="green" borderRadius="full" px={4} py={1} fontWeight="bold" fontSize="sm" variant="solid" letterSpacing="wide">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                </Badge>
              </Box>
            </HStack>
            {/* Progress */}
            <Box>
              <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Progress</Text>
              <Progress value={project.progress || 0} colorScheme="blue" size="md" borderRadius="full" bg={useColorModeValue('gray.800', 'gray.600')} mb={1} />
              <Text fontSize="sm" color={useColorModeValue('gray.400', 'gray.500')} fontWeight="bold">
                {project.progress || 0}% Complete
              </Text>
            </Box>
            {/* Members */}
            <Box>
              <Text fontSize="md" color={useColorModeValue('gray.400', 'gray.400')} fontWeight="bold" mb={1} letterSpacing="wide">Members</Text>
              <AvatarGroup size="sm" max={4}>
                {memberUsers.map((member, index) => (
                  <Avatar
                    key={member.userId || index}
                    name={member.name || member.email}
                    src={member.avatar}
                    border="2px solid"
                    borderColor={useColorModeValue('white', 'gray.700')}
                  />
                ))}
              </AvatarGroup>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Tabs - Modern Styling */}
      <Tabs variant="soft-rounded" colorScheme="blue" bg="transparent" borderRadius="xl">
        <TabList bg={useColorModeValue('gray.900', 'gray.800')} borderRadius="xl" px={2} py={2} mb={2}>
          <Tab fontWeight="bold" fontSize="md" _selected={{ color: 'white', bg: 'blue.500' }}><Icon as={FaFlag} mr={2} />Stories ({stories.length})</Tab>
          <Tab fontWeight="bold" fontSize="md" _selected={{ color: 'white', bg: 'blue.500' }}><Icon as={FaTasks} mr={2} />Tasks ({tasks.length})</Tab>
          <Tab fontWeight="bold" fontSize="md" _selected={{ color: 'white', bg: 'blue.500' }}><Icon as={FaCog} mr={2} />Features ({features.length})</Tab>
          <Tab fontWeight="bold" fontSize="md" _selected={{ color: 'white', bg: 'blue.500' }}><Icon as={FaUsers} mr={2} />Members ({members.length})</Tab>
        </TabList>

        <TabPanels>
          {/* Stories Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={textColor}>Project Stories</Heading>
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onAddStoryOpen}>
                Add Story
              </Button>
            </Flex>

            {stories.length === 0 ? (
              <Card
                bg={useColorModeValue('gray.800', 'gray.700')}
                borderColor={useColorModeValue('gray.700', 'gray.600')}
                borderRadius="2xl"
                shadow="md"
                mx="auto"
                maxW="6xl"
                minH="320px"
                mt={8}
              >
                <CardBody py={24} px={10} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box mb={4}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" rx="12" fill="#2563EB" fillOpacity="0.12"/>
                      <path d="M24 14L28 24H20L24 14Z" fill="#2563EB"/>
                      <rect x="22" y="28" width="4" height="4" rx="2" fill="#2563EB"/>
                    </svg>
                  </Box>
                  <Text color={useColorModeValue('gray.100', 'gray.200')} fontSize="2xl" fontWeight="bold" mb={2}>
                    No stories yet
                  </Text>
                  <Text color={useColorModeValue('gray.400', 'gray.400')} fontSize="md" mb={2}>
                    Create your first story to get started
                  </Text>
                </CardBody>
              </Card>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {stories.map((story) => (
                  <Card
                    key={story._id || story.id}
                    bg={useColorModeValue('rgba(255,255,255,0.12)', 'rgba(30,41,59,0.85)')}
                    borderColor={useColorModeValue('blue.100', 'gray.700')}
                    borderWidth="1.5px"
                    borderRadius="2xl"
                    boxShadow="0 4px 24px 0 rgba(0,0,0,0.10)"
                    style={{ backdropFilter: 'blur(8px)' }}
                    transition="all 0.2s"
                    _hover={{ boxShadow: '2xl', transform: 'translateY(-2px) scale(1.03)', borderColor: 'blue.400', cursor: 'pointer' }}
                    onClick={() => navigate(`/story/${story._id || story.id}`)}
                  >
                    <CardBody p={6}>
                      <VStack align="start" spacing={4} w="100%">
                        <HStack w="100%" justify="space-between" align="start">
                          <Heading size="md" color={useColorModeValue('gray.800', 'white')} fontWeight="bold" noOfLines={1} letterSpacing="tight">
                            {story.title}
                          </Heading>
                          <Badge colorScheme={getPriorityColor(story.priority)} fontSize="0.9em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                            {story.priority}
                          </Badge>
                        </HStack>
                        <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')} noOfLines={3} fontWeight="medium">
                          {story.description}
                        </Text>
                        <HStack spacing={2} mt={2}>
                          <Badge colorScheme={getStatusColor(story.status)} fontSize="0.85em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                            {story.status}
                          </Badge>
                          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="semibold">
                            • Points: <b>{story.storyPoints || '-'}</b>
                          </Text>
                          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="semibold">
                            • Due: <b>{story.dueDate ? new Date(story.dueDate).toLocaleDateString() : '-'}</b>
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}

            {/* Add Story Modal */}
            <Modal isOpen={isAddStoryOpen} onClose={onAddStoryClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add New Story</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Title *</FormLabel>
                      <Input
                        placeholder="Enter story title"
                        value={newStory.title}
                        onChange={e => setNewStory({ ...newStory, title: e.target.value })}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Description *</FormLabel>
                      <Textarea
                        placeholder="Enter story description"
                        value={newStory.description}
                        onChange={e => setNewStory({ ...newStory, description: e.target.value })}
                      />
                    </FormControl>
                    <HStack spacing={4} w="100%">
                      <FormControl isRequired>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          value={newStory.priority}
                          onChange={e => setNewStory({ ...newStory, priority: e.target.value })}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={newStory.status}
                          onChange={e => setNewStory({ ...newStory, status: e.target.value })}
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </Select>
                      </FormControl>
                    </HStack>
                    <FormControl>
                      <FormLabel>Story Points</FormLabel>
                      <Input
                        type="number"
                        min={1}
                        value={newStory.storyPoints}
                        onChange={e => setNewStory({ ...newStory, storyPoints: e.target.value })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Due Date</FormLabel>
                      <Input
                        type="date"
                        value={newStory.dueDate}
                        onChange={e => setNewStory({ ...newStory, dueDate: e.target.value })}
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onAddStoryClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddStory}>
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanel>
          {/* Tasks Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={textColor}>Project Tasks</Heading>
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onAddTaskOpen}>
                Add Task
              </Button>
            </Flex>

            {tasks.length === 0 ? (
              <Card
                bg={useColorModeValue('gray.800', 'gray.700')}
                borderColor={useColorModeValue('gray.700', 'gray.600')}
                borderRadius="2xl"
                shadow="md"
                mx="auto"
                maxW="6xl"
                minH="320px"
                mt={8}
              >
                <CardBody py={24} px={10} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box mb={4}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" rx="12" fill="#2563EB" fillOpacity="0.12"/>
                      <path d="M24 14L28 24H20L24 14Z" fill="#2563EB"/>
                      <rect x="22" y="28" width="4" height="4" rx="2" fill="#2563EB"/>
                    </svg>
                  </Box>
                  <Text color={useColorModeValue('gray.100', 'gray.200')} fontSize="2xl" fontWeight="bold" mb={2}>
                    No tasks yet
                  </Text>
                  <Text color={useColorModeValue('gray.400', 'gray.400')} fontSize="md" mb={2}>
                    Create your first task to get started
                  </Text>
                </CardBody>
              </Card>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {tasks.map((task) => {
                  const key = task._id || task.id || task.title;
                  const assignee = memberUsers.find(m => m.userId === task.assignedTo);
                  return (
                    <Card
                      key={key}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderColor={useColorModeValue('blue.200', 'gray.700')}
                      borderWidth="1.5px"
                      borderRadius="2xl"
                      boxShadow="0 4px 24px 0 rgba(0,0,0,0.10)"
                      style={{ backdropFilter: 'blur(8px)' }}
                      transition="all 0.2s"
                      _hover={{ boxShadow: '2xl', transform: 'translateY(-2px) scale(1.03)', borderColor: 'blue.400', cursor: 'pointer' }}
                      onClick={() => navigate(`/task/${task._id || task.id}`)}
                    >
                      <CardBody p={6}>
                        <VStack align="start" spacing={4} w="100%">
                          <HStack w="100%" justify="space-between" align="start">
                            <Heading size="md" color={useColorModeValue('gray.800', 'white')} fontWeight="bold" noOfLines={1} letterSpacing="tight">
                              {task.title}
                            </Heading>
                            <Badge colorScheme={getPriorityColor(task.priority)} fontSize="0.9em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                              {task.priority}
                            </Badge>
                          </HStack>
                          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')} noOfLines={3} fontWeight="medium">
                            {task.description}
                          </Text>
                          <HStack spacing={2} mt={2}>
                            <Badge colorScheme={getStatusColor(task.status)} fontSize="0.85em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                              {task.status}
                            </Badge>
                            {task.dueDate && (
                              <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="semibold">
                                • Due: <b>{new Date(task.dueDate).toLocaleDateString()}</b>
                              </Text>
                            )}
                          </HStack>
                          {assignee && (
                            <HStack spacing={1} mt={1}>
                              <Avatar size="xs" name={assignee.name || assignee.email} src={assignee.avatar} />
                              <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="semibold">
                                • {assignee.name || assignee.email}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Features Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={textColor}>Project Features</Heading>
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onAddFeatureOpen}>
                Add Feature
              </Button>
            </Flex>

            {features.length === 0 ? (
              <Card
                bg={useColorModeValue('gray.800', 'gray.700')}
                borderColor={useColorModeValue('gray.700', 'gray.600')}
                borderRadius="2xl"
                shadow="md"
                mx="auto"
                maxW="6xl"
                minH="320px"
                mt={8}
              >
                <CardBody py={24} px={10} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box mb={4}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" rx="12" fill="#2563EB" fillOpacity="0.12"/>
                      <path d="M24 14L28 24H20L24 14Z" fill="#2563EB"/>
                      <rect x="22" y="28" width="4" height="4" rx="2" fill="#2563EB"/>
                    </svg>
                  </Box>
                  <Text color={useColorModeValue('gray.100', 'gray.200')} fontSize="2xl" fontWeight="bold" mb={2}>
                    No features yet
                  </Text>
                  <Text color={useColorModeValue('gray.400', 'gray.400')} fontSize="md" mb={2}>
                    Create your first feature to get started
                  </Text>
                </CardBody>
              </Card>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {features.map((feature) => {
                  const key = feature._id || feature.id || feature.title;
                  return (
                    <Card
                      key={key}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderColor={useColorModeValue('blue.200', 'gray.700')}
                      borderWidth="1.5px"
                      borderRadius="2xl"
                      boxShadow="0 4px 24px 0 rgba(0,0,0,0.10)"
                      style={{ backdropFilter: 'blur(8px)' }}
                      transition="all 0.2s"
                      _hover={{ boxShadow: '2xl', transform: 'translateY(-2px) scale(1.03)', borderColor: 'blue.400', cursor: 'pointer' }}
                      onClick={() => navigate(`/feature/${feature._id || feature.id}`)}
                    >
                      <CardBody p={6}>
                        <VStack align="start" spacing={4} w="100%">
                          <HStack w="100%" justify="space-between" align="start">
                            <Heading size="md" color={useColorModeValue('gray.800', 'white')} fontWeight="bold" noOfLines={1} letterSpacing="tight">
                              {feature.title}
                            </Heading>
                            <Badge colorScheme={getPriorityColor(feature.priority)} fontSize="0.9em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                              {feature.priority}
                            </Badge>
                          </HStack>
                          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')} noOfLines={3} fontWeight="medium">
                            {feature.description}
                          </Text>
                          <HStack spacing={2} mt={2}>
                            <Badge colorScheme={getStatusColor(feature.status)} fontSize="0.85em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                              {feature.status}
                            </Badge>
                            {feature.dueDate && (
                              <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} fontWeight="semibold">
                                • Due: <b>{new Date(feature.dueDate).toLocaleDateString()}</b>
                              </Text>
                            )}
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </TabPanel>

          {/* Members Tab */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={textColor}>Project Members</Heading>
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onAddMemberOpen}>
                Add Member
              </Button>
            </Flex>

            {memberUsers.length === 0 ? (
              <Card
                bg={useColorModeValue('gray.800', 'gray.700')}
                borderColor={useColorModeValue('gray.700', 'gray.600')}
                borderRadius="2xl"
                shadow="md"
                mx="auto"
                maxW="4xl"
                minH="260px"
                mt={8}
              >
                <CardBody py={20} px={10} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box mb={4}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" rx="12" fill="#2563EB" fillOpacity="0.12"/>
                      <path d="M24 18C26.2091 18 28 16.2091 28 14C28 11.7909 26.2091 10 24 10C21.7909 10 20 11.7909 20 14C20 16.2091 21.7909 18 24 18Z" fill="#2563EB"/>
                      <path d="M24 20C19.5817 20 16 22.6863 16 26V28C16 28.5523 16.4477 29 17 29H31C31.5523 29 32 28.5523 32 28V26C32 22.6863 28.4183 20 24 20Z" fill="#2563EB"/>
                    </svg>
                  </Box>
                  <Text color={useColorModeValue('gray.100', 'gray.200')} fontSize="2xl" fontWeight="bold" mb={2}>
                    No members yet
                  </Text>
                  <Text color={useColorModeValue('gray.400', 'gray.400')} fontSize="md" mb={2}>
                    Add team members to collaborate on this project
                  </Text>
                </CardBody>
              </Card>
            ) : (
              <Box overflowX="auto" borderRadius="xl" boxShadow="md" bg={cardBg}>
                <Table variant="simple" size="md">
                  <Thead bg={useColorModeValue('gray.100', 'gray.700')}>
                    <Tr>
                      <Th fontSize="md" color={textColor}>Member</Th>
                      <Th fontSize="md" color={textColor}>Role</Th>
                      <Th fontSize="md" color={textColor}>Joined</Th>
                      <Th fontSize="md" color={textColor}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {memberUsers.map((member, idx) => (
                      <Tr key={member.userId || idx} _hover={{ bg: useColorModeValue('gray.50', 'gray.800') }}>
                        <Td>
                          <HStack>
                            <Avatar size="md" name={member.name || member.email} src={member.avatar} />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="semibold" fontSize="md">{member.name || 'Unknown'}</Text>
                              <Text fontSize="sm" color="gray.500">{member.email}</Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">{member.role}</Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm">
                            {/* joinedAt is not available from user info, so leave blank or N/A */}
                            N/A
                          </Text>
                        </Td>
                        <Td>
                          <Button size="sm" colorScheme="red" variant="ghost">
                            Remove
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Invite Member Modal */}
      <Modal isOpen={isAddMemberOpen} onClose={onAddMemberClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Project Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Tester">Tester</option>
                  <option value="Viewer">Viewer</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddMemberClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddMember} isLoading={isInviting}>
              Send Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={isAddTaskOpen} onClose={onAddTaskClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Task Title</FormLabel>
                <Input
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Feature</FormLabel>
                <Select
                  placeholder="Select a feature"
                  value={newTask.featureId}
                  onChange={e => setNewTask({ ...newTask, featureId: e.target.value })}
                >
                  {features && features.length > 0 ? (
                    features.map(feature => (
                      <option key={feature.id || feature._id} value={feature.id || feature._id}>
                        {feature.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No features available</option>
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Story (optional)</FormLabel>
                <Select
                  placeholder="Select a story"
                  value={newTask.storyId}
                  onChange={e => setNewTask({ ...newTask, storyId: e.target.value })}
                >
                  {stories && stories.length > 0 ? (
                    stories.map(story => (
                      <option key={story.id || story._id} value={story.id || story._id}>
                        {story.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No stories available</option>
                  )}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Assign To</FormLabel>
                <Select
                  placeholder="Select a member"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  {memberUsers && memberUsers.length > 0 ? (
                    memberUsers.map(member => (
                      <option key={member.userId} value={member.userId}>
                        {member.name || member.email}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No members available</option>
                  )}
                </Select>
              </FormControl>
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </Select>
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddTaskClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddTask}>
              Create Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Feature Modal */}
      <Modal isOpen={isAddFeatureOpen} onClose={onAddFeatureClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Feature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Feature Title</FormLabel>
                <Input
                  placeholder="Enter feature title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter feature description"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Story</FormLabel>
                <Select
                  placeholder="Select a story"
                  value={newFeature.storyId}
                  onChange={e => setNewFeature({ ...newFeature, storyId: e.target.value, dueDate: '' })}
                >
                  {stories && stories.length > 0 ? (
                    stories.map(story => (
                      <option key={story.id || story._id} value={story.id || story._id}>
                        {story.title}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No stories available</option>
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  type="date"
                  value={newFeature.dueDate}
                  onChange={e => setNewFeature({ ...newFeature, dueDate: e.target.value })}
                  min={(() => {
                    // Optionally, you can set min to today or the story's start date
                    return '';
                  })()}
                  max={(() => {
                    const selectedStory = stories.find(story => (story.id || story._id) === newFeature.storyId);
                    if (selectedStory && selectedStory.dueDate) {
                      // Format as YYYY-MM-DD
                      const d = new Date(selectedStory.dueDate);
                      return d.toISOString().split('T')[0];
                    }
                    return '';
                  })()}
                  disabled={!newFeature.storyId}
                />
                {newFeature.storyId && (() => {
                  const selectedStory = stories.find(story => (story.id || story._id) === newFeature.storyId);
                  if (selectedStory && selectedStory.dueDate) {
                    const d = new Date(selectedStory.dueDate);
                    return <Text fontSize="xs" color="gray.500">Max: {d.toLocaleDateString()}</Text>;
                  }
                  return null;
                })()}
              </FormControl>
              <HStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={newFeature.priority}
                    onChange={(e) => setNewFeature({ ...newFeature, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={newFeature.status}
                    onChange={(e) => setNewFeature({ ...newFeature, status: e.target.value })}
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddFeatureClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddFeature}>
              Create Feature
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProjectDetailsPage;
