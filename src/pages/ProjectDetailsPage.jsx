import {
  Box,
  Heading,
  Text,
  Flex,
  AvatarGroup,
  Avatar,
  Badge,
  Progress,
  Divider,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaClock, FaCalendarAlt, FaTasks, FaEye, FaGripVertical, FaUser } from "react-icons/fa";

// Mock projects data (should match the one from Projects.jsx)
const mockProjects = [
  {
    id: 1,
    name: 'Task Manager',
    description: 'A comprehensive task management system with real-time collaboration',
    owner: 'Alice Johnson',
    progress: 60,
    deadline: '2025-07-30',
    status: 'In Progress',
    team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    tasksCompleted: 12,
    totalTasks: 20,
    startDate: '2025-06-01',
  },
  {
    id: 2,
    name: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with advanced analytics and payment integration',
    owner: 'Bob Smith',
    progress: 90,
    deadline: '2025-07-20',
    status: 'Completed',
    team: ['David Wilson', 'Emma Brown'],
    tasksCompleted: 18,
    totalTasks: 20,
    startDate: '2025-05-15',
  },
  {
    id: 3,
    name: 'Project Tracker UI',
    description: 'Intuitive project tracking interface with dashboard and reporting features',
    owner: 'You',
    progress: 35,
    deadline: '2025-08-15',
    status: 'Pending',
    team: ['Frank Miller', 'Grace Lee', 'Henry Taylor'],
    tasksCompleted: 7,
    totalTasks: 20,
    startDate: '2025-06-15',
  },
];

// Mock tasks data organized by project
const mockProjectTasks = {
  1: [ // Task Manager Project
    {
      id: 1,
      title: 'Create Login Page',
      description: 'Design and develop login screen UI with modern authentication flow',
      status: 'To Do',
      assignedTo: 'Alice Johnson',
      dueDate: '2025-07-10',
      priority: 'High',
      tags: ['Frontend', 'UI/UX'],
    },
    {
      id: 2,
      title: 'Implement Task API',
      description: 'Create RESTful routes for task endpoints with proper validation',
      status: 'In Progress',
      assignedTo: 'Bob Smith',
      dueDate: '2025-07-08',
      priority: 'Medium',
      tags: ['Backend', 'API'],
    },
    {
      id: 3,
      title: 'Fix task list bug',
      description: 'Resolve issue with task filter not updating correctly',
      status: 'Done',
      assignedTo: 'Carol Davis',
      dueDate: '2025-07-05',
      priority: 'Low',
      tags: ['Bug Fix', 'Frontend'],
    },
    {
      id: 8,
      title: 'Database Schema Design',
      description: 'Design and implement the database schema for user management',
      status: 'To Do',
      assignedTo: 'Alice Johnson',
      dueDate: '2025-07-12',
      priority: 'High',
      tags: ['Database', 'Backend'],
    },
    {
      id: 9,
      title: 'User Authentication',
      description: 'Implement secure user authentication with JWT tokens',
      status: 'In Progress',
      assignedTo: 'Bob Smith',
      dueDate: '2025-07-15',
      priority: 'High',
      tags: ['Security', 'Backend'],
    }
  ],
  2: [ // E-Commerce Platform
    {
      id: 4,
      title: 'Product Catalog UI',
      description: 'Create responsive product listing and detail pages',
      status: 'Done',
      assignedTo: 'David Wilson',
      dueDate: '2025-07-01',
      priority: 'High',
      tags: ['Frontend', 'UI/UX'],
    },
    {
      id: 5,
      title: 'Payment Integration',
      description: 'Integrate Stripe payment gateway for secure transactions',
      status: 'Done',
      assignedTo: 'Emma Brown',
      dueDate: '2025-07-03',
      priority: 'High',
      tags: ['Backend', 'Payment'],
    },
    {
      id: 10,
      title: 'Order Management',
      description: 'Build order tracking and management system',
      status: 'In Progress',
      assignedTo: 'David Wilson',
      dueDate: '2025-07-18',
      priority: 'Medium',
      tags: ['Backend', 'Orders'],
    }
  ],
  3: [ // Project Tracker UI
    {
      id: 6,
      title: 'Dashboard Design',
      description: 'Create modern dashboard with analytics and charts',
      status: 'In Progress',
      assignedTo: 'Frank Miller',
      dueDate: '2025-08-05',
      priority: 'High',
      tags: ['Frontend', 'Analytics'],
    },
    {
      id: 7,
      title: 'Reporting System',
      description: 'Build comprehensive reporting and export functionality',
      status: 'To Do',
      assignedTo: 'Grace Lee',
      dueDate: '2025-08-10',
      priority: 'Medium',
      tags: ['Backend', 'Reports'],
    },
    {
      id: 11,
      title: 'Mobile Responsiveness',
      description: 'Ensure the interface works perfectly on mobile devices',
      status: 'To Do',
      assignedTo: 'Henry Taylor',
      dueDate: '2025-08-12',
      priority: 'Medium',
      tags: ['Frontend', 'Mobile'],
    }
  ]
};

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // State for tasks (to handle drag and drop)
  const [tasks, setTasks] = React.useState(mockProjectTasks[parseInt(projectId)] || []);
  const [draggedTask, setDraggedTask] = React.useState(null);

  // Find the project by ID
  const project = mockProjects.find(p => p.id === parseInt(projectId));
  const projectTasks = tasks;

  // If project not found, show error message
  if (!project) {
    return (
      <Box px={8} py={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
        <VStack spacing={4} textAlign="center" mt={20}>
          <Heading size="lg" color={textColor}>Project Not Found</Heading>
          <Text color="gray.500">The project you're looking for doesn't exist.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </VStack>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Done':
        return 'green';
      case 'In Progress':
        return 'blue';
      case 'Pending':
      case 'To Do':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
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
      'Security': 'red',
      'Payment': 'yellow',
      'Orders': 'cyan',
      'Reports': 'gray',
      'Mobile': 'blue',
    };
    return colors[tag] || 'gray';
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTask.id
            ? { ...task, status: newStatus }
            : task
        )
      );
    }
    setDraggedTask(null);
  };

  // Group tasks by status
  const tasksByStatus = {
    'To Do': projectTasks.filter(task => task.status === 'To Do'),
    'In Progress': projectTasks.filter(task => task.status === 'In Progress'),
    'Done': projectTasks.filter(task => task.status === 'Done'),
  };

  const TaskCard = ({ task }) => (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={5}
      border="1px"
      borderColor="gray.700"
      boxShadow="md"
      _hover={{ 
        boxShadow: 'xl', 
        transform: 'translateY(-2px)',
        borderColor: 'gray.600',
        cursor: 'pointer'
      }}
      transition="all 0.2s"
      cursor="move"
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => handleTaskClick(task.id)}
      mb={4}
    >
      {/* Drag Handle */}
      <Flex align="center" justify="space-between" mb={3}>
        <Icon as={FaGripVertical} color="gray.500" boxSize={3} />
        <HStack spacing={2}>
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
        </HStack>
      </Flex>

      {/* Title */}
      <Heading size="sm" color="white" mb={2} noOfLines={2}>
        {task.title}
      </Heading>

      {/* Description */}
      <Text color="gray.400" fontSize="sm" mb={4} noOfLines={3}>
        {task.description}
      </Text>

      <Divider borderColor="gray.700" mb={4} />

      {/* Footer */}
      <Flex justify="space-between" align="center">
        <HStack spacing={3}>
          <HStack spacing={1}>
            <Icon as={FaUser} color="gray.500" boxSize={3} />
            <Avatar name={task.assignedTo} size="xs" />
          </HStack>
          <HStack spacing={1}>
            <Icon as={FaClock} color="gray.500" boxSize={3} />
            <Text color="gray.400" fontSize="xs">
              {formatDate(task.dueDate)}
            </Text>
          </HStack>
        </HStack>
        <Badge 
          colorScheme={getPriorityColor(task.priority)}
          variant="outline"
          borderRadius="full"
          fontSize="xs"
          px={2}
        >
          {task.priority}
        </Badge>
      </Flex>
    </Box>
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
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
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
              Drop tasks here
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box px={8} py={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Back Button */}
      <Button
        leftIcon={<Icon as={FaArrowLeft} />}
        variant="ghost"
        colorScheme="blue"
        mb={6}
        onClick={() => navigate('/projects')}
        _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
      >
        Back to Projects
      </Button>

      {/* Main Content Card */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        p={8}
        boxShadow="xl"
        border="1px"
        borderColor={borderColor}
      >
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb={6}>
          <VStack align="start" spacing={2}>
            <Heading size="xl" color={textColor}>
              {project.name}
            </Heading>
            <Text color="gray.500" fontSize="lg" maxW="2xl">
              {project.description}
            </Text>
          </VStack>
          <Badge 
            colorScheme={getStatusColor(project.status)}
            borderRadius="full"
            px={4}
            py={2}
            fontSize="md"
          >
            {project.status}
          </Badge>
        </Flex>

        {/* Owner & Team */}
        <VStack spacing={4} mb={8}>
          <Flex justify="space-between" w="full" align="center">
            <HStack spacing={3}>
              <Icon as={FaUsers} color="gray.500" boxSize={5} />
              <Text color={textColor} fontWeight="semibold">
                Project Owner: {project.owner}
              </Text>
            </HStack>
            <AvatarGroup size="md" max={5} spacing="-0.5rem">
              {project.team.map((name, index) => (
                <Avatar 
                  key={index} 
                  name={name} 
                  border="2px solid"
                  borderColor={cardBg}
                />
              ))}
            </AvatarGroup>
          </Flex>
        </VStack>

        <Divider borderColor={borderColor} mb={8} />

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} mb={8}>
          <Box
            p={6}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="xl"
            textAlign="center"
          >
            <Icon as={FaCalendarAlt} color="blue.500" boxSize={8} mb={2} />
            <Text fontSize="sm" color="gray.500" mb={1}>Start Date</Text>
            <Text fontWeight="bold" color={textColor}>
              {formatDate(project.startDate)}
            </Text>
          </Box>

          <Box
            p={6}
            bg={useColorModeValue('red.50', 'red.900')}
            borderRadius="xl"
            textAlign="center"
          >
            <Icon as={FaClock} color="red.500" boxSize={8} mb={2} />
            <Text fontSize="sm" color="gray.500" mb={1}>Due Date</Text>
            <Text fontWeight="bold" color={textColor}>
              {formatDate(project.deadline)}
            </Text>
            <Text fontSize="xs" color={getDaysRemaining(project.deadline) < 7 ? "red.500" : "gray.500"}>
              {getDaysRemaining(project.deadline)} days remaining
            </Text>
          </Box>

          <Box
            p={6}
            bg={useColorModeValue('green.50', 'green.900')}
            borderRadius="xl"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="green.500" mb={1}>
              {project.tasksCompleted}
            </Text>
            <Text fontSize="sm" color="gray.500">Tasks Completed</Text>
          </Box>

          <Box
            p={6}
            bg={useColorModeValue('orange.50', 'orange.900')}
            borderRadius="xl"
            textAlign="center"
          >
            <Text fontSize="2xl" fontWeight="bold" color="orange.500" mb={1}>
              {project.totalTasks}
            </Text>
            <Text fontSize="sm" color="gray.500">Total Tasks</Text>
          </Box>
        </SimpleGrid>

        {/* Progress Section */}
        <Box
          p={6}
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="xl"
          mb={8}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Project Progress
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {project.progress}%
            </Text>
          </Flex>
          <Progress 
            value={project.progress} 
            colorScheme={getStatusColor(project.status)}
            borderRadius="full"
            size="lg"
            bg={useColorModeValue('gray.200', 'gray.600')}
          />
          <Flex justify="space-between" mt={3}>
            <Text fontSize="sm" color="gray.500">
              {project.tasksCompleted} of {project.totalTasks} tasks completed
            </Text>
            <Text fontSize="sm" color="gray.500">
              {project.totalTasks - project.tasksCompleted} tasks remaining
            </Text>
          </Flex>
        </Box>

        {/* Tabs for Project Details and Tasks */}
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>
              <Icon as={FaCalendarAlt} mr={2} />
              Project Overview
            </Tab>
            <Tab>
              <Icon as={FaTasks} mr={2} />
              Tasks ({projectTasks.length})
            </Tab>
          </TabList>

          <TabPanels>
            {/* Project Overview Tab */}
            <TabPanel px={0}>
              <Text color="gray.500" fontSize="lg" textAlign="center" py={8}>
                Additional project details, milestones, and documentation would go here.
              </Text>
            </TabPanel>

            {/* Tasks Tab */}
            <TabPanel px={0}>
              <Box>
                <Flex justify="space-between" align="center" mb={6}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Project Tasks - Kanban Board
                  </Text>
                  <Button
                    leftIcon={<Icon as={FaEye} />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/tasks')}
                  >
                    View All Tasks
                  </Button>
                </Flex>

                {projectTasks.length > 0 ? (
                  <Flex gap={6} align="start" overflowX="auto" pb={4}>
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
                ) : (
                  <Box
                    textAlign="center"
                    py={12}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="xl"
                    border="2px dashed"
                    borderColor="gray.300"
                  >
                    <Icon as={FaTasks} boxSize={12} color="gray.400" mb={4} />
                    <Text color="gray.500" fontSize="lg" mb={2}>
                      No tasks found for this project
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Tasks will appear here once they are created and assigned to this project.
                    </Text>
                  </Box>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ProjectDetailsPage;
