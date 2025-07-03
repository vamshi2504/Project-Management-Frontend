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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
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
  Button,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
  FaEllipsisV,
  FaEdit,
  FaUserPlus,
  FaUser,
} from 'react-icons/fa';
import { EditIcon } from '@chakra-ui/icons';

const Dashboard = () => {
  const [projects, setProjects] = useState([
    { 
      id: 1,
      name: 'E-commerce Platform', 
      progress: 85, 
      members: 4, 
      deadline: '2 days',
      owner: 'You',
      team: ['You', 'Alice Johnson', 'Bob Smith', 'Carol Davis'],
      description: 'Building a modern e-commerce platform with advanced features'
    },
    { 
      id: 2,
      name: 'Mobile App Development', 
      progress: 62, 
      members: 6, 
      deadline: '1 week',
      owner: 'Alice Johnson',
      team: ['Alice Johnson', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'],
      description: 'Developing a cross-platform mobile application'
    },
    { 
      id: 3,
      name: 'UI/UX Redesign', 
      progress: 40, 
      members: 3, 
      deadline: '3 weeks',
      owner: 'You',
      team: ['You', 'Sarah Connor', 'Mike Ross'],
      description: 'Complete redesign of the user interface and experience'
    },
  ]);

  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    description: '',
    deadline: '',
  });

  const [memberFormData, setMemberFormData] = useState({
    projectId: null,
    memberName: '',
  });

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isMemberOpen, onOpen: onMemberOpen, onClose: onMemberClose } = useDisclosure();
  const toast = useToast();
  const currentUser = 'You'; // This would come from authentication context

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const iconColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const gradientBg = useColorModeValue(
    'linear(to-r, teal.400, blue.500)',
    'linear(to-r, teal.600, blue.700)'
  );

  const stats = [
    { 
      label: 'Total Tasks', 
      count: 42, 
      icon: FaTasks, 
      color: 'blue.500',
      bgGradient: 'linear(to-r, blue.400, blue.600)',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      label: 'Completed', 
      count: 20, 
      icon: FaCheckCircle, 
      color: 'green.500',
      bgGradient: 'linear(to-r, green.400, green.600)',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      label: 'In Progress', 
      count: 15, 
      icon: FaSpinner, 
      color: 'orange.500',
      bgGradient: 'linear(to-r, orange.400, orange.600)',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      label: 'Pending', 
      count: 7, 
      icon: FaClock, 
      color: 'red.500',
      bgGradient: 'linear(to-r, red.400, red.600)',
      change: '-3%',
      changeType: 'decrease'
    },
  ];

  // Handler functions
  const handleEditProject = (project) => {
    setEditFormData({
      id: project.id,
      name: project.name,
      description: project.description,
      deadline: new Date(Date.now() + parseInt(project.deadline.split(' ')[0]) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
            deadline: calculateDeadlineText(editFormData.deadline),
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
            members: project.members + 1,
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

  const calculateDeadlineText = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Overdue';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 14) return '1 week';
    if (diffDays < 21) return '2 weeks';
    return '3+ weeks';
  };

  const recentActivities = [
    { action: 'Task completed', project: 'E-commerce Platform', time: '2 hours ago' },
    { action: 'New member added', project: 'Mobile App', time: '4 hours ago' },
    { action: 'Milestone reached', project: 'UI/UX Redesign', time: '1 day ago' },
  ];

  return (
    <Box p={8} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Header */}
      <Box mb={8}>
        <Heading size="xl" color={textColor} mb={2}>
          Dashboard
        </Heading>
        <Text color="gray.500" fontSize="lg">
          Welcome back! Here's what's happening with your projects.
        </Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
            _hover={{ 
              transform: 'translateY(-4px)', 
              boxShadow: '2xl',
              transition: 'all 0.3s ease'
            }}
            transition="all 0.3s ease"
          >
            {/* Gradient Background */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bgGradient={stat.bgGradient}
            />
            
            <Flex justify="space-between" align="flex-start" mb={4}>
              <Box
                p={3}
                borderRadius="lg"
                bg={useColorModeValue(`${stat.color.split('.')[0]}.50`, `${stat.color.split('.')[0]}.900`)}
              >
                <Icon as={stat.icon} boxSize={6} color={stat.color} />
              </Box>
              <Badge
                colorScheme={stat.changeType === 'increase' ? 'green' : 'red'}
                variant="subtle"
                borderRadius="full"
                px={2}
              >
                {stat.change}
              </Badge>
            </Flex>
            
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {stat.label}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                {stat.count}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Active Projects */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        p={6}
        boxShadow="xl"
        border="1px"
        borderColor={borderColor}
        mb={8}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color={textColor}>
            Active Projects
          </Heading>
          <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={3}>
            {projects.length} Active
          </Badge>
        </Flex>
        
        <Stack spacing={6}>
          {projects.map((project, index) => (
            <Box key={project.id} position="relative">
              <Flex justify="space-between" align="center" mb={3}>
                <VStack align="start" spacing={1} flex="1">
                  <Flex justify="space-between" align="center" w="full">
                    <Text fontWeight="semibold" color={textColor}>
                      {project.name}
                    </Text>
                    {/* Action Menu - Only visible to project owner */}
                    {project.owner === currentUser && (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<Icon as={FaEllipsisV} />}
                          variant="ghost"
                          size="sm"
                          color="gray.500"
                          _hover={{ color: textColor, bg: useColorModeValue('gray.100', 'gray.700') }}
                          aria-label="Project actions"
                        />
                        <MenuList bg={cardBg} borderColor={borderColor}>
                          <MenuItem 
                            icon={<Icon as={FaEdit} />}
                            onClick={() => handleEditProject(project)}
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                          >
                            Edit Project
                          </MenuItem>
                          <MenuItem 
                            icon={<Icon as={FaUserPlus} />}
                            onClick={() => handleAddMember(project.id)}
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                          >
                            Add Member
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Flex>
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Icon as={FaUsers} boxSize={3} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        {project.members} members
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FaCalendarAlt} boxSize={3} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        Due in {project.deadline}
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FaUser} boxSize={3} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        Owner: {project.owner}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {project.progress}%
                  </Text>
                  <AvatarGroup size="sm" max={3}>
                    {project.team.slice(0, 3).map((member, memberIndex) => (
                      <Avatar key={memberIndex} name={member} src="" />
                    ))}
                  </AvatarGroup>
                </VStack>
              </Flex>
              <Progress
                value={project.progress}
                colorScheme={project.progress > 70 ? 'green' : project.progress > 40 ? 'yellow' : 'red'}
                borderRadius="full"
                size="sm"
              />
              {index < projects.length - 1 && <Divider mt={6} />}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color={textColor}>
            <HStack spacing={3}>
              <Icon as={FaEdit} color="blue.400" />
              <Text>Edit Project</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                  Project Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaProjectDiagram} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                    bg={useColorModeValue('white', 'gray.700')}
                    border="1px"
                    borderColor={borderColor}
                    color={textColor}
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500" }}
                    pl={10}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px"
                  borderColor={borderColor}
                  color={textColor}
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
                  rows={4}
                  resize="vertical"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
                  Deadline
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    bg={useColorModeValue('white', 'gray.700')}
                    border="1px"
                    borderColor={borderColor}
                    color={textColor}
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "blue.500" }}
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
              _hover={{ color: textColor, bg: useColorModeValue('gray.100', 'gray.700') }}
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
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color={textColor}>
            <HStack spacing={3}>
              <Icon as={FaUserPlus} color="green.400" />
              <Text>Add Team Member</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel color={textColor} fontSize="sm" fontWeight="medium">
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
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px"
                  borderColor={borderColor}
                  color={textColor}
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "blue.500" }}
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
              _hover={{ color: textColor, bg: useColorModeValue('gray.100', 'gray.700') }}
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

      {/* Recent Activity
      <Box
        bg={cardBg}
        borderRadius="2xl"
        p={6}
        boxShadow="xl"
        border="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={6} color={textColor}>
          Recent Activity
        </Heading>
        <Stack spacing={4}>
          {recentActivities.map((activity, index) => (
            <Flex key={index} align="center" gap={4}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg="teal.500"
              />
              <Box flex="1">
                <Text fontSize="sm" color={textColor}>
                  <Text as="span" fontWeight="semibold">{activity.action}</Text>
                  {' in '}
                  <Text as="span" color="teal.500">{activity.project}</Text>
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {activity.time}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Box>*/}
    </Box> 
  );
};

export default Dashboard;
