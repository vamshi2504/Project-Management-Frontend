import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
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
import { auth } from '../firebase';
import chatService from '../services/chatService';
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
  const [user] = useAuthState(auth);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

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

  const handleCreateProject = async () => {
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
      members: [{ name: user?.displayName || user?.email || 'You', role: 'Project Manager', id: user?.uid }],
      totalTasks: 0,
      completedTasks: 0,
      owner: user?.displayName || user?.email || 'You',
      createdBy: user?.uid,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      // Create the project
      setProjects(prev => [...prev, project]);
      
      // Create a chat group for the project if user is logged in
      if (user) {
        await chatService.createProjectGroup({
          id: project.id,
          name: project.name,
          members: [user.uid], // Start with just the creator
          createdBy: user.uid,
          description: project.description,
          isPrivate: false
        });
      }
      
      toast({
        title: 'Success',
        description: 'Project and chat group created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating project group:', error);
      toast({
        title: 'Project created',
        description: 'Project created but failed to create chat group. You can create one manually in Chat.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }

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
    <Box bg={bgColor} minH="100vh" p={6} ml="256px">
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="xl" mb={2}>Projects</Heading>
            <Text color="gray.600">Manage and track all your projects</Text>
          </Box>
          <Button 
            leftIcon={<FaPlus />} 
            colorScheme="blue" 
            size="lg"
            onClick={onCreateOpen}
          >
            Create Project
          </Button>
        </Flex>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Projects</StatLabel>
                <StatNumber color="blue.500">{totalProjects}</StatNumber>
                <StatHelpText>
                  <Icon as={FaProjectDiagram} mr={1} />
                  All projects
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <StatNumber color="green.500">{activeProjects}</StatNumber>
                <StatHelpText>
                  <Icon as={FaChartLine} mr={1} />
                  In progress
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Completed</StatLabel>
                <StatNumber color="gray.500">{completedProjects}</StatNumber>
                <StatHelpText>
                  <Icon as={FaUsers} mr={1} />
                  Finished
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Average Progress</StatLabel>
                <StatNumber color="purple.500">{averageProgress}%</StatNumber>
                <StatHelpText>
                  <Icon as={FaCalendarAlt} mr={1} />
                  Overall completion
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters and Search */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <InputGroup flex="2" minW="250px">
                <InputLeftElement>
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select 
                flex="1" 
                minW="120px"
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
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
          {filteredAndSortedProjects.map((project) => (
            <Card 
              key={project.id} 
              bg={cardBg} 
              borderColor={borderColor}
              _hover={{ 
                shadow: 'lg', 
                transform: 'translateY(-2px)',
                transition: 'all 0.2s'
              }}
              transition="all 0.2s"
            >
              <CardHeader pb={3}>
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={1} flex="1">
                    <Heading size="md" noOfLines={1}>{project.name}</Heading>
                    <HStack spacing={2}>
                      <Badge colorScheme={getStatusColor(project.status)} size="sm">
                        {project.status}
                      </Badge>
                      <Badge colorScheme={getPriorityColor(project.priority)} size="sm">
                        {project.priority}
                      </Badge>
                      <Badge colorScheme={getRoleColor(project.role)} size="sm">
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
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<FaEye />}
                        as={RouterLink}
                        to={`/projects/${project.id}`}
                      >
                        View Details
                      </MenuItem>
                      {project.owner === 'You' && (
                        <>
                          <MenuItem icon={<FaEdit />}>
                            Edit Project
                          </MenuItem>
                          <MenuItem icon={<FaTrash />} color="red.500">
                            Delete Project
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </HStack>
              </CardHeader>

              <CardBody pt={0}>
                <VStack align="stretch" spacing={4}>
                  {/* Description */}
                  <Text fontSize="sm" color="gray.600" noOfLines={3}>
                    {project.description}
                  </Text>

                  {/* Progress */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="semibold">Progress</Text>
                      <Text fontSize="sm" color={`${getProgressColor(project.progress)}.500`}>
                        {project.progress}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={project.progress} 
                      colorScheme={getProgressColor(project.progress)} 
                      size="sm" 
                      borderRadius="full"
                    />
                  </Box>

                  {/* Stats */}
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FaUsers} boxSize={3} color="gray.500" />
                        <Text fontSize="xs" color="gray.600">Team</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="semibold">{project.memberCount} members</Text>
                    </VStack>

                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FaClock} boxSize={3} color="gray.500" />
                        <Text fontSize="xs" color="gray.600">Timeline</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="semibold">
                        {calculateDaysLeft(project.deadline)} days left
                      </Text>
                    </VStack>
                  </SimpleGrid>

                  {/* Tasks Progress */}
                  <HStack justify="space-between" fontSize="sm">
                    <Text color="gray.600">
                      Tasks: {project.completedTasks}/{project.totalTasks}
                    </Text>
                    <Text color="gray.600">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </Text>
                  </HStack>

                  {/* Team Avatars */}
                  <HStack justify="space-between">
                    <AvatarGroup size="sm" max={4}>
                      {project.members.map((member, index) => (
                        <Tooltip key={index} label={`${member.name} - ${member.role}`}>
                          <Avatar name={member.name} />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    
                    <Button
                      as={RouterLink}
                      to={`/projects/${project.id}`}
                      size="sm"
                      variant="outline"
                      rightIcon={<FaEye />}
                    >
                      View
                    </Button>
                  </HStack>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <HStack spacing={1} flexWrap="wrap">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" size="sm">
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
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody textAlign="center" py={12}>
              <Icon as={FaProjectDiagram} boxSize={12} color="gray.400" mb={4} />
              <Heading size="md" color="gray.500" mb={2}>No projects found</Heading>
              <Text color="gray.400" mb={4}>
                {searchTerm || statusFilter !== 'All' || roleFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'
                }
              </Text>
              {(!searchTerm && statusFilter === 'All' && roleFilter === 'All') && (
                <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onCreateOpen}>
                  Create Your First Project
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Create Project Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader>
            <HStack>
              <Icon as={FaPlus} color="blue.500" />
              <Text>Create New Project</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Project Name</FormLabel>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name..."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  rows={4}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Deadline</FormLabel>
                  <Input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={newProject.priority}
                  onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <Input
                  value={newProject.tags}
                  onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Frontend, Backend, API, ..."
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateProject}>
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Projects;
