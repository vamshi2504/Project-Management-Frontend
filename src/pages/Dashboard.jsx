import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Heading,
  Progress,
  Badge,
  Divider,
  Stack,
  Avatar,
  AvatarGroup,
  Button,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
} from '@chakra-ui/react';
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaBell,
  FaArrowRight,
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

// API imports
import { fetchAllTasks } from '../api/tasks';
import { fetchAllProjects } from '../api/projects';
import { useUser } from '../hooks/useUser';

const Dashboard = () => {
  // Local state for data
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  
  const { user } = useUser();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardContentBg = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('blue.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const gradientBg = useColorModeValue(
    'linear(135deg, purple.400 0%, blue.400 25%, teal.400 50%, green.400 75%, yellow.400 100%)',
    'linear(135deg, purple.600 0%, blue.600 25%, teal.600 50%, green.600 75%, yellow.600 100%)'
  );

  // Load data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setTasksLoading(true);
        setProjectsLoading(true);
        
        // Fetch tasks
        const tasksData = await fetchAllTasks();
        setTasks(tasksData || []);
        
        // Calculate analytics from tasks
        const totalTasks = tasksData?.length || 0;
        const completedTasks = tasksData?.filter(task => task.status === 'completed').length || 0;
        const pendingTasks = tasksData?.filter(task => task.status === 'pending' || task.status === 'in-progress').length || 0;
        const overdueTasks = tasksData?.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate < new Date() && task.status !== 'completed';
        }).length || 0;
        
        setAnalytics({
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks
        });
        
  // Fetch all projects (dynamic dashboard)
  const projectsData = await fetchAllProjects();
  setProjects(projectsData || []);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set fallback data
        setTasks([]);
        setProjects([]);
      } finally {
        setTasksLoading(false);
        setProjectsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.uid]);

  // Filter tasks assigned to current user (by userId)
  const assignedTasks = tasks.filter(task => 
    task.assignedTo === user?.uid || task.assignedTo === user?.id || task.assignedTo === user?.email
  );

  // Filter incomplete tasks assigned to current user
  const incompleteTasks = tasks.filter(task => 
    (task.assignedTo === user?.uid || task.assignedTo === user?.id || task.assignedTo === user?.email) &&
    task.status !== 'Done' && task.status !== 'Completed'
  );

  // Only show projects where the user is a team member or owner
  const userProjects = projects.filter(project => {
    if (!user) return false;
    // Check if user is owner
    if (project.ownerId === user.uid || project.ownerId === user.id || project.ownerId === user.email) return true;
    // Check if user is in teamMembers
    if (Array.isArray(project.teamMembers)) {
      return project.teamMembers.some(
        member => member.userId === user.uid || member.userId === user.id || member.userId === user.email
      );
    }
    return false;
  });

  // ...existing code...

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'planning': return 'blue';
      case 'completed': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg={bgColor}
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      {/* Loading State */}
      {(tasksLoading || projectsLoading) && (
        <Flex justify="center" align="center" h="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text color={textColor}>Loading dashboard data...</Text>
          </VStack>
        </Flex>
      )}

      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-10%"
        width="300px"
        height="300px"
        borderRadius="full"
        bgGradient="linear(135deg, purple.400, blue.400)"
        opacity={0.1}
        animation="float 6s ease-in-out infinite"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-5%"
        left="-5%"
        width="200px"
        height="200px"
        borderRadius="full"
        bgGradient="linear(135deg, teal.400, green.400)"
        opacity={0.1}
        animation="float 8s ease-in-out infinite reverse"
        zIndex={0}
      />
      
      <VStack align="stretch" spacing={8} position="relative" zIndex={1} p={6}>
        {/* Header Section with Gradient */}
        <Box
          bgGradient={gradientBg}
          borderRadius="2xl"
          p={8}
          color="white"
          position="relative"
          overflow="hidden"
          transform="translateY(0)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-2px)",
            shadow: "2xl"
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)"
            animation="shimmer 3s ease-in-out infinite"
          />
          <VStack align="start" spacing={3} position="relative" zIndex={1}>
            <Heading 
              size={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              animation="slideInLeft 0.8s ease-out"
              noOfLines={2}
            >
              Welcome back! 🚀
            </Heading>
            <Text 
              fontSize={{ base: "md", lg: "lg" }}
              opacity={0.9}
              animation="slideInLeft 0.8s ease-out 0.2s both"
              noOfLines={2}
            >
              Here's what's happening with your projects today.
            </Text>
          </VStack>
        </Box>

        {/* Stats Cards Section */}
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0) scale(1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-8px) scale(1.02)",
              shadow: "2xl",
              borderColor: "blue.300"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, blue.400, purple.400)",
            }}
            animation="slideInUp 0.6s ease-out"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color="gray.600" fontWeight="semibold" fontSize="sm">Assigned Tasks</StatLabel>
                    <StatNumber 
                      color="blue.600" 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.5s both"
                    >
                      {analytics.total || assignedTasks.length}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="blue.50"
                    color="blue.500"
                    animation="pulse 2s ease-in-out infinite"
                  >
                    <Icon as={FaTasks} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color="gray.500" fontWeight="medium">
                  <Icon as={FaTasks} mr={1} />
                  Active tasks
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0) scale(1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-8px) scale(1.02)",
              shadow: "2xl",
              borderColor: "red.300"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, red.400, orange.400)",
            }}
            animation="slideInUp 0.6s ease-out 0.1s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color="gray.600" fontWeight="semibold" fontSize="sm">Incomplete Tasks</StatLabel>
                    <StatNumber 
                      color="red.600" 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.6s both"
                    >
                      {analytics.inProgress + analytics.todo || incompleteTasks.length}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="red.50"
                    color="red.500"
                    animation="pulse 2s ease-in-out infinite 0.5s"
                  >
                    <Icon as={FaExclamationTriangle} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color="gray.500" fontWeight="medium">
                  <Icon as={FaExclamationTriangle} mr={1} />
                  {incompleteTasks.filter(task => task.overdue).length} overdue
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0) scale(1)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-8px) scale(1.02)",
              shadow: "2xl",
              borderColor: "green.300"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, green.400, teal.400)",
            }}
            animation="slideInUp 0.6s ease-out 0.2s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color="gray.600" fontWeight="semibold" fontSize="sm">Active Projects</StatLabel>
                    <StatNumber 
                      color="green.600" 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.7s both"
                    >
                      {userProjects.length}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="green.50"
                    color="green.500"
                    animation="pulse 2s ease-in-out infinite 1s"
                  >
                    <Icon as={FaProjectDiagram} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color="gray.500" fontWeight="medium">
                  <Icon as={FaProjectDiagram} mr={1} />
                  {projects.length} total
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

        </SimpleGrid>

        {/* Task Management Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Assigned Tasks */}
          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-5px)",
              shadow: "2xl"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgGradient: "linear(90deg, blue.400, purple.400)",
            }}
            animation="fadeInScale 0.8s ease-out 0.4s both"
          >
            <CardHeader bg={useColorModeValue('blue.50', 'gray.700')} borderTopRadius="2xl">
              <HStack justify="space-between">
                <HStack>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={useColorModeValue('blue.100', 'blue.800')}
                    color={useColorModeValue('blue.600', 'blue.200')}
                  >
                    <Icon as={FaTasks} boxSize={5} />
                  </Box>
                  <Heading size="md" color={textColor} fontWeight="bold">Assigned Tasks</Heading>
                </HStack>
                <Button 
                  as={RouterLink} 
                  to="/board" 
                  size="sm" 
                  variant="ghost" 
                  rightIcon={<FaArrowRight />}
                  color={useColorModeValue('blue.600', 'blue.300')}
                  fontWeight="semibold"
                  _hover={{ 
                    color: useColorModeValue('blue.700', 'blue.200'),
                    bg: useColorModeValue('blue.100', 'blue.800'),
                    transform: "translateX(3px)"
                  }}
                  transition="all 0.3s ease"
                >
                  View All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {assignedTasks.map((task, index) => (
                  <Box 
                    key={task.id || task._id} 
                    p={4} 
                    border="1px" 
                    borderColor={useColorModeValue('gray.100', 'gray.600')} 
                    borderRadius="xl"
                    bg={cardContentBg}
                    position="relative"
                    transform="translateX(0)"
                    transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{ 
                      bg: useColorModeValue('blue.50', 'gray.600'),
                      borderColor: useColorModeValue('blue.200', 'blue.500'),
                      transform: "translateX(5px)",
                      shadow: "md"
                    }}
                    animation={`fadeInScale 0.6s ease-out ${0.5 + index * 0.1}s both`}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>{task.title}</Text>
                      <Badge 
                        colorScheme={getPriorityColor(task.priority)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {task.priority}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={mutedTextColor} mb={2} noOfLines={2}>{task.description}</Text>
                    <HStack spacing={3} mb={1}>
                      <Badge colorScheme={task.status === 'COMPLETED' ? 'green' : task.status === 'IN_PROGRESS' ? 'blue' : 'gray'} fontSize="0.85em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                        {task.status?.replace('_', ' ')}
                      </Badge>
                      {task.dueDate && (
                        <HStack color={useColorModeValue('blue.500', 'blue.300')} spacing={1}>
                          <Icon as={FaClock} />
                          <Text fontWeight="medium">{new Date(task.dueDate).toLocaleDateString()}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Incomplete Tasks */}
          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-5px)",
              shadow: "2xl"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgGradient: "linear(90deg, red.400, orange.400)",
            }}
            animation="fadeInScale 0.8s ease-out 0.5s both"
          >
            <CardHeader bg={useColorModeValue('red.50', 'gray.700')} borderTopRadius="2xl">
              <HStack justify="space-between">
                <HStack>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={useColorModeValue('red.100', 'red.800')}
                    color={useColorModeValue('red.600', 'red.200')}
                  >
                    <Icon as={FaExclamationTriangle} boxSize={5} />
                  </Box>
                  <Heading size="md" color={textColor} fontWeight="bold">Incomplete Tasks</Heading>
                </HStack>
                <Button 
                  as={RouterLink} 
                  to="/board" 
                  size="sm" 
                  variant="ghost" 
                  rightIcon={<FaArrowRight />}
                  color={useColorModeValue('red.600', 'red.300')}
                  fontWeight="semibold"
                  _hover={{ 
                    color: useColorModeValue('red.700', 'red.200'),
                    bg: useColorModeValue('red.100', 'red.800'),
                    transform: "translateX(3px)"
                  }}
                  transition="all 0.3s ease"
                >
                  View All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {incompleteTasks.map((task, index) => (
                  <Box 
                    key={task.id || task._id} 
                    p={4} 
                    border="1px" 
                    borderColor={task.overdue ? useColorModeValue("red.200", "red.600") : useColorModeValue("gray.100", "gray.600")} 
                    borderRadius="xl"
                    bg={task.overdue ? useColorModeValue("red.50", "red.900") : cardContentBg}
                    position="relative"
                    transform="translateX(0)"
                    transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{ 
                      bg: task.overdue ? useColorModeValue("red.100", "red.800") : useColorModeValue("orange.50", "gray.600"),
                      borderColor: task.overdue ? useColorModeValue("red.300", "red.500") : useColorModeValue("orange.200", "orange.500"),
                      transform: "translateX(5px)",
                      shadow: "md"
                    }}
                    animation={`fadeInScale 0.6s ease-out ${0.6 + index * 0.1}s both`}
                    _before={task.overdue ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      bg: "red.400",
                      borderLeftRadius: "xl"
                    } : {}}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>{task.title}</Text>
                      {task.overdue && (
                        <Badge 
                          colorScheme="red" 
                          size="sm"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontWeight="bold"
                          animation="pulse 2s ease-in-out infinite"
                        >
                          Overdue
                        </Badge>
                      )}
                      <Badge 
                        colorScheme={getPriorityColor(task.priority)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {task.priority}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={mutedTextColor} mb={2} noOfLines={2}>{task.description}</Text>
                    <HStack spacing={3} mb={1}>
                      <Badge colorScheme={task.status === 'COMPLETED' ? 'green' : task.status === 'IN_PROGRESS' ? 'blue' : 'gray'} fontSize="0.85em" px={3} py={1} borderRadius="full" textTransform="capitalize">
                        {task.status?.replace('_', ' ')}
                      </Badge>
                      {task.dueDate && (
                        <HStack color={task.overdue ? useColorModeValue('red.600', 'red.300') : useColorModeValue('orange.500', 'orange.300')} spacing={1}>
                          <Icon as={FaClock} />
                          <Text fontWeight="medium">{new Date(task.dueDate).toLocaleDateString()}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Projects Section - now full width */}
        <Box mt={8}>
          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            transform="translateY(0)"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            _hover={{ 
              transform: "translateY(-5px)",
              shadow: "2xl"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgGradient: "linear(90deg, green.400, teal.400)",
            }}
            animation="fadeInScale 0.8s ease-out 0.6s both"
          >
            <CardHeader bg={useColorModeValue('green.50', 'gray.700')} borderTopRadius="2xl">
              <HStack justify="space-between">
                <HStack>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={useColorModeValue('green.100', 'green.800')}
                    color={useColorModeValue('green.600', 'green.200')}
                  >
                    <Icon as={FaProjectDiagram} boxSize={5} />
                  </Box>
                  <Heading size="md" color={textColor} fontWeight="bold">My Projects</Heading>
                </HStack>
                <Button 
                  as={RouterLink} 
                  to="/projects" 
                  size="sm" 
                  variant="ghost" 
                  rightIcon={<FaArrowRight />}
                  color={useColorModeValue('green.600', 'green.300')}
                  fontWeight="semibold"
                  _hover={{ 
                    color: useColorModeValue('green.700', 'green.200'),
                    bg: useColorModeValue('green.100', 'green.800'),
                    transform: "translateX(3px)"
                  }}
                  transition="all 0.3s ease"
                >
                  View All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={5}>
                {userProjects.map((project, index) => (
                  <Box 
                    key={project.id || project._id} 
                    p={5} 
                    border="1px" 
                    borderColor={useColorModeValue('gray.100', 'gray.600')} 
                    borderRadius="xl"
                    bg={cardContentBg}
                    position="relative"
                    transform="translateX(0)"
                    transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                    _hover={{ 
                      bg: useColorModeValue('green.50', 'gray.600'),
                      borderColor: useColorModeValue('green.200', 'green.500'),
                      transform: "translateX(5px)",
                      shadow: "lg"
                    }}
                    animation={`fadeInScale 0.6s ease-out ${0.7 + index * 0.1}s both`}
                  >
                    <HStack justify="space-between" mb={2}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color={textColor} fontSize="lg">{project.name}</Text>
                        <Text fontSize="sm" color={mutedTextColor} fontWeight="semibold">{project.role}</Text>
                        <Text fontSize="sm" color={mutedTextColor} noOfLines={2}>{project.description}</Text>
                        <HStack spacing={2} mt={1}>
                          <Badge colorScheme={getPriorityColor(project.priority)} fontSize="0.8em" borderRadius="full" px={2} py={1}>{project.priority}</Badge>
                          <Badge colorScheme={getStatusColor(project.status)} fontSize="0.8em" borderRadius="full" px={2} py={1} textTransform="capitalize">{project.status}</Badge>
                        </HStack>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontSize="xs" color={mutedTextColor}>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</Text>
                        <Text fontSize="xs" color={mutedTextColor}>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</Text>
                        <Text fontSize="xs" color={mutedTextColor}>Owner: {project.ownerId}</Text>
                        {Array.isArray(project.tags) && project.tags.length > 0 && (
                          <HStack spacing={1} flexWrap="wrap">
                            {project.tags.map(tag => (
                              <Badge key={tag} colorScheme="teal" fontSize="0.7em" borderRadius="full" px={2}>{tag}</Badge>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.200')} fontWeight="bold">Progress</Text>
                        <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('green.600', 'green.300')}
                        >{project.progress}%</Text>
                      </HStack>
                      <Progress 
                        value={project.progress} 
                        colorScheme="green" 
                        size="lg" 
                        borderRadius="full"
                        bg={useColorModeValue('gray.100', 'gray.600')}
                        sx={{
                          '& > div': {
                            background: `linear-gradient(90deg, ${project.progress > 70 ? '#22C55E' : project.progress > 40 ? '#F59E0B' : '#EF4444'}, ${project.progress > 70 ? '#16A34A' : project.progress > 40 ? '#D97706' : '#DC2626'})`
                          }
                        }}
                      />
                      <HStack justify="space-between" fontSize="sm" color={mutedTextColor}>
                        <HStack>
                          <Icon as={FaUsers} color={useColorModeValue('green.500', 'green.300')} />
                          <Text fontWeight="semibold">{Array.isArray(project.teamMembers) ? project.teamMembers.length : 0} members</Text>
                        </HStack>
                        <Button 
                          as={RouterLink} 
                          to={`/project/${project.id || project._id}`} 
                          size="xs" 
                          variant="solid"
                          colorScheme="green"
                          borderRadius="full"
                          px={4}
                          fontWeight="bold"
                          _hover={{
                            transform: "scale(1.05)"
                          }}
                          transition="all 0.2s ease"
                        >
                          View Details
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    
    {/* CSS Keyframes for animations */}
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-50px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes slideInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes countUp {
        from { 
          opacity: 0; 
          transform: scale(0.5); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes fadeInScale {
        from { 
          opacity: 0; 
          transform: scale(0.9); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
    `}</style>
  </Box>
  );
};

export default Dashboard;
