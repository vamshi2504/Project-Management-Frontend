import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { FaGripVertical, FaUser, FaClock } from 'react-icons/fa';

const mockTasks = [
  {
    id: 1,
    title: 'Create Login Page',
    description: 'Design and develop login screen UI with modern authentication flow',
    status: 'To Do',
    assignedTo: 'Alice Johnson',
    dueDate: '2025-07-10',
    tags: ['Frontend', 'UI/UX'],
  },
  {
    id: 2,
    title: 'Implement Task API',
    description: 'Create RESTful routes for task endpoints with proper validation',
    status: 'In Progress',
    assignedTo: 'Bob Smith',
    dueDate: '2025-07-08',
    tags: ['Backend', 'API'],
  },
  {
    id: 3,
    title: 'Fix task list bug',
    description: 'Resolve issue with task filter not updating correctly',
    status: 'Done',
    assignedTo: 'Charlie Davis',
    dueDate: '2025-07-05',
    tags: ['Bug Fix', 'Frontend'],
  },
  {
    id: 4,
    title: 'Database Schema Design',
    description: 'Design and implement the database schema for the project',
    status: 'To Do',
    assignedTo: 'David Wilson',
    dueDate: '2025-07-12',
    tags: ['Database', 'Backend'],
  },
  {
    id: 5,
    title: 'User Dashboard',
    description: 'Create comprehensive user dashboard with analytics',
    status: 'In Progress',
    assignedTo: 'Emma Brown',
    dueDate: '2025-07-15',
    tags: ['Frontend', 'Analytics'],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do':
      return 'gray';
    case 'In Progress':
      return 'blue';
    case 'Done':
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
  };
  return colors[tag] || 'gray';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const navigate = useNavigate();

  const handleTaskClick = (taskId, e) => {
    // Prevent navigation if user is dragging
    if (!draggedTask) {
      navigate(`/tasks/${taskId}`);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tasksByStatus = {
    'To Do': filteredTasks.filter(task => task.status === 'To Do'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    'Done': filteredTasks.filter(task => task.status === 'Done'),
  };

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
      onClick={(e) => handleTaskClick(task.id, e)}
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
      minH="600px"
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
  return (
    <Box px={8} py={6} bg="gray.900" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <Heading size="xl" color="white">
            Task Board
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Drag and drop tasks to update their status
          </Text>
        </VStack>
        <Button 
          colorScheme="blue" 
          leftIcon={<AddIcon />}
          size="lg"
          borderRadius="xl"
          px={6}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          Create Task
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={8} maxW="400px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input 
            placeholder="Search tasks..." 
            variant="filled"
            bg="gray.800"
            border="1px"
            borderColor="gray.700"
            _hover={{ borderColor: "gray.600" }}
            _focus={{ borderColor: "blue.500", bg: "gray.800" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      {/* Kanban Board */}
      <Flex gap={6} align="start">
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
  );
};

export default TasksPage;
