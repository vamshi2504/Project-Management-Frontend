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
  Input,
  Textarea,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { AddIcon, CalendarIcon, TimeIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons';
import { FaUser, FaUsers, FaClock, FaProjectDiagram, FaFileAlt, FaCalendarAlt, FaUserPlus, FaEllipsisV } from 'react-icons/fa';

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
  const [projects, setProjects] = useState(mockProjects);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: 'You',
    deadline: '',
    status: 'Pending',
  });
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    description: '',
    owner: '',
    deadline: '',
    status: '',
  });
  const [memberFormData, setMemberFormData] = useState({
    projectId: null,
    memberName: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isMemberOpen, onOpen: onMemberOpen, onClose: onMemberClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = 'You'; // This would come from authentication context

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProject = () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.deadline) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create new project
    const newProject = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      description: formData.description,
      owner: formData.owner,
      progress: 0,
      deadline: formData.deadline,
      status: formData.status,
      team: [formData.owner], // Start with just the owner
      tasksCompleted: 0,
      totalTasks: 0,
    };

    // Add to projects list
    setProjects(prev => [newProject, ...prev]);

    // Reset form
    setFormData({
      name: '',
      description: '',
      owner: 'You',
      deadline: '',
      status: 'Pending',
    });

    // Close modal
    onClose();

    // Show success toast
    toast({
      title: 'Success',
      description: 'Project created successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      owner: 'You',
      deadline: '',
      status: 'Pending',
    });
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
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

  // Handler functions for edit and add member
  const handleEditProject = (project) => {
    setEditFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      owner: project.owner,
      deadline: project.deadline,
      status: project.status,
    });
    onEditOpen();
  };

  const handleAddMember = (projectId) => {
    setMemberFormData({
      projectId,
      memberName: '',
    });
    onMemberOpen();
  };

  const handleEditSubmit = () => {
    if (!editFormData.name || !editFormData.description || !editFormData.deadline) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects(prev => prev.map(project => 
      project.id === editFormData.id 
        ? { 
            ...project, 
            name: editFormData.name,
            description: editFormData.description,
            owner: editFormData.owner,
            deadline: editFormData.deadline,
            status: editFormData.status,
          }
        : project
    ));

    toast({
      title: 'Success',
      description: 'Project updated successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    onEditClose();
  };

  const handleMemberSubmit = () => {
    if (!memberFormData.memberName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a member name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects(prev => prev.map(project => 
      project.id === memberFormData.projectId 
        ? { 
            ...project, 
            team: [...project.team, memberFormData.memberName],
          }
        : project
    ));

    toast({
      title: 'Success',
      description: 'Member added successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setMemberFormData({ projectId: null, memberName: '' });
    onMemberClose();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              {projects.length}
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
              {projects.filter(p => p.status === 'Completed').length}
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
              {projects.filter(p => p.status === 'In Progress').length}
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Grid of Project Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {projects.map((project) => (
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
                <Flex justify="space-between" align="center" w="full">
                  <Heading size="md" color="white" noOfLines={1}>
                    {project.name}
                  </Heading>
                  {/* Action Menu - Only visible to project owner */}
                  {project.owner === currentUser && (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<Icon as={FaEllipsisV} />}
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        _hover={{ color: "white", bg: "gray.700" }}
                        aria-label="Project actions"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MenuList bg="gray.800" borderColor="gray.700">
                        <MenuItem 
                          icon={<Icon as={EditIcon} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project);
                          }}
                          _hover={{ bg: "gray.700" }}
                          color="white"
                        >
                          Edit Project
                        </MenuItem>
                        <MenuItem 
                          icon={<Icon as={FaUserPlus} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddMember(project.id);
                          }}
                          _hover={{ bg: "gray.700" }}
                          color="white"
                        >
                          Add Member
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </Flex>
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

      {/* Create Project Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaProjectDiagram} color="blue.400" />
              <Text>Create New Project</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Project Name */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Project Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaProjectDiagram} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
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

              {/* Project Description */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project..."
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

              {/* Owner and Status Row */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Project Owner
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="owner"
                      value={formData.owner}
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
                      <option value="Carol Davis" style={{ backgroundColor: '#2D3748' }}>Carol Davis</option>
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
                    <option value="Pending" style={{ backgroundColor: '#2D3748' }}>Pending</option>
                    <option value="In Progress" style={{ backgroundColor: '#2D3748' }}>In Progress</option>
                    <option value="Completed" style={{ backgroundColor: '#2D3748' }}>Completed</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Deadline */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Deadline
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
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
              onClick={handleCreateProject}
              leftIcon={<AddIcon />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaProjectDiagram} color="blue.400" />
              <Text>Edit Project</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Project Name */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Project Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaProjectDiagram} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    placeholder="Enter project name"
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

              {/* Project Description */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Describe your project..."
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

              {/* Owner and Status Row */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Project Owner
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="owner"
                      value={editFormData.owner}
                      onChange={handleEditInputChange}
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
                      <option value="Carol Davis" style={{ backgroundColor: '#2D3748' }}>Carol Davis</option>
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Status
                  </FormLabel>
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
                    <option value="Pending" style={{ backgroundColor: '#2D3748' }}>Pending</option>
                    <option value="In Progress" style={{ backgroundColor: '#2D3748' }}>In Progress</option>
                    <option value="Completed" style={{ backgroundColor: '#2D3748' }}>Completed</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Deadline */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Deadline
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="deadline"
                    type="date"
                    value={editFormData.deadline}
                    onChange={handleEditInputChange}
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onEditClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleEditSubmit}
              leftIcon={<EditIcon />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={isMemberOpen} onClose={onMemberClose} size="md">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaUserPlus} color="blue.400" />
              <Text>Add Team Member</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Member Name */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Member Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="memberName"
                    value={memberFormData.memberName}
                    onChange={(e) => setMemberFormData({ ...memberFormData, memberName: e.target.value })}
                    placeholder="Enter member name"
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onMemberClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleMemberSubmit}
              leftIcon={<FaUserPlus />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Add Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={EditIcon} color="blue.400" />
              <Text>Edit Project</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Project Name */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Project Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaProjectDiagram} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    placeholder="Enter project name"
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

              {/* Project Description */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  placeholder="Describe your project..."
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

              {/* Owner and Status Row */}
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Project Owner
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Select
                      name="owner"
                      value={editFormData.owner}
                      onChange={handleEditInputChange}
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
                      <option value="Carol Davis" style={{ backgroundColor: '#2D3748' }}>Carol Davis</option>
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                    Status
                  </FormLabel>
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
                    <option value="Pending" style={{ backgroundColor: '#2D3748' }}>Pending</option>
                    <option value="In Progress" style={{ backgroundColor: '#2D3748' }}>In Progress</option>
                    <option value="Completed" style={{ backgroundColor: '#2D3748' }}>Completed</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Deadline */}
              <FormControl isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                  Deadline
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    name="deadline"
                    type="date"
                    value={editFormData.deadline}
                    onChange={handleEditInputChange}
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onEditClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleEditSubmit}
              leftIcon={<EditIcon />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Update Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={isMemberOpen} onClose={onMemberClose} size="md">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="gray.800" border="1px" borderColor="gray.700">
          <ModalHeader color="white">
            <HStack spacing={3}>
              <Icon as={FaUserPlus} color="green.400" />
              <Text>Add Team Member</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="medium">
                Member Name
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="gray.500" />
                </InputLeftElement>
                <Input
                  value={memberFormData.memberName}
                  onChange={(e) => setMemberFormData(prev => ({ ...prev, memberName: e.target.value }))}
                  placeholder="Enter member name"
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
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onMemberClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleMemberSubmit}
              leftIcon={<Icon as={FaUserPlus} />}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Add Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProjectsPage;
