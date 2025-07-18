import React, { useState } from 'react';
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

const Dashboard = () => {
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

  // Mock data - replace with actual API calls
  const [assignedTasks] = useState([
    { id: 1, title: 'Implement user authentication', project: 'E-commerce Platform', priority: 'High', dueDate: '2024-07-15' },
    { id: 2, title: 'Design dashboard mockups', project: 'UI/UX Redesign', priority: 'Medium', dueDate: '2024-07-18' },
    { id: 3, title: 'Setup CI/CD pipeline', project: 'Mobile App', priority: 'High', dueDate: '2024-07-20' },
  ]);

  const [incompleteTasks] = useState([
    { id: 4, title: 'Fix payment gateway bug', project: 'E-commerce Platform', overdue: true, dueDate: '2024-07-10' },
    { id: 5, title: 'Update API documentation', project: 'Mobile App', overdue: false, dueDate: '2024-07-16' },
    { id: 6, title: 'Performance optimization', project: 'E-commerce Platform', overdue: true, dueDate: '2024-07-12' },
  ]);

  const [projects] = useState([
    { 
      id: 1, 
      name: 'E-commerce Platform', 
      role: 'Project Manager', 
      progress: 85, 
      members: 5,
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      role: 'Developer', 
      progress: 62, 
      members: 6,
      status: 'active'
    },
    { 
      id: 3, 
      name: 'UI/UX Redesign', 
      role: 'Lead Designer', 
      progress: 40, 
      members: 3,
      status: 'planning'
    },
  ]);

  const [notifications] = useState([
    { id: 1, message: 'New task assigned: Implement user authentication', type: 'task', time: '2 hours ago' },
    { id: 2, message: 'Project deadline approaching: E-commerce Platform', type: 'deadline', time: '4 hours ago' },
    { id: 3, message: 'Team meeting scheduled for tomorrow at 10 AM', type: 'meeting', time: '1 day ago' },
  ]);

  const [upcomingDeadlines] = useState([
    { id: 1, title: 'User authentication module', project: 'E-commerce Platform', date: '2024-07-15', priority: 'High' },
    { id: 2, title: 'Design system completion', project: 'UI/UX Redesign', date: '2024-07-18', priority: 'Medium' },
    { id: 3, title: 'Mobile app beta release', project: 'Mobile App', date: '2024-07-25', priority: 'High' },
  ]);

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
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
                      {assignedTasks.length}
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
                      {incompleteTasks.length}
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
                      {projects.filter(p => p.status === 'active').length}
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
              borderColor: "orange.300"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, orange.400, yellow.400)",
            }}
            animation="slideInUp 0.6s ease-out 0.3s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color="gray.600" fontWeight="semibold" fontSize="sm">Upcoming Deadlines</StatLabel>
                    <StatNumber 
                      color="orange.600" 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.8s both"
                    >
                      {upcomingDeadlines.length}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg="orange.50"
                    color="orange.500"
                    animation="pulse 2s ease-in-out infinite 1.5s"
                  >
                    <Icon as={FaCalendarAlt} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color="gray.500" fontWeight="medium">
                  <Icon as={FaCalendarAlt} mr={1} />
                  Next 7 days
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
                    key={task.id} 
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
                    <HStack justify="space-between" mb={3}>
                      <Text fontWeight="bold" fontSize="sm" color={textColor}>{task.title}</Text>
                      <Badge 
                        colorScheme={getPriorityColor(task.priority)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        {task.priority}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" fontSize="xs" color={mutedTextColor}>
                      <Text fontWeight="semibold">{task.project}</Text>
                      <HStack color={useColorModeValue('blue.500', 'blue.300')}>
                        <Icon as={FaClock} />
                        <Text fontWeight="medium">{task.dueDate}</Text>
                      </HStack>
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
                    key={task.id} 
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
                    <HStack justify="space-between" mb={3}>
                      <Text fontWeight="bold" fontSize="sm" color={textColor}>{task.title}</Text>
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
                    </HStack>
                    <HStack justify="space-between" fontSize="xs" color={mutedTextColor}>
                      <Text fontWeight="semibold">{task.project}</Text>
                      <HStack color={task.overdue ? useColorModeValue('red.600', 'red.300') : useColorModeValue('orange.500', 'orange.300')}>
                        <Icon as={FaClock} />
                        <Text fontWeight="medium">{task.dueDate}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Projects & Activities Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Projects */}
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
                {projects.map((project, index) => (
                  <Box 
                    key={project.id} 
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
                    <HStack justify="space-between" mb={4}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color={textColor} fontSize="md">{project.name}</Text>
                        <Text fontSize="sm" color={mutedTextColor} fontWeight="semibold">{project.role}</Text>
                      </VStack>
                      <Badge 
                        colorScheme={getStatusColor(project.status)}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {project.status}
                      </Badge>
                    </HStack>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={useColorModeValue('gray.700', 'gray.200')} fontWeight="bold">Progress</Text>
                        <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('green.600', 'green.300')}>{project.progress}%</Text>
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
                          <Text fontWeight="semibold">{project.members} members</Text>
                        </HStack>
                        <Button 
                          as={RouterLink} 
                          to={`/projects/${project.id}`} 
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

          {/* Notifications & Upcoming Deadlines */}
          <VStack align="stretch" spacing={6}>
            {/* Notifications */}
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
                bgGradient: "linear(90deg, purple.400, pink.400)",
              }}
              animation="fadeInScale 0.8s ease-out 0.7s both"
            >
              <CardHeader bg={useColorModeValue('purple.50', 'gray.700')} borderTopRadius="2xl">
                <HStack>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={useColorModeValue('purple.100', 'purple.800')}
                    color={useColorModeValue('purple.600', 'purple.200')}
                  >
                    <Icon as={FaBell} boxSize={5} />
                  </Box>
                  <Heading size="md" color={textColor} fontWeight="bold">Notifications</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {notifications.map((notification, index) => (
                    <Alert 
                      key={notification.id} 
                      status="info" 
                      variant="left-accent" 
                      borderRadius="xl"
                      bg={useColorModeValue('blue.50', 'gray.700')}
                      borderColor={useColorModeValue('blue.200', 'blue.600')}
                      border="1px"
                      transform="translateX(0)"
                      transition="all 0.3s ease"
                      _hover={{
                        bg: useColorModeValue('blue.100', 'gray.600'),
                        transform: "translateX(5px)",
                        shadow: "md"
                      }}
                      animation={`fadeInScale 0.6s ease-out ${0.8 + index * 0.1}s both`}
                    >
                      <AlertIcon color={useColorModeValue('blue.500', 'blue.300')} />
                      <Box flex="1">
                        <Text fontSize="sm" color={textColor} fontWeight="bold" mb={1}>
                          {notification.message}
                        </Text>
                        <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
                          {notification.time}
                        </Text>
                      </Box>
                    </Alert>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Upcoming Deadlines */}
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
                bgGradient: "linear(90deg, orange.400, yellow.400)",
              }}
              animation="fadeInScale 0.8s ease-out 0.8s both"
            >
              <CardHeader bg={useColorModeValue('orange.50', 'gray.700')} borderTopRadius="2xl">
                <HStack justify="space-between">
                  <HStack>
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg={useColorModeValue('orange.100', 'orange.800')}
                      color={useColorModeValue('orange.600', 'orange.200')}
                    >
                      <Icon as={FaCalendarAlt} boxSize={5} />
                    </Box>
                    <Heading size="md" color={textColor} fontWeight="bold">Upcoming Deadlines</Heading>
                  </HStack>
                  <Button 
                    as={RouterLink} 
                    to="/calendar" 
                    size="sm" 
                    variant="ghost" 
                    rightIcon={<FaArrowRight />}
                    color={useColorModeValue('orange.600', 'orange.300')}
                    fontWeight="semibold"
                    _hover={{ 
                      color: useColorModeValue('orange.700', 'orange.200'),
                      bg: useColorModeValue('orange.100', 'orange.800'),
                      transform: "translateX(3px)"
                    }}
                    transition="all 0.3s ease"
                  >
                    View Calendar
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {upcomingDeadlines.map((deadline, index) => (
                    <Box 
                      key={deadline.id} 
                      p={4} 
                      border="1px" 
                      borderColor={useColorModeValue('gray.100', 'gray.600')} 
                      borderRadius="xl"
                      bg={cardContentBg}
                      position="relative"
                      transform="translateX(0)"
                      transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                      _hover={{ 
                        bg: useColorModeValue('orange.50', 'gray.600'),
                        borderColor: useColorModeValue('orange.200', 'orange.500'),
                        transform: "translateX(5px)",
                        shadow: "md"
                      }}
                      animation={`fadeInScale 0.6s ease-out ${0.9 + index * 0.1}s both`}
                    >
                      <HStack justify="space-between" mb={3}>
                        <Text fontWeight="bold" fontSize="sm" color={textColor}>{deadline.title}</Text>
                        <Badge 
                          colorScheme={getPriorityColor(deadline.priority)} 
                          size="sm"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontWeight="bold"
                        >
                          {deadline.priority}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" fontSize="xs" color={mutedTextColor}>
                        <Text fontWeight="semibold">{deadline.project}</Text>
                        <HStack color={useColorModeValue('orange.500', 'orange.300')}>
                          <Icon as={FaCalendarAlt} />
                          <Text fontWeight="medium">{deadline.date}</Text>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
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
