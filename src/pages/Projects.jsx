import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  SimpleGrid,
  AvatarGroup,
  Avatar,
  Progress,
  Badge,
  useDisclosure,
  Icon,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { AddIcon, CalendarIcon, TimeIcon } from '@chakra-ui/icons';
import { FaUser, FaUsers, FaClock } from 'react-icons/fa';

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
  },
];

const ProjectsPage = () => {
  const { isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'blue';
      case 'Pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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
    <Box px={8} py={6} bg="gray.900" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <Heading size="xl" color="white">
            My Projects
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Manage and track your project progress
          </Text>
        </VStack>
        <Button 
          colorScheme="blue" 
          leftIcon={<AddIcon />} 
          onClick={onOpen}
          size="lg"
          borderRadius="xl"
          px={6}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          Create Project
        </Button>
      </Flex>

      {/* Stats Overview */}
      <SimpleGrid columns={[1, 3]} spacing={6} mb={8}>
        <Box
          p={6}
          bg="gray.800"
          borderRadius="2xl"
          border="1px"
          borderColor="gray.700"
          _hover={{ borderColor: "blue.500", transform: "translateY(-2px)" }}
          transition="all 0.3s"
        >
          <VStack align="start" spacing={2}>
            <Text color="gray.400" fontSize="sm" fontWeight="medium">
              Total Projects
            </Text>
            <Text color="white" fontSize="3xl" fontWeight="bold">
              {mockProjects.length}
            </Text>
          </VStack>
        </Box>
        <Box
          p={6}
          bg="gray.800"
          borderRadius="2xl"
          border="1px"
          borderColor="gray.700"
          _hover={{ borderColor: "green.500", transform: "translateY(-2px)" }}
          transition="all 0.3s"
        >
          <VStack align="start" spacing={2}>
            <Text color="gray.400" fontSize="sm" fontWeight="medium">
              Completed
            </Text>
            <Text color="green.400" fontSize="3xl" fontWeight="bold">
              {mockProjects.filter(p => p.status === 'Completed').length}
            </Text>
          </VStack>
        </Box>
        <Box
          p={6}
          bg="gray.800"
          borderRadius="2xl"
          border="1px"
          borderColor="gray.700"
          _hover={{ borderColor: "orange.500", transform: "translateY(-2px)" }}
          transition="all 0.3s"
        >
          <VStack align="start" spacing={2}>
            <Text color="gray.400" fontSize="sm" fontWeight="medium">
              In Progress
            </Text>
            <Text color="orange.400" fontSize="3xl" fontWeight="bold">
              {mockProjects.filter(p => p.status === 'In Progress').length}
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Grid of Project Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {mockProjects.map((project) => (
          <Box
            key={project.id}
            p={6}
            bg="gray.800"
            borderRadius="2xl"
            border="1px"
            borderColor="gray.700"
            boxShadow="xl"
            _hover={{ 
              boxShadow: '2xl', 
              transform: 'translateY(-4px)',
              borderColor: 'gray.600',
              cursor: 'pointer'
            }}
            transition="all 0.3s ease"
            position="relative"
            overflow="hidden"
            onClick={() => handleProjectClick(project.id)}
          >
            {/* Header */}
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="start" spacing={1} flex="1">
                <Heading size="md" color="white" noOfLines={1}>
                  {project.name}
                </Heading>
                <Text color="gray.400" fontSize="sm" noOfLines={2}>
                  {project.description}
                </Text>
              </VStack>
              <Badge 
                colorScheme={getStatusColor(project.status)}
                borderRadius="full"
                px={3}
                py={1}
                ml={4}
              >
                {project.status}
              </Badge>
            </Flex>

            {/* Owner & Deadline */}
            <VStack spacing={3} mb={4}>
              <Flex justify="space-between" w="full">
                <HStack spacing={2}>
                  <Icon as={FaUser} color="gray.500" boxSize={3} />
                  <Text color="gray.300" fontSize="sm">
                    {project.owner}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaClock} color="gray.500" boxSize={3} />
                  <Text 
                    color={getDaysRemaining(project.deadline) < 7 ? "red.400" : "gray.300"} 
                    fontSize="sm"
                  >
                    {formatDate(project.deadline)}
                  </Text>
                </HStack>
              </Flex>
              
              {getDaysRemaining(project.deadline) >= 0 && (
                <Text 
                  color={getDaysRemaining(project.deadline) < 7 ? "red.400" : "gray.400"} 
                  fontSize="xs"
                  alignSelf="end"
                >
                  {getDaysRemaining(project.deadline)} days remaining
                </Text>
              )}
            </VStack>

            <Divider borderColor="gray.700" mb={4} />

            {/* Progress Section */}
            <Box mb={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Text color="gray.400" fontSize="sm" fontWeight="medium">
                  Progress
                </Text>
                <Text color="white" fontSize="sm" fontWeight="bold">
                  {project.progress}%
                </Text>
              </Flex>
              <Progress 
                colorScheme={getStatusColor(project.status)} 
                value={project.progress} 
                borderRadius="full"
                size="md"
                bg="gray.700"
              />
              <Flex justify="space-between" mt={2}>
                <Text color="gray.500" fontSize="xs">
                  {project.tasksCompleted}/{project.totalTasks} tasks
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {project.totalTasks - project.tasksCompleted} remaining
                </Text>
              </Flex>
            </Box>

            {/* Team Section */}
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon as={FaUsers} color="gray.500" boxSize={3} />
                <Text color="gray.400" fontSize="sm">
                  Team ({project.team.length})
                </Text>
              </HStack>
              <AvatarGroup size="sm" max={3} spacing="-0.5rem">
                {project.team.map((name, index) => (
                  <Avatar 
                    key={index} 
                    name={name} 
                    border="2px solid"
                    borderColor="gray.800"
                  />
                ))}
              </AvatarGroup>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProjectsPage;
