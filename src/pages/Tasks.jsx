import React, { useState, useMemo } from 'react';
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
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import { FaGripVertical, FaUser, FaClock, FaTasks, FaCalendarAlt, FaTag, FaProjectDiagram, FaCode, FaSave, FaTimes } from 'react-icons/fa';

// Mock data with hierarchical structure: Projects -> Features -> Tasks
const mockProjects = [
  {
    id: 1,
    name: 'Task Manager',
    description: 'A comprehensive task management system with real-time collaboration',
    features: [
      {
        id: 1,
        name: 'User Authentication',
        description: 'Login, signup, and user management system',
        status: 'In Progress',
        progress: 75,
        tasksCompleted: 3,
        totalTasks: 4,
        tasks: [
          {
            id: 1,
            title: 'Create Login Page',
            description: 'Design and develop login screen UI with modern authentication flow',
            status: 'To Do',
            assignedTo: 'You',
            dueDate: '2025-07-10',
            tags: ['Frontend', 'UI/UX'],
            projectId: 1,
            featureId: 1,
          },
          {
            id: 2,
            title: 'Implement JWT Authentication',
            description: 'Set up JWT token-based authentication system',
            status: 'In Progress',
            assignedTo: 'Bob Smith',
            dueDate: '2025-07-08',
            tags: ['Backend', 'Security'],
            projectId: 1,
            featureId: 1,
          },
          {
            id: 3,
            title: 'Password Reset Flow',
            description: 'Implement forgot password and reset functionality',
            status: 'Done',
            assignedTo: 'You',
            dueDate: '2025-07-05',
            tags: ['Backend', 'Security'],
            projectId: 1,
            featureId: 1,
          },
          {
            id: 4,
            title: 'User Profile Management',
            description: 'Create user profile editing and management interface',
            status: 'To Do',
            assignedTo: 'Charlie Davis',
            dueDate: '2025-07-12',
            tags: ['Frontend', 'UI/UX'],
            projectId: 1,
            featureId: 1,
          },
        ]
      },
      {
        id: 2,
        name: 'Task Management',
        description: 'Core task creation, editing, and tracking functionality',
        status: 'In Progress',
        progress: 50,
        tasksCompleted: 5,
        totalTasks: 10,
        tasks: [
          {
            id: 5,
            title: 'Task CRUD Operations',
            description: 'Create, read, update, delete operations for tasks',
            status: 'In Progress',
            assignedTo: 'You',
            dueDate: '2025-07-12',
            tags: ['Backend', 'API'],
            projectId: 1,
            featureId: 2,
          },
          {
            id: 6,
            title: 'Kanban Board UI',
            description: 'Build drag-and-drop kanban board interface',
            status: 'To Do',
            assignedTo: 'You',
            dueDate: '2025-07-15',
            tags: ['Frontend', 'UI/UX'],
            projectId: 1,
            featureId: 2,
          },
          {
            id: 7,
            title: 'Task Assignment System',
            description: 'Implement task assignment and notification system',
            status: 'Done',
            assignedTo: 'Emma Brown',
            dueDate: '2025-07-08',
            tags: ['Backend', 'API'],
            projectId: 1,
            featureId: 2,
          },
          {
            id: 8,
            title: 'Task Filtering and Search',
            description: 'Add advanced filtering and search capabilities',
            status: 'In Progress',
            assignedTo: 'David Wilson',
            dueDate: '2025-07-18',
            tags: ['Frontend', 'Search'],
            projectId: 1,
            featureId: 2,
          },
        ]
      },
      {
        id: 3,
        name: 'Real-time Collaboration',
        description: 'Live updates and team collaboration features',
        status: 'Pending',
        progress: 20,
        tasksCompleted: 2,
        totalTasks: 6,
        tasks: [
          {
            id: 9,
            title: 'WebSocket Implementation',
            description: 'Set up real-time communication using WebSockets',
            status: 'To Do',
            assignedTo: 'You',
            dueDate: '2025-07-20',
            tags: ['Backend', 'Real-time'],
            projectId: 1,
            featureId: 3,
          },
          {
            id: 10,
            title: 'Live Comments System',
            description: 'Implement real-time commenting on tasks',
            status: 'In Progress',
            assignedTo: 'Frank Miller',
            dueDate: '2025-07-22',
            tags: ['Frontend', 'Real-time'],
            projectId: 1,
            featureId: 3,
          },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with advanced analytics',
    features: [
      {
        id: 4,
        name: 'Product Catalog',
        description: 'Product listing, search, and filtering system',
        status: 'Completed',
        progress: 100,
        tasksCompleted: 4,
        totalTasks: 4,
        tasks: [
          {
            id: 11,
            title: 'Product Search API',
            description: 'Implement advanced product search functionality',
            status: 'Done',
            assignedTo: 'Grace Lee',
            dueDate: '2025-07-03',
            tags: ['Backend', 'Search'],
            projectId: 2,
            featureId: 4,
          },
          {
            id: 12,
            title: 'Filter Component',
            description: 'Build product filter and sort UI components',
            status: 'Done',
            assignedTo: 'Henry Taylor',
            dueDate: '2025-07-04',
            tags: ['Frontend', 'UI/UX'],
            projectId: 2,
            featureId: 4,
          },
          {
            id: 13,
            title: 'Product Image Gallery',
            description: 'Create responsive product image gallery component',
            status: 'Done',
            assignedTo: 'Ivan Chen',
            dueDate: '2025-07-06',
            tags: ['Frontend', 'UI/UX'],
            projectId: 2,
            featureId: 4,
          },
          {
            id: 14,
            title: 'Product Review System',
            description: 'Implement product rating and review functionality',
            status: 'Done',
            assignedTo: 'Julia Kim',
            dueDate: '2025-07-07',
            tags: ['Frontend', 'Backend'],
            projectId: 2,
            featureId: 4,
          },
        ]
      },
      {
        id: 5,
        name: 'Payment System',
        description: 'Secure payment processing and order management',
        status: 'In Progress',
        progress: 80,
        tasksCompleted: 4,
        totalTasks: 6,
        tasks: [
          {
            id: 15,
            title: 'Stripe Integration',
            description: 'Integrate Stripe payment gateway',
            status: 'Done',
            assignedTo: 'Ivan Chen',
            dueDate: '2025-07-18',
            tags: ['Backend', 'Payment'],
            projectId: 2,
            featureId: 5,
          },
          {
            id: 16,
            title: 'Order Management Dashboard',
            description: 'Create admin dashboard for order management',
            status: 'In Progress',
            assignedTo: 'You',
            dueDate: '2025-07-25',
            tags: ['Frontend', 'UI/UX'],
            projectId: 2,
            featureId: 5,
          },
          {
            id: 17,
            title: 'Payment Security Audit',
            description: 'Conduct security audit of payment processing',
            status: 'To Do',
            assignedTo: 'Kevin Martinez',
            dueDate: '2025-07-30',
            tags: ['Security', 'Testing'],
            projectId: 2,
            featureId: 5,
          },
        ]
      },
      {
        id: 6,
        name: 'Analytics Dashboard',
        description: 'Sales analytics and reporting features',
        status: 'In Progress',
        progress: 60,
        tasksCompleted: 3,
        totalTasks: 5,
        tasks: [
          {
            id: 18,
            title: 'Sales Analytics API',
            description: 'Create API endpoints for sales data analytics',
            status: 'Done',
            assignedTo: 'You',
            dueDate: '2025-07-25',
            tags: ['Backend', 'Analytics'],
            projectId: 2,
            featureId: 6,
          },
          {
            id: 19,
            title: 'Dashboard Charts Integration',
            description: 'Integrate Chart.js for analytics visualization',
            status: 'In Progress',
            assignedTo: 'Lisa Rodriguez',
            dueDate: '2025-08-01',
            tags: ['Frontend', 'Analytics'],
            projectId: 2,
            featureId: 6,
          },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Project Tracker UI',
    description: 'Intuitive project tracking interface',
    features: [
      {
        id: 7,
        name: 'Dashboard Interface',
        description: 'Main dashboard with project overview and statistics',
        status: 'In Progress',
        progress: 60,
        tasksCompleted: 3,
        totalTasks: 5,
        tasks: [
          {
            id: 20,
            title: 'Statistics Cards',
            description: 'Create project statistics overview cards',
            status: 'To Do',
            assignedTo: 'You',
            dueDate: '2025-07-25',
            tags: ['Frontend', 'Analytics'],
            projectId: 3,
            featureId: 7,
          },
          {
            id: 21,
            title: 'Progress Visualization',
            description: 'Add progress bars and charts to dashboard',
            status: 'In Progress',
            assignedTo: 'Michael Chen',
            dueDate: '2025-07-28',
            tags: ['Frontend', 'UI/UX'],
            projectId: 3,
            featureId: 7,
          },
        ]
      },
      {
        id: 8,
        name: 'Project Management',
        description: 'Project creation, editing, and management tools',
        status: 'In Progress',
        progress: 40,
        tasksCompleted: 3,
        totalTasks: 8,
        tasks: [
          {
            id: 22,
            title: 'Project Creation Form',
            description: 'Build comprehensive project creation interface',
            status: 'In Progress',
            assignedTo: 'You',
            dueDate: '2025-07-30',
            tags: ['Frontend', 'UI/UX'],
            projectId: 3,
            featureId: 8,
          },
          {
            id: 23,
            title: 'Team Member Management',
            description: 'Add and remove team members from projects',
            status: 'Done',
            assignedTo: 'Nancy Wilson',
            dueDate: '2025-07-20',
            tags: ['Frontend', 'Backend'],
            projectId: 3,
            featureId: 8,
          },
        ]
      },
      {
        id: 9,
        name: 'Reporting System',
        description: 'Comprehensive reporting and export functionality',
        status: 'Pending',
        progress: 25,
        tasksCompleted: 2,
        totalTasks: 7,
        tasks: [
          {
            id: 24,
            title: 'Report Generator',
            description: 'Create automated report generation system',
            status: 'To Do',
            assignedTo: 'You',
            dueDate: '2025-08-05',
            tags: ['Backend', 'Analytics'],
            projectId: 3,
            featureId: 9,
          },
          {
            id: 25,
            title: 'Export to PDF/Excel',
            description: 'Add export functionality for reports',
            status: 'In Progress',
            assignedTo: 'Oscar Garcia',
            dueDate: '2025-08-10',
            tags: ['Backend', 'Export'],
            projectId: 3,
            featureId: 9,
          },
        ]
      }
    ]
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
    case 'Completed':
      return 'green';
    case 'Pending':
      return 'yellow';
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
    day: 'numeric'
  });
};

const TasksPage = () => {
  const [projects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState('');
  const [viewType, setViewType] = useState('features'); // 'features' or 'tasks'
  const [selectedFeature, setSelectedFeature] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'You',
    dueDate: '',
    status: 'To Do',
    tags: [],
    projectId: '',
    featureId: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = 'You'; // This would come from authentication context

  // State for task details modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    status: '',
    tags: [],
    projectId: '',
    featureId: '',
  });

  // Extract all unique assignees from mock data
  const allAssignees = useMemo(() => {
    const assignees = new Set();
    projects.forEach(project => {
      project.features.forEach(feature => {
        feature.tasks.forEach(task => {
          assignees.add(task.assignedTo);
        });
      });
    });
    return Array.from(assignees).sort();
  }, [projects]);

  // Extract all unique tags from mock data
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach(project => {
      project.features.forEach(feature => {
        feature.tasks.forEach(task => {
          task.tags.forEach(tag => tags.add(tag));
        });
      });
    });
    return Array.from(tags).sort();
  }, [projects]);

  // Extract all unique status values from mock data (for both tasks and features)
  const allStatuses = useMemo(() => {
    const statuses = new Set();
    projects.forEach(project => {
      project.features.forEach(feature => {
        statuses.add(feature.status);
        feature.tasks.forEach(task => {
          statuses.add(task.status);
        });
      });
    });
    return Array.from(statuses).sort();
  }, [projects]);

  // Get all tasks from all projects/features or filter by selection
  const allTasks = useMemo(() => {
    let tasks = [];
    
    projects.forEach(project => {
      project.features.forEach(feature => {
        feature.tasks.forEach(task => {
          tasks.push({
            ...task,
            projectName: project.name,
            featureName: feature.name,
          });
        });
      });
    });
    
    // Filter by selected project
    if (selectedProject) {
      tasks = tasks.filter(task => task.projectId === parseInt(selectedProject));
    }
    
    // Filter by selected feature if viewing tasks
    if (viewType === 'tasks' && selectedFeature) {
      tasks = tasks.filter(task => task.featureId === parseInt(selectedFeature));
    }
    
    return tasks;
  }, [projects, selectedProject, selectedFeature, viewType]);

  // Get available features for selected project
  const availableFeatures = useMemo(() => {
    if (!selectedProject) return [];
    const project = projects.find(p => p.id === parseInt(selectedProject));
    return project ? project.features : [];
  }, [projects, selectedProject]);

  // Get features allocated to current user
  const userFeatures = useMemo(() => {
    let features = [];
    
    projects.forEach(project => {
      project.features.forEach(feature => {
        // Check if any task in this feature is assigned to current user
        const hasUserTasks = feature.tasks.some(task => task.assignedTo === currentUser);
        if (hasUserTasks) {
          features.push({
            ...feature,
            projectName: project.name,
            projectId: project.id,
          });
        }
      });
    });
    
    // Filter by selected project if one is selected
    if (selectedProject) {
      features = features.filter(feature => feature.projectId === parseInt(selectedProject));
    }
    
    return features;
  }, [projects, selectedProject, currentUser]);

  // Get tasks allocated to current user
  const userTasks = useMemo(() => {
    return allTasks.filter(task => task.assignedTo === currentUser);
  }, [allTasks, currentUser]);

  // Group filtered tasks by status for kanban view
  const tasksByStatus = useMemo(() => {
    const tasksToDisplay = viewType === 'features' ? [] : userTasks;
    
    return {
      'To Do': tasksToDisplay.filter(task => task.status === 'To Do'),
      'In Progress': tasksToDisplay.filter(task => task.status === 'In Progress'),
      'Done': tasksToDisplay.filter(task => task.status === 'Done'),
    };
  }, [userTasks, viewType]);

  // Group filtered features by status for kanban view
  const featuresByStatus = useMemo(() => {
    const featuresToDisplay = viewType === 'features' ? userFeatures : [];
    
    return {
      'To Do': featuresToDisplay.filter(feature => feature.status === 'To Do'),
      'In Progress': featuresToDisplay.filter(feature => feature.status === 'In Progress'),
      'Done': featuresToDisplay.filter(feature => feature.status === 'Done' || feature.status === 'Completed'),
      'Pending': featuresToDisplay.filter(feature => feature.status === 'Pending'),
    };
  }, [userFeatures, viewType]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (viewType === 'features') {
      const total = userFeatures.length;
      const completed = userFeatures.filter(feature => feature.status === 'Done' || feature.status === 'Completed').length;
      const inProgress = userFeatures.filter(feature => feature.status === 'In Progress').length;
      const todo = userFeatures.filter(feature => feature.status === 'To Do').length;
      const pending = userFeatures.filter(feature => feature.status === 'Pending').length;
      
      return {
        total,
        completed,
        inProgress,
        todo,
        pending,
      };
    } else {
      const total = userTasks.length;
      const completed = userTasks.filter(task => task.status === 'Done').length;
      const inProgress = userTasks.filter(task => task.status === 'In Progress').length;
      const todo = userTasks.filter(task => task.status === 'To Do').length;
      
      return {
        total,
        completed,
        inProgress,
        todo,
      };
    }
  }, [userTasks, userFeatures, viewType]);

  const handleTaskClick = (task, e) => {
    // Prevent navigation if user is dragging
    if (!draggedTask) {
      setSelectedTask(task);
      setIsEditing(false);
      onDetailsOpen();
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    setSelectedFeature(''); // Reset feature selection when project changes
  };

  const handleViewTypeChange = (e) => {
    const newViewType = e.target.value;
    setViewType(newViewType);
    setSelectedFeature(''); // Reset feature selection when view type changes
  };

  const handleFeatureChange = (e) => {
    setSelectedFeature(e.target.value);
  };

  const clearFilters = () => {
    setSelectedProject('');
    setSelectedFeature('');
    setViewType('features');
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
      // In a real app, this would update the task in the backend
      // For now, we'll show a toast message
      toast({
        title: "Task Updated",
        description: `"${draggedTask.title}" moved to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.projectId || !formData.featureId) {
      toast({
        title: "Error",
        description: "Please select a project and feature",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real app, this would be sent to the backend
    toast({
      title: "Task Created",
      description: `"${formData.title}" has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: 'You',
      dueDate: '',
      status: 'To Do',
      tags: [],
      projectId: '',
      featureId: '',
    });
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const handleDetailsClose = () => {
    setSelectedTask(null);
    setIsEditing(false);
    setEditFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: '',
      tags: [],
      projectId: '',
      featureId: '',
    });
    onDetailsClose();
  };

  const handleEditClick = () => {
    if (selectedTask) {
      setEditFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        assignedTo: selectedTask.assignedTo,
        dueDate: selectedTask.dueDate,
        status: selectedTask.status,
        tags: selectedTask.tags,
        projectId: selectedTask.projectId.toString(),
        featureId: selectedTask.featureId.toString(),
      });
      setIsEditing(true);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditTagChange = (selectedTags) => {
    setEditFormData(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const handleSaveEdit = () => {
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real app, this would update the task in the backend
    toast({
      title: "Task Updated",
      description: `"${editFormData.title}" has been updated successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setIsEditing(false);
    handleDetailsClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: '',
      tags: [],
      projectId: '',
      featureId: '',
    });
  };

  const FeatureCard = ({ feature }) => {
    const handleFeatureClick = (e) => {
      navigate(`/features/${feature.id}`);
    };

    return (
      <Box
        bg="gray.800"
        borderRadius="xl"
        p={6}
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
        mb={4}
        cursor="pointer"
        onClick={handleFeatureClick}
      >
      {/* Project Info */}
      <Flex align="center" justify="space-between" mb={3}>
        <HStack spacing={2}>
          <Icon as={FaProjectDiagram} color="blue.400" boxSize={3} />
          <Text color="blue.400" fontSize="xs" fontWeight="medium">
            {feature.projectName}
          </Text>
        </HStack>
        <HStack spacing={2}>
          <Badge 
            colorScheme={getStatusColor(feature.status)}
            variant="subtle"
            borderRadius="full"
            fontSize="xs"
            px={3}
          >
            {feature.status}
          </Badge>
        </HStack>
      </Flex>

      {/* Feature Name */}
      <Heading size="md" color="white" mb={2} noOfLines={1}>
        {feature.name}
      </Heading>

      {/* Description */}
      <Text color="gray.400" fontSize="sm" mb={4} noOfLines={2}>
        {feature.description}
      </Text>

      <Divider borderColor="gray.700" mb={4} />

      {/* Progress and Stats */}
      <Box mb={4}>
        <Flex justify="space-between" align="center" mb={2}>
          <Text color="gray.400" fontSize="sm" fontWeight="medium">
            Progress
          </Text>
          <Text color="white" fontSize="sm" fontWeight="bold">
            {feature.progress}%
          </Text>
        </Flex>
        <Progress 
          colorScheme={getStatusColor(feature.status)} 
          value={feature.progress} 
          borderRadius="full"
          size="md"
          bg="gray.700"
        />
        <Flex justify="space-between" mt={2}>
          <Text color="gray.500" fontSize="xs">
            {feature.tasksCompleted}/{feature.totalTasks} tasks
          </Text>
          <Text color="gray.500" fontSize="xs">
            {feature.totalTasks - feature.tasksCompleted} remaining
          </Text>
        </Flex>
      </Box>

      {/* User Tasks Count */}
      <HStack spacing={2}>
        <Icon as={FaTasks} color="purple.400" boxSize={3} />
        <Text color="purple.400" fontSize="sm" fontWeight="medium">
          {feature.tasks.filter(task => task.assignedTo === currentUser).length} tasks assigned to you
        </Text>
      </HStack>
    </Box>
    );
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
      onClick={(e) => handleTaskClick(task, e)}
      mb={4}
    >
      {/* Project and Feature Info */}
      <Flex align="center" justify="space-between" mb={3}>
        <HStack spacing={2}>
          <Icon as={FaProjectDiagram} color="blue.400" boxSize={3} />
          <Text color="blue.400" fontSize="xs" fontWeight="medium">
            {task.projectName}
          </Text>
          <Text color="gray.500" fontSize="xs">•</Text>
          <Icon as={FaCode} color="purple.400" boxSize={3} />
          <Text color="purple.400" fontSize="xs" fontWeight="medium">
            {task.featureName}
          </Text>
        </HStack>
        <Icon as={FaGripVertical} color="gray.500" boxSize={3} />
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

  const FeatureStatusColumn = ({ status, features, count }) => (
    <Box
      bg="gray.900"
      borderRadius="2xl"
      p={6}
      border="1px"
      borderColor="gray.700"
      flex="1"
      minH="600px"
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

      {/* Features */}
      <VStack spacing={0} align="stretch">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
        
        {features.length === 0 && (
          <Box
            border="2px dashed"
            borderColor="gray.700"
            borderRadius="xl"
            p={8}
            textAlign="center"
          >
            <Text color="gray.500" fontSize="sm">
              No features in this status
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
            {viewType === 'features' ? 'My Features' : 'My Tasks'}
          </Heading>
          <Text color="gray.400" fontSize="lg">
            {viewType === 'features' 
              ? 'Manage your assigned features with drag-and-drop'
              : 'Manage your assigned tasks with drag-and-drop'
            }
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

      {/* Statistics */}
      <SimpleGrid columns={viewType === 'features' ? 4 : 3} spacing={6} mb={8}>
        <Stat
          bg="gray.800"
          p={4}
          borderRadius="xl"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">
            {viewType === 'features' ? 'Total Features' : 'Total Tasks'}
          </StatLabel>
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
        {viewType === 'features' && (
          <Stat
            bg="gray.800"
            p={4}
            borderRadius="xl"
            border="1px"
            borderColor="gray.700"
          >
            <StatLabel color="gray.400">Pending</StatLabel>
            <StatNumber color="yellow.400">{stats.pending}</StatNumber>
          </Stat>
        )}
      </SimpleGrid>

      {/* Filters */}
      <Box
        bg="gray.800"
        p={6}
        borderRadius="xl"
        border="1px"
        borderColor="gray.700"
        mb={8}
      >
        <Heading size="md" color="white" mb={4}>
          Filters
        </Heading>
        <Flex gap={4} wrap="wrap" align="end">
          {/* Project Filter */}
          <FormControl maxW="250px">
            <FormLabel color="gray.300" fontSize="sm">
              Project
            </FormLabel>
            <Select
              placeholder="All Projects"
              value={selectedProject}
              onChange={handleProjectChange}
              bg="gray.700"
              border="1px"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "blue.500" }}
            >
              {projects.map(project => (
                <option key={project.id} value={project.id} style={{ backgroundColor: '#2D3748' }}>
                  {project.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* View Type Filter */}
          <FormControl maxW="200px">
            <FormLabel color="gray.300" fontSize="sm">
              View
            </FormLabel>
            <Select
              value={viewType}
              onChange={handleViewTypeChange}
              bg="gray.700"
              border="1px"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "blue.500" }}
            >
              <option value="features" style={{ backgroundColor: '#2D3748' }}>
                Features
              </option>
              <option value="tasks" style={{ backgroundColor: '#2D3748' }}>
                Tasks
              </option>
            </Select>
          </FormControl>

          {/* Feature Filter - Only visible when viewing tasks */}
          {viewType === 'tasks' && (
            <FormControl maxW="250px">
              <FormLabel color="gray.300" fontSize="sm">
                Feature
              </FormLabel>
              <Select
                placeholder="All Features"
                value={selectedFeature}
                onChange={handleFeatureChange}
                bg="gray.700"
                border="1px"
                borderColor="gray.600"
                color="white"
                _hover={{ borderColor: "gray.500" }}
                _focus={{ borderColor: "blue.500" }}
                isDisabled={!selectedProject}
              >
                {availableFeatures.map(feature => (
                  <option key={feature.id} value={feature.id} style={{ backgroundColor: '#2D3748' }}>
                    {feature.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Clear Filters */}
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={clearFilters}
            _hover={{ bg: "gray.700" }}
          >
            Clear Filters
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      {viewType === 'features' ? (
        <Box>
          <Heading size="lg" color="white" mb={6}>
            Feature Board
          </Heading>
          {/* Feature Kanban Board */}
          <Flex gap={6} align="start">
            <FeatureStatusColumn 
              status="To Do" 
              features={featuresByStatus['To Do']} 
              count={featuresByStatus['To Do'].length}
            />
            <FeatureStatusColumn 
              status="In Progress" 
              features={featuresByStatus['In Progress']} 
              count={featuresByStatus['In Progress'].length}
            />
            <FeatureStatusColumn 
              status="Done" 
              features={featuresByStatus['Done']} 
              count={featuresByStatus['Done'].length}
            />
            <FeatureStatusColumn 
              status="Pending" 
              features={featuresByStatus['Pending']} 
              count={featuresByStatus['Pending'].length}
            />
          </Flex>
        </Box>
      ) : (
        <Box>
          <Heading size="lg" color="white" mb={6}>
            Task Board
          </Heading>
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
      )}

      {/* Task Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={handleDetailsClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3} justify="space-between">
              <HStack spacing={3}>
                <Icon as={FaTasks} color="blue.400" />
                <Text>{isEditing ? 'Edit Task' : 'Task Details'}</Text>
              </HStack>
              {selectedTask && selectedTask.assignedTo === currentUser && !isEditing && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<EditIcon />}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            {selectedTask && (
              <VStack spacing={6} align="stretch">
                {/* Project and Feature Info */}
                <Box
                  bg="gray.700"
                  p={4}
                  borderRadius="lg"
                  border="1px"
                  borderColor="gray.600"
                >
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text color="gray.400" fontSize="sm" mb={1}>Project</Text>
                      <HStack>
                        <Icon as={FaProjectDiagram} color="blue.400" />
                        <Text color="white" fontWeight="medium">{selectedTask.projectName}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text color="gray.400" fontSize="sm" mb={1}>Feature</Text>
                      <HStack>
                        <Icon as={FaCode} color="purple.400" />
                        <Text color="white" fontWeight="medium">{selectedTask.featureName}</Text>
                      </HStack>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Task Title */}
                <Box>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                    Task Title
                  </FormLabel>
                  {isEditing ? (
                    <Input
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                    />
                  ) : (
                    <Text color="white" fontSize="lg" fontWeight="semibold">
                      {selectedTask.title}
                    </Text>
                  )}
                </Box>

                {/* Description */}
                <Box>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                    Description
                  </FormLabel>
                  {isEditing ? (
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
                  ) : (
                    <Text color="gray.300" lineHeight="1.6">
                      {selectedTask.description}
                    </Text>
                  )}
                </Box>

                {/* Status and Assigned To */}
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                      Status
                    </FormLabel>
                    {isEditing ? (
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
                        {allStatuses.map(status => (
                          <option key={status} value={status} style={{ backgroundColor: '#2D3748' }}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Badge
                        colorScheme={getStatusColor(selectedTask.status)}
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="sm"
                      >
                        {selectedTask.status}
                      </Badge>
                    )}
                  </Box>
                  <Box>
                    <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                      Assigned To
                    </FormLabel>
                    {isEditing ? (
                      <Select
                        name="assignedTo"
                        value={editFormData.assignedTo}
                        onChange={handleEditInputChange}
                        bg="gray.700"
                        border="1px"
                        borderColor="gray.600"
                        color="white"
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      >
                        {allAssignees.map(assignee => (
                          <option key={assignee} value={assignee} style={{ backgroundColor: '#2D3748' }}>
                            {assignee}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <HStack>
                        <Avatar name={selectedTask.assignedTo} size="sm" />
                        <Text color="white" fontWeight="medium">{selectedTask.assignedTo}</Text>
                        {selectedTask.assignedTo === currentUser && (
                          <Badge colorScheme="blue" variant="solid" fontSize="xs">
                            You
                          </Badge>
                        )}
                      </HStack>
                    )}
                  </Box>
                </SimpleGrid>

                {/* Due Date */}
                <Box>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                    Due Date
                  </FormLabel>
                  {isEditing ? (
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
                  ) : (
                    <HStack>
                      <Icon as={FaCalendarAlt} color="blue.400" />
                      <Text color="white">{formatDate(selectedTask.dueDate)}</Text>
                    </HStack>
                  )}
                </Box>

                {/* Tags */}
                <Box>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium" mb={2}>
                    Tags
                  </FormLabel>
                  {isEditing ? (
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
                        value={editFormData.tags} 
                        onChange={handleEditTagChange}
                      >
                        <SimpleGrid columns={2} spacing={3}>
                          {allTags.map(tag => (
                            <Checkbox key={tag} value={tag} color="white">
                              {tag}
                            </Checkbox>
                          ))}
                        </SimpleGrid>
                      </CheckboxGroup>
                    </Box>
                  ) : (
                    <Flex wrap="wrap" gap={2}>
                      {selectedTask.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          colorScheme={getTagColor(tag)}
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {isEditing ? (
              <HStack spacing={3}>
                <Button 
                  variant="ghost" 
                  onClick={handleCancelEdit}
                  color="gray.400"
                  _hover={{ color: "white", bg: "gray.700" }}
                  leftIcon={<Icon as={FaTimes} />}
                >
                  Cancel
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleSaveEdit}
                  leftIcon={<Icon as={FaSave} />}
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Save Changes
                </Button>
              </HStack>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleDetailsClose}
                color="gray.400"
                _hover={{ color: "white", bg: "gray.700" }}
              >
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

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
              {/* Project and Feature Selection */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Project
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaProjectDiagram} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleInputChange}
                      placeholder="Select Project"
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      pl={10}
                    >
                      {projects.map(project => (
                        <option key={project.id} value={project.id} style={{ backgroundColor: '#2D3748' }}>
                          {project.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Feature
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaCode} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="featureId"
                      value={formData.featureId}
                      onChange={handleInputChange}
                      placeholder="Select Feature"
                      bg="gray.700"
                      border="1px"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      pl={10}
                      isDisabled={!formData.projectId}
                    >
                      {formData.projectId && projects
                        .find(p => p.id === parseInt(formData.projectId))?.features
                        .map(feature => (
                          <option key={feature.id} value={feature.id} style={{ backgroundColor: '#2D3748' }}>
                            {feature.name}
                          </option>
                        ))}
                    </Select>
                  </InputGroup>
                </FormControl>
              </SimpleGrid>

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
                      {allAssignees.map(assignee => (
                        <option key={assignee} value={assignee} style={{ backgroundColor: '#2D3748' }}>
                          {assignee}
                        </option>
                      ))}
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
                    {allStatuses.map(status => (
                      <option key={status} value={status} style={{ backgroundColor: '#2D3748' }}>
                        {status}
                      </option>
                    ))}
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
                      {allTags.map(tag => (
                        <Checkbox key={tag} value={tag} color="white">
                          {tag}
                        </Checkbox>
                      ))}
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
