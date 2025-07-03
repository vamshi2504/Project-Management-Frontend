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
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { FaGripVertical, FaUser, FaClock, FaTasks, FaCalendarAlt, FaTag } from 'react-icons/fa';

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'You',
    dueDate: '',
    status: 'To Do',
    tags: [],
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (selectedTags) => {
    setFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleCreateTask = () => {
    // Validate required fields
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create new task
    const newTask = {
      id: Date.now(), // Simple ID generation
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      status: formData.status,
      tags: formData.tags,
    };

    // Add to tasks list
    setTasks(prev => [newTask, ...prev]);

    // Reset form
    setFormData({
      title: '',
      description: '',
      assignedTo: 'You',
      dueDate: '',
      status: 'To Do',
      tags: [],
    });

    // Close modal
    onClose();

    // Show success toast
    toast({
      title: 'Success',
      description: 'Task created successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: 'You',
      dueDate: '',
      status: 'To Do',
      tags: [],
    });
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
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
          onClick={onOpen}
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

      {/* Create Task Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaTasks} color="blue.400" />
              <Text>Create New Task</Text>
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
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaTasks} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    pl={10}
                  />
                </InputGroup>
              </FormControl>

              {/* Task Description */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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

              {/* Assignee and Status Row */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Assigned To
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      pl={10}
                    >
                      <option value="You" style={{ backgroundColor: '#2D3748' }}>You</option>
                      <option value="Alice Johnson" style={{ backgroundColor: '#2D3748' }}>Alice Johnson</option>
                      <option value="Bob Smith" style={{ backgroundColor: '#2D3748' }}>Bob Smith</option>
                      <option value="Charlie Davis" style={{ backgroundColor: '#2D3748' }}>Charlie Davis</option>
                      <option value="David Wilson" style={{ backgroundColor: '#2D3748' }}>David Wilson</option>
                      <option value="Emma Brown" style={{ backgroundColor: '#2D3748' }}>Emma Brown</option>
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Initial Status
                  </FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
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
              </SimpleGrid>

              {/* Due Date */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Due Date
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    bg="gray.700"
                    border="1px"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    pl={10}
                  />
                </InputGroup>
              </FormControl>

              {/* Tags */}
              <FormControl>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Tags
                </FormLabel>
                <Box
                  bg="gray.700"
                  border="1px"
                  borderColor="gray.600"
                  borderRadius="md"
                  p={4}
                  _hover={{ borderColor: "gray.500" }}
                >
                  <CheckboxGroup 
                    colorScheme="blue" 
                    value={formData.tags} 
                    onChange={handleTagChange}
                  >
                    <SimpleGrid columns={2} spacing={3}>
                      <Checkbox value="Frontend" color="white">Frontend</Checkbox>
                      <Checkbox value="Backend" color="white">Backend</Checkbox>
                      <Checkbox value="UI/UX" color="white">UI/UX</Checkbox>
                      <Checkbox value="API" color="white">API</Checkbox>
                      <Checkbox value="Bug Fix" color="white">Bug Fix</Checkbox>
                      <Checkbox value="Database" color="white">Database</Checkbox>
                      <Checkbox value="Analytics" color="white">Analytics</Checkbox>
                      <Checkbox value="Testing" color="white">Testing</Checkbox>
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={handleModalClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateTask}
              leftIcon={<AddIcon />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Create Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TasksPage;
