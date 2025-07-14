import React, { useState } from 'react';
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
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaClock,
  FaProjectDiagram,
  FaCalendarAlt,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartLine,
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardContentBg = useColorModeValue('white', 'gray.700');
  const cardHeaderBg = useColorModeValue('blue.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const toast = useToast();
  const gradientBg = useColorModeValue(
    'linear(135deg, blue.400 0%, purple.400 25%, teal.400 50%, green.400 75%, blue.400 100%)',
    'linear(135deg, blue.600 0%, purple.600 25%, teal.600 50%, green.600 75%, blue.600 100%)'
  );

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // New project form state
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    deadline: '',
    priority: 'Medium',
    tags: '',
  });

  // Mock projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with advanced features including payment integration, inventory management, and analytics.',
      role: 'Project Manager',
      status: 'Active',
      progress: 85,
      startDate: '2024-01-15',
      deadline: '2024-08-15',
      memberCount: 8,
      priority: 'High',
      tags: ['Frontend', 'Backend', 'Database'],
      members: [
        { name: 'John Doe', role: 'Frontend Developer' },
        { name: 'Jane Smith', role: 'Backend Developer' },
        { name: 'Mike Johnson', role: 'UI/UX Designer' },
        { name: 'Sarah Wilson', role: 'QA Engineer' },
      ],
      totalTasks: 45,
      completedTasks: 38,
      owner: 'You',
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for task management with real-time synchronization and offline capabilities.',
      role: 'Senior Developer',
      status: 'Active',
      progress: 62,
      startDate: '2024-02-01',
      deadline: '2024-09-01',
      memberCount: 6,
      priority: 'High',
      tags: ['React Native', 'API', 'Mobile'],
      members: [
        { name: 'Alice Davis', role: 'Mobile Developer' },
        { name: 'Tom Brown', role: 'Backend Developer' },
        { name: 'Lisa Chen', role: 'UI/UX Designer' },
      ],
      totalTasks: 32,
      completedTasks: 20,
      owner: 'Alice Davis',
    },
    {
      id: 3,
      name: 'UI/UX Redesign',
      description: 'Complete redesign of the user interface and experience for better usability and modern aesthetics.',
      role: 'Lead Designer',
      status: 'Planning',
      progress: 25,
      startDate: '2024-03-01',
      deadline: '2024-07-30',
      memberCount: 4,
      priority: 'Medium',
      tags: ['Design', 'Research', 'Prototyping'],
      members: [
        { name: 'Emma Wilson', role: 'UX Designer' },
        { name: 'David Kim', role: 'UI Designer' },
        { name: 'Chris Lee', role: 'UX Researcher' },
      ],
      totalTasks: 28,
      completedTasks: 7,
      owner: 'You',
    },
    {
      id: 4,
      name: 'API Documentation',
      description: 'Comprehensive API documentation with interactive examples and integration guides.',
      role: 'Technical Writer',
      status: 'Completed',
      progress: 100,
      startDate: '2024-01-01',
      deadline: '2024-03-01',
      memberCount: 3,
      priority: 'Low',
      tags: ['Documentation', 'API'],
      members: [
        { name: 'Robert Johnson', role: 'Technical Writer' },
        { name: 'Maria Garcia', role: 'Developer' },
      ],
      totalTasks: 15,
      completedTasks: 15,
      owner: 'Robert Johnson',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Planning': return 'blue';
      case 'Completed': return 'gray';
      case 'On Hold': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Project Manager': return 'purple';
      case 'Lead Designer': return 'pink';
      case 'Senior Developer': return 'blue';
      case 'Technical Writer': return 'teal';
      default: return 'gray';
    }
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'blue';
    if (progress >= 25) return 'yellow';
    return 'red';
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      const matchesRole = roleFilter === 'All' || project.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'progress': return b.progress - a.progress;
        case 'deadline': return new Date(a.deadline) - new Date(b.deadline);
        case 'priority': 
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default: return 0;
      }
    });

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in project name and description',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const project = {
      id: Date.now(),
      ...newProject,
      role: 'Project Manager',
      status: 'Planning',
      progress: 0,
      memberCount: 1,
      members: [{ name: 'You', role: 'Project Manager' }],
      totalTasks: 0,
      completedTasks: 0,
      owner: 'You',
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setProjects(prev => [...prev, project]);
    
    toast({
      title: 'Success',
      description: 'Project created successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewProject({
      name: '',
      description: '',
      startDate: '',
      deadline: '',
      priority: 'Medium',
      tags: '',
    });

    onCreateClose();
  };

  // Stats calculation
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);

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
        width="250px"
        height="250px"
        borderRadius="full"
        bgGradient="linear(135deg, blue.400, purple.400)"
        opacity={0.1}
        animation="float 6s ease-in-out infinite"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-5%"
        left="-5%"
        width="180px"
        height="180px"
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
          <Flex justify="space-between" align="center" position="relative" zIndex={1}>
            <Box>
              <Heading 
                size="2xl" 
                mb={3} 
                fontWeight="bold"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
                animation="slideInLeft 0.8s ease-out"
              >
                Projects 🚀
              </Heading>
              <Text 
                fontSize="lg" 
                opacity={0.9}
                animation="slideInLeft 0.8s ease-out 0.2s both"
              >
                Manage and track all your projects with style
              </Text>
            </Box>
            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="whiteAlpha" 
              variant="solid"
              size="lg"
              onClick={onCreateOpen}
              bg="rgba(255,255,255,0.2)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ 
                bg: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
                shadow: "xl"
              }}
              transition="all 0.3s ease"
              animation="slideInRight 0.8s ease-out 0.3s both"
            >
              Create Project
            </Button>
          </Flex>
        </Box>

        {/* Stats Cards */}
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
                    <StatLabel color={mutedTextColor} fontWeight="semibold" fontSize="sm">Total Projects</StatLabel>
                    <StatNumber 
                      color={useColorModeValue('blue.600', 'blue.300')} 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.5s both"
                    >
                      {totalProjects}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={useColorModeValue('blue.50', 'blue.800')}
                    color={useColorModeValue('blue.500', 'blue.200')}
                    animation="pulse 2s ease-in-out infinite"
                  >
                    <Icon as={FaProjectDiagram} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color={mutedTextColor} fontWeight="medium">
                  <Icon as={FaProjectDiagram} mr={1} />
                  All projects
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
            animation="slideInUp 0.6s ease-out 0.1s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color={mutedTextColor} fontWeight="semibold" fontSize="sm">Active Projects</StatLabel>
                    <StatNumber 
                      color={useColorModeValue('green.600', 'green.300')} 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.6s both"
                    >
                      {activeProjects}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={useColorModeValue('green.50', 'green.800')}
                    color={useColorModeValue('green.500', 'green.200')}
                    animation="pulse 2s ease-in-out infinite 0.5s"
                  >
                    <Icon as={FaChartLine} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color={mutedTextColor} fontWeight="medium">
                  <Icon as={FaChartLine} mr={1} />
                  In progress
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
              borderColor: "gray.400"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, gray.400, gray.600)",
            }}
            animation="slideInUp 0.6s ease-out 0.2s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color={mutedTextColor} fontWeight="semibold" fontSize="sm">Completed</StatLabel>
                    <StatNumber 
                      color={useColorModeValue('gray.600', 'gray.300')} 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.7s both"
                    >
                      {completedProjects}
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    color={useColorModeValue('gray.500', 'gray.300')}
                    animation="pulse 2s ease-in-out infinite 1s"
                  >
                    <Icon as={FaUsers} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color={mutedTextColor} fontWeight="medium">
                  <Icon as={FaUsers} mr={1} />
                  Finished
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
              borderColor: "purple.300"
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bgGradient: "linear(90deg, purple.400, pink.400)",
            }}
            animation="slideInUp 0.6s ease-out 0.3s both"
          >
            <CardBody>
              <Stat>
                <HStack justify="space-between" mb={2}>
                  <Box>
                    <StatLabel color={mutedTextColor} fontWeight="semibold" fontSize="sm">Average Progress</StatLabel>
                    <StatNumber 
                      color={useColorModeValue('purple.600', 'purple.300')} 
                      fontSize="3xl" 
                      fontWeight="bold"
                      animation="countUp 1s ease-out 0.8s both"
                    >
                      {averageProgress}%
                    </StatNumber>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={useColorModeValue('purple.50', 'purple.800')}
                    color={useColorModeValue('purple.500', 'purple.200')}
                    animation="pulse 2s ease-in-out infinite 1.5s"
                  >
                    <Icon as={FaCalendarAlt} boxSize={6} />
                  </Box>
                </HStack>
                <StatHelpText color={mutedTextColor} fontWeight="medium">
                  <Icon as={FaCalendarAlt} mr={1} />
                  Overall completion
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters and Search */}
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
            transform: "translateY(-2px)",
            shadow: "2xl"
          }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgGradient: "linear(90deg, blue.400, teal.400)",
          }}
          animation="fadeInScale 0.8s ease-out 0.4s both"
        >
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <InputGroup flex="2" minW="250px">
                <InputLeftElement>
                  <Icon as={FaSearch} color={mutedTextColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue('gray.50', 'gray.600')}
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.500')}
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                  }}
                  transition="all 0.2s ease"
                />
              </InputGroup>

              <Select 
                flex="1" 
                minW="120px"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                bg={useColorModeValue('white', 'gray.600')}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.500')}
                _focus={{
                  borderColor: useColorModeValue('blue.400', 'blue.300'),
                  shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                }}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </Select>

              <Select 
                flex="1" 
                minW="150px"
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                bg={useColorModeValue('white', 'gray.600')}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.500')}
                _focus={{
                  borderColor: useColorModeValue('blue.400', 'blue.300'),
                  shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                }}
              >
                <option value="All">All Roles</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Lead Designer">Lead Designer</option>
                <option value="Senior Developer">Senior Developer</option>
                <option value="Technical Writer">Technical Writer</option>
              </Select>

              <Select 
                flex="1" 
                minW="130px"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                bg={useColorModeValue('white', 'gray.600')}
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.500')}
                _focus={{
                  borderColor: useColorModeValue('blue.400', 'blue.300'),
                  shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="deadline">Sort by Deadline</option>
                <option value="priority">Sort by Priority</option>
              </Select>
            </HStack>
          </CardBody>
        </Card>

        {/* Projects Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={6}>
          {filteredAndSortedProjects.map((project, index) => (
            <Card 
              key={project.id} 
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
                transform: "translateY(-5px) scale(1.02)",
                shadow: "2xl",
                borderColor: useColorModeValue('blue.200', 'blue.500')
              }}
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                bgGradient: `linear(90deg, ${getStatusColor(project.status)}.400, ${getPriorityColor(project.priority)}.400)`,
              }}
              animation={`fadeInScale 0.6s ease-out ${0.5 + index * 0.1}s both`}
            >
              <CardHeader 
                pb={3}
                bg={useColorModeValue(`${getStatusColor(project.status)}.50`, 'gray.700')}
                borderTopRadius="2xl"
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex="1">
                    <Heading size="md" noOfLines={1} color={textColor} fontWeight="bold">
                      {project.name}
                    </Heading>
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge 
                        colorScheme={getStatusColor(project.status)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        {project.status}
                      </Badge>
                      <Badge 
                        colorScheme={getPriorityColor(project.priority)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        {project.priority}
                      </Badge>
                      <Badge 
                        colorScheme={getRoleColor(project.role)} 
                        size="sm"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        {project.role}
                      </Badge>
                    </HStack>
                  </VStack>
                  
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      size="sm"
                      variant="ghost"
                      color={textColor}
                      _hover={{
                        bg: useColorModeValue('gray.100', 'gray.600'),
                        transform: "scale(1.1)"
                      }}
                      transition="all 0.2s ease"
                    />
                    <MenuList 
                      bg={cardBg}
                      borderColor={borderColor}
                      shadow="xl"
                    >
                      <MenuItem 
                        icon={<FaEye />}
                        as={RouterLink}
                        to={`/projects/${project.id}`}
                        _hover={{
                          bg: useColorModeValue('blue.50', 'gray.600')
                        }}
                      >
                        View Details
                      </MenuItem>
                      {project.owner === 'You' && (
                        <>
                          <MenuItem 
                            icon={<FaEdit />}
                            _hover={{
                              bg: useColorModeValue('green.50', 'gray.600')
                            }}
                          >
                            Edit Project
                          </MenuItem>
                          <MenuItem 
                            icon={<FaTrash />} 
                            color="red.500"
                            _hover={{
                              bg: useColorModeValue('red.50', 'red.800')
                            }}
                          >
                            Delete Project
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>
              </CardHeader>

              <CardBody pt={0} bg={cardContentBg}>
                <VStack align="stretch" spacing={4}>
                  {/* Description */}
                  <Text fontSize="sm" color={mutedTextColor} noOfLines={3} fontWeight="medium">
                    {project.description}
                  </Text>

                  {/* Progress */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>Progress</Text>
                      <Text 
                        fontSize="sm" 
                        color={useColorModeValue(`${getProgressColor(project.progress)}.600`, `${getProgressColor(project.progress)}.300`)}
                        fontWeight="bold"
                      >
                        {project.progress}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={project.progress} 
                      colorScheme={getProgressColor(project.progress)} 
                      size="lg" 
                      borderRadius="full"
                      bg={useColorModeValue('gray.100', 'gray.600')}
                      sx={{
                        '& > div': {
                          background: `linear-gradient(90deg, ${project.progress > 70 ? '#22C55E' : project.progress > 40 ? '#3182CE' : '#F59E0B'}, ${project.progress > 70 ? '#16A34A' : project.progress > 40 ? '#2C5282' : '#D97706'})`
                        }
                      }}
                    />
                  </Box>

                  {/* Stats */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FaUsers} boxSize={3} color={useColorModeValue('blue.500', 'blue.300')} />
                        <Text fontSize="xs" color={mutedTextColor} fontWeight="semibold">Team</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>{project.memberCount} members</Text>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FaClock} boxSize={3} color={useColorModeValue('orange.500', 'orange.300')} />
                        <Text fontSize="xs" color={mutedTextColor} fontWeight="semibold">Timeline</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        {calculateDaysLeft(project.deadline)} days left
                      </Text>
                    </VStack>
                  </SimpleGrid>

                  {/* Tasks Progress */}
                  <HStack justify="space-between" fontSize="sm">
                    <Text color={mutedTextColor} fontWeight="semibold">
                      Tasks: {project.completedTasks}/{project.totalTasks}
                    </Text>
                    <Text color={mutedTextColor} fontWeight="semibold">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </Text>
                  </HStack>

                  {/* Team Avatars */}
                  <HStack justify="space-between">
                    <AvatarGroup size="sm" max={4}>
                      {project.members.map((member, index) => (
                        <Tooltip key={index} label={`${member.name} - ${member.role}`}>
                          <Avatar 
                            name={member.name}
                            border="2px solid"
                            borderColor={useColorModeValue('white', 'gray.700')}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    
                    <Button
                      as={RouterLink}
                      to={`/projects/${project.id}`}
                      size="sm"
                      variant="solid"
                      colorScheme={getStatusColor(project.status)}
                      rightIcon={<FaEye />}
                      borderRadius="full"
                      fontWeight="bold"
                      _hover={{
                        transform: "scale(1.05)"
                      }}
                      transition="all 0.2s ease"
                    >
                      View
                    </Button>
                  </HStack>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <HStack spacing={1} flexWrap="wrap">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          size="sm"
                          borderRadius="full"
                          px={2}
                          py={1}
                          color={useColorModeValue('blue.600', 'blue.300')}
                          borderColor={useColorModeValue('blue.200', 'blue.500')}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge 
                          variant="outline" 
                          size="sm"
                          borderRadius="full"
                          px={2}
                          py={1}
                          color={mutedTextColor}
                          borderColor={borderColor}
                        >
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </HStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {filteredAndSortedProjects.length === 0 && (
          <Card 
            bg={cardBg} 
            borderColor={borderColor}
            shadow="xl"
            borderRadius="2xl"
            border="none"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgGradient: "linear(90deg, gray.400, gray.600)",
            }}
          >
            <CardBody textAlign="center" py={12}>
              <Icon 
                as={FaProjectDiagram} 
                boxSize={16} 
                color={useColorModeValue('gray.400', 'gray.500')} 
                mb={6}
                opacity={0.7}
              />
              <Heading size="lg" color={textColor} mb={3}>No projects found</Heading>
              <Text color={mutedTextColor} mb={6} fontSize="lg">
                {searchTerm || statusFilter !== 'All' || roleFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'
                }
              </Text>
              {(!searchTerm && statusFilter === 'All' && roleFilter === 'All') && (
                <Button 
                  leftIcon={<FaPlus />} 
                  colorScheme="blue" 
                  size="lg"
                  onClick={onCreateOpen}
                  borderRadius="full"
                  px={8}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  transition="all 0.3s ease"
                >
                  Create Your First Project
                </Button>
              )}
            </CardBody>
          </Card>
        )}
        
        {/* Create Project Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent 
            bg={cardBg}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            shadow="2xl"
          >
            <ModalHeader 
              bg={useColorModeValue('blue.50', 'gray.700')}
              borderTopRadius="2xl"
              borderBottom="1px"
              borderColor={borderColor}
            >
              <HStack>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={useColorModeValue('blue.100', 'blue.800')}
                  color={useColorModeValue('blue.600', 'blue.200')}
                >
                  <Icon as={FaPlus} />
                </Box>
                <Text color={textColor} fontWeight="bold">Create New Project</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton 
              color={textColor}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.600')
              }}
            />
            <ModalBody p={6}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="semibold">Project Name</FormLabel>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name..."
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="semibold">Description</FormLabel>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project..."
                    rows={4}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Start Date</FormLabel>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Deadline</FormLabel>
                    <Input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel color={textColor} fontWeight="semibold">Priority</FormLabel>
                  <Select
                    value={newProject.priority}
                    onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontWeight="semibold">Tags (comma-separated)</FormLabel>
                  <Input
                    value={newProject.tags}
                    onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Frontend, Backend, API, ..."
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter 
              borderTop="1px"
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderBottomRadius="2xl"
            >
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onCreateClose}
                color={mutedTextColor}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.600')
                }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleCreateProject}
                borderRadius="lg"
                px={6}
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "lg"
                }}
                transition="all 0.2s ease"
              >
                Create Project
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
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

export default Projects;
