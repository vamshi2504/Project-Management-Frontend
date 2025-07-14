import {
  Box,
  Heading,
  Text,
  Flex,
  AvatarGroup,
  Avatar,
  Badge,
  Progress,
  Divider,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  Tooltip,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUsers, 
  FaClock, 
  FaCalendarAlt, 
  FaTasks, 
  FaEye, 
  FaUser, 
  FaEdit, 
  FaUserPlus, 
  FaProjectDiagram,
  FaChartLine,
  FaChartArea,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEllipsisV,
  FaPlus,
  FaFilter,
  FaBurn,
  FaGanttChart,
  FaPlay,
  FaPause,
  FaStop
} from "react-icons/fa";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Mock project data
  const [project] = useState({
    id: 1,
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with advanced features including payment integration, inventory management, and analytics.',
    status: 'Active',
    progress: 85,
    startDate: '2024-01-15',
    deadline: '2024-08-15',
    owner: 'John Doe',
    priority: 'High',
    budget: '$250,000',
    spent: '$187,500',
    team: [
      { name: 'John Doe', role: 'Project Manager', avatar: '', status: 'active' },
      { name: 'Jane Smith', role: 'Backend Developer', avatar: '', status: 'active' },
      { name: 'Mike Johnson', role: 'UI/UX Designer', avatar: '', status: 'active' },
      { name: 'Sarah Wilson', role: 'QA Engineer', avatar: '', status: 'active' },
      { name: 'Tom Brown', role: 'Frontend Developer', avatar: '', status: 'active' },
      { name: 'Lisa Chen', role: 'DevOps Engineer', avatar: '', status: 'inactive' },
    ],
    tags: ['Frontend', 'Backend', 'Database', 'Payment', 'Analytics'],
  });

  // Mock tasks/features data for charts
  const [features] = useState([
    {
      id: 1,
      name: 'User Authentication',
      status: 'Done',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      progress: 100,
      assignedTo: 'Jane Smith',
      tasksCount: 8,
      completedTasks: 8,
    },
    {
      id: 2,
      name: 'Product Catalog',
      status: 'Done',
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      progress: 100,
      assignedTo: 'Mike Johnson',
      tasksCount: 12,
      completedTasks: 12,
    },
    {
      id: 3,
      name: 'Shopping Cart',
      status: 'In Progress',
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      progress: 80,
      assignedTo: 'Tom Brown',
      tasksCount: 10,
      completedTasks: 8,
    },
    {
      id: 4,
      name: 'Payment Integration',
      status: 'In Progress',
      startDate: '2024-04-01',
      endDate: '2024-05-30',
      progress: 60,
      assignedTo: 'Sarah Wilson',
      tasksCount: 15,
      completedTasks: 9,
    },
    {
      id: 5,
      name: 'Analytics Dashboard',
      status: 'To Do',
      startDate: '2024-05-15',
      endDate: '2024-07-15',
      progress: 0,
      assignedTo: 'Lisa Chen',
      tasksCount: 20,
      completedTasks: 0,
    },
    {
      id: 6,
      name: 'Mobile App',
      status: 'To Do',
      startDate: '2024-06-01',
      endDate: '2024-08-15',
      progress: 0,
      assignedTo: 'Jane Smith',
      tasksCount: 25,
      completedTasks: 0,
    },
  ]);

  // Mock burndown data (points completed over time)
  const [burndownData] = useState([
    { date: '2024-01-15', planned: 100, actual: 100 },
    { date: '2024-02-01', planned: 90, actual: 95 },
    { date: '2024-02-15', planned: 80, actual: 88 },
    { date: '2024-03-01', planned: 70, actual: 75 },
    { date: '2024-03-15', planned: 60, actual: 65 },
    { date: '2024-04-01', planned: 50, actual: 52 },
    { date: '2024-04-15', planned: 40, actual: 40 },
    { date: '2024-05-01', planned: 30, actual: 28 },
    { date: '2024-05-15', planned: 20, actual: 22 },
    { date: '2024-06-01', planned: 15, actual: 18 },
    { date: '2024-06-15', planned: 10, actual: 15 },
    { date: '2024-07-01', planned: 5, actual: 10 },
    { date: '2024-07-15', planned: 2, actual: 5 },
    { date: '2024-08-01', planned: 1, actual: 2 },
    { date: '2024-08-15', planned: 0, actual: 0 },
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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

  // Calculate project statistics
  const projectStats = useMemo(() => {
    const totalTasks = features.reduce((sum, feature) => sum + feature.tasksCount, 0);
    const completedTasks = features.reduce((sum, feature) => sum + feature.completedTasks, 0);
    const completedFeatures = features.filter(f => f.status === 'Done').length;
    const inProgressFeatures = features.filter(f => f.status === 'In Progress').length;
    const pendingFeatures = features.filter(f => f.status === 'To Do').length;

    return {
      totalTasks,
      completedTasks,
      completedFeatures,
      inProgressFeatures,
      pendingFeatures,
      totalFeatures: features.length,
    };
  }, [features]);

  // Burndown Chart Component
  const BurndownChart = () => {
    const maxValue = Math.max(...burndownData.map(d => Math.max(d.planned, d.actual)));
    const chartHeight = 300;
    const chartWidth = 600;
    const padding = 40;

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <VStack spacing={6}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="md">Burndown Chart</Heading>
                <Text color="gray.500" fontSize="sm">
                  Track project completion over time
                </Text>
              </VStack>
              <HStack spacing={4}>
                <HStack>
                  <Box w={3} h={3} bg="blue.500" borderRadius="full" />
                  <Text fontSize="sm">Planned</Text>
                </HStack>
                <HStack>
                  <Box w={3} h={3} bg="green.500" borderRadius="full" />
                  <Text fontSize="sm">Actual</Text>
                </HStack>
              </HStack>
            </HStack>

            {/* SVG Chart */}
            <Box w="full" overflowX="auto">
              <svg width={chartWidth} height={chartHeight + padding * 2}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(value => (
                  <g key={value}>
                    <line
                      x1={padding}
                      y1={padding + (chartHeight * (100 - value)) / 100}
                      x2={chartWidth - padding}
                      y2={padding + (chartHeight * (100 - value)) / 100}
                      stroke={useColorModeValue('#E2E8F0', '#4A5568')}
                      strokeDasharray="2,2"
                    />
                    <text
                      x={padding - 10}
                      y={padding + (chartHeight * (100 - value)) / 100 + 5}
                      fontSize="12"
                      fill={useColorModeValue('#718096', '#A0AEC0')}
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  </g>
                ))}

                {/* Planned line */}
                <polyline
                  points={burndownData.map((d, i) => 
                    `${padding + (i * (chartWidth - 2 * padding)) / (burndownData.length - 1)},${
                      padding + (chartHeight * (100 - d.planned)) / 100
                    }`
                  ).join(' ')}
                  fill="none"
                  stroke="#3182CE"
                  strokeWidth="2"
                />

                {/* Actual line */}
                <polyline
                  points={burndownData.map((d, i) => 
                    `${padding + (i * (chartWidth - 2 * padding)) / (burndownData.length - 1)},${
                      padding + (chartHeight * (100 - d.actual)) / 100
                    }`
                  ).join(' ')}
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="2"
                />

                {/* Data points */}
                {burndownData.map((d, i) => (
                  <g key={i}>
                    <circle
                      cx={padding + (i * (chartWidth - 2 * padding)) / (burndownData.length - 1)}
                      cy={padding + (chartHeight * (100 - d.planned)) / 100}
                      r="3"
                      fill="#3182CE"
                    />
                    <circle
                      cx={padding + (i * (chartWidth - 2 * padding)) / (burndownData.length - 1)}
                      cy={padding + (chartHeight * (100 - d.actual)) / 100}
                      r="3"
                      fill="#38A169"
                    />
                  </g>
                ))}

                {/* X-axis labels */}
                {burndownData.filter((_, i) => i % 3 === 0).map((d, i) => {
                  const actualIndex = i * 3;
                  return (
                    <text
                      key={actualIndex}
                      x={padding + (actualIndex * (chartWidth - 2 * padding)) / (burndownData.length - 1)}
                      y={chartHeight + padding + 20}
                      fontSize="10"
                      fill={useColorModeValue('#718096', '#A0AEC0')}
                      textAnchor="middle"
                    >
                      {new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </text>
                  );
                })}
              </svg>
            </Box>

            {/* Chart insights */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
              <Stat textAlign="center">
                <StatLabel>Current Velocity</StatLabel>
                <StatNumber color="green.500">
                  {burndownData[burndownData.length - 3]?.actual - burndownData[burndownData.length - 1]?.actual || 0} pts/week
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Remaining Work</StatLabel>
                <StatNumber color="blue.500">
                  {burndownData[burndownData.length - 1]?.actual || 0} points
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Days to Completion</StatLabel>
                <StatNumber color={calculateDaysLeft(project.deadline) < 7 ? 'red.500' : 'gray.500'}>
                  {calculateDaysLeft(project.deadline)} days
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  // Gantt Chart Component
  const GanttChart = () => {
    const chartWidth = 800;
    const rowHeight = 50;
    const chartHeight = features.length * rowHeight;
    const padding = 40;

    const startDate = new Date(project.startDate);
    const endDate = new Date(project.deadline);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const getPositionX = (date) => {
      const targetDate = new Date(date);
      const daysFromStart = Math.ceil((targetDate - startDate) / (1000 * 60 * 60 * 24));
      return padding + (daysFromStart / totalDays) * (chartWidth - 2 * padding);
    };

    const getBarWidth = (start, end) => {
      const startX = getPositionX(start);
      const endX = getPositionX(end);
      return endX - startX;
    };

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <VStack spacing={6}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="md">Gantt Chart</Heading>
                <Text color="gray.500" fontSize="sm">
                  Project timeline and feature dependencies
                </Text>
              </VStack>
              <HStack spacing={4}>
                <Button size="sm" leftIcon={<FaPlay />} colorScheme="green" variant="outline">
                  Start Sprint
                </Button>
                <Button size="sm" leftIcon={<FaEdit />} variant="outline">
                  Edit Timeline
                </Button>
              </HStack>
            </HStack>

            <Box w="full" overflowX="auto">
              <svg width={chartWidth} height={chartHeight + padding * 2}>
                {/* Timeline header */}
                {Array.from({ length: 8 }, (_, i) => {
                  const monthStart = new Date(startDate);
                  monthStart.setMonth(startDate.getMonth() + i);
                  return (
                    <g key={i}>
                      <line
                        x1={getPositionX(monthStart)}
                        y1={padding}
                        x2={getPositionX(monthStart)}
                        y2={chartHeight + padding}
                        stroke={useColorModeValue('#E2E8F0', '#4A5568')}
                        strokeDasharray="2,2"
                      />
                      <text
                        x={getPositionX(monthStart) + 10}
                        y={padding - 10}
                        fontSize="12"
                        fill={useColorModeValue('#718096', '#A0AEC0')}
                      >
                        {monthStart.toLocaleDateString('en', { month: 'short', year: '2-digit' })}
                      </text>
                    </g>
                  );
                })}

                {/* Feature bars */}
                {features.map((feature, index) => {
                  const y = padding + index * rowHeight + rowHeight / 4;
                  const barHeight = rowHeight / 2;
                  const barWidth = getBarWidth(feature.startDate, feature.endDate);
                  const x = getPositionX(feature.startDate);

                  let barColor = '#E2E8F0';
                  if (feature.status === 'Done') barColor = '#38A169';
                  else if (feature.status === 'In Progress') barColor = '#3182CE';
                  else if (feature.status === 'To Do') barColor = '#ED8936';

                  return (
                    <g key={feature.id}>
                      {/* Feature bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={barColor}
                        rx="4"
                      />
                      
                      {/* Progress bar */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth * (feature.progress / 100)}
                        height={barHeight}
                        fill={feature.status === 'Done' ? '#2F855A' : '#2B6CB0'}
                        rx="4"
                      />

                      {/* Feature name */}
                      <text
                        x={padding - 10}
                        y={y + barHeight / 2 + 5}
                        fontSize="12"
                        fill={useColorModeValue('#2D3748', '#F7FAFC')}
                        textAnchor="end"
                      >
                        {feature.name}
                      </text>

                      {/* Progress percentage */}
                      <text
                        x={x + barWidth / 2}
                        y={y + barHeight / 2 + 4}
                        fontSize="10"
                        fill="white"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {feature.progress}%
                      </text>
                    </g>
                  );
                })}

                {/* Today indicator */}
                <line
                  x1={getPositionX(new Date())}
                  y1={padding}
                  x2={getPositionX(new Date())}
                  y2={chartHeight + padding}
                  stroke="#E53E3E"
                  strokeWidth="2"
                />
                <text
                  x={getPositionX(new Date()) + 5}
                  y={padding - 10}
                  fontSize="12"
                  fill="#E53E3E"
                  fontWeight="bold"
                >
                  Today
                </text>
              </svg>
            </Box>

            {/* Gantt insights */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
              <Stat textAlign="center">
                <StatLabel>On Schedule</StatLabel>
                <StatNumber color="green.500">
                  {features.filter(f => f.progress >= 75).length}
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>At Risk</StatLabel>
                <StatNumber color="yellow.500">
                  {features.filter(f => f.progress >= 25 && f.progress < 75).length}
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Behind Schedule</StatLabel>
                <StatNumber color="red.500">
                  {features.filter(f => f.progress < 25 && f.status !== 'To Do').length}
                </StatNumber>
              </Stat>
              <Stat textAlign="center">
                <StatLabel>Critical Path</StatLabel>
                <StatNumber color="purple.500">
                  3 features
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh" p={6} ml="256px">
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack spacing={4} mb={4}>
          <Button
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate('/projects')}
          >
            Back to Projects
          </Button>
          <Divider orientation="vertical" h={6} />
          <HStack>
            <Icon as={FaProjectDiagram} color="blue.500" boxSize={6} />
            <VStack align="start" spacing={0}>
              <Heading size="lg">{project.name}</Heading>
              <Text color="gray.500" fontSize="sm">Project Details & Analytics</Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Project Summary Card */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={6}>
              {/* Project Header */}
              <Flex justify="space-between" align="start" w="full">
                <VStack align="start" spacing={2} flex={1}>
                  <HStack>
                    <Heading size="xl">{project.name}</Heading>
                    <Badge colorScheme={getStatusColor(project.status)} px={3} py={1}>
                      {project.status}
                    </Badge>
                    <Badge colorScheme={getPriorityColor(project.priority)} px={3} py={1}>
                      {project.priority} Priority
                    </Badge>
                  </HStack>
                  <Text color="gray.600" maxW="2xl">
                    {project.description}
                  </Text>
                  <HStack spacing={6} mt={2}>
                    <HStack>
                      <Icon as={FaUser} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">Owner: {project.owner}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(project.startDate)} - {formatDate(project.deadline)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaClock} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {calculateDaysLeft(project.deadline)} days left
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>

                <VStack align="end" spacing={3}>
                  <HStack spacing={2}>
                    <Button size="sm" leftIcon={<FaEdit />} variant="outline">
                      Edit Project
                    </Button>
                    <Button size="sm" leftIcon={<FaUserPlus />} colorScheme="blue" variant="outline">
                      Add Member
                    </Button>
                  </HStack>
                  <AvatarGroup size="sm" max={5}>
                    {project.team.map((member, index) => (
                      <Tooltip key={index} label={`${member.name} - ${member.role}`}>
                        <Avatar name={member.name} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </VStack>
              </Flex>

              {/* Progress Section */}
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold">Overall Progress</Text>
                  <Text fontSize="lg" fontWeight="bold" color={`${getProgressColor(project.progress)}.500`}>
                    {project.progress}%
                  </Text>
                </HStack>
                <Progress 
                  value={project.progress} 
                  colorScheme={getProgressColor(project.progress)} 
                  size="lg" 
                  borderRadius="full"
                />
                <HStack justify="space-between" mt={2} fontSize="sm" color="gray.600">
                  <Text>{projectStats.completedTasks} of {projectStats.totalTasks} tasks completed</Text>
                  <Text>{projectStats.completedFeatures} of {projectStats.totalFeatures} features done</Text>
                </HStack>
              </Box>

              {/* Stats Grid */}
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4} w="full">
                <Stat textAlign="center" bg={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">Total Features</StatLabel>
                  <StatNumber color="blue.500">{projectStats.totalFeatures}</StatNumber>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('green.50', 'green.900')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">Completed</StatLabel>
                  <StatNumber color="green.500">{projectStats.completedFeatures}</StatNumber>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('yellow.50', 'yellow.900')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">In Progress</StatLabel>
                  <StatNumber color="yellow.500">{projectStats.inProgressFeatures}</StatNumber>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('gray.50', 'gray.700')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">Pending</StatLabel>
                  <StatNumber color="gray.500">{projectStats.pendingFeatures}</StatNumber>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('purple.50', 'purple.900')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">Budget Used</StatLabel>
                  <StatNumber color="purple.500">75%</StatNumber>
                </Stat>
                <Stat textAlign="center" bg={useColorModeValue('teal.50', 'teal.900')} p={4} borderRadius="lg">
                  <StatLabel fontSize="xs">Team Size</StatLabel>
                  <StatNumber color="teal.500">{project.team.length}</StatNumber>
                </Stat>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Main Tabs */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody p={0}>
            <Tabs colorScheme="blue" variant="enclosed">
              <TabList>
                <Tab leftIcon={<FaProjectDiagram />}>
                  Overview
                </Tab>
                <Tab leftIcon={<FaBurn />}>
                  Burndown Chart
                </Tab>
                <Tab leftIcon={<FaGanttChart />}>
                  Gantt Chart
                </Tab>
                <Tab leftIcon={<FaUsers />}>
                  Team
                </Tab>
                <Tab leftIcon={<FaTasks />}>
                  Features
                </Tab>
              </TabList>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel>
                  <VStack spacing={6}>
                    {/* Recent Activity */}
                    <Card bg={useColorModeValue('gray.50', 'gray.700')} borderColor={borderColor} w="full">
                      <CardBody>
                        <Heading size="md" mb={4}>Recent Activity</Heading>
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <Icon as={FaCheckCircle} color="green.500" />
                            <Text fontSize="sm">Shopping Cart feature completed by Tom Brown</Text>
                            <Badge size="sm" variant="outline">2 hours ago</Badge>
                          </HStack>
                          <HStack>
                            <Icon as={FaPlay} color="blue.500" />
                            <Text fontSize="sm">Payment Integration started by Sarah Wilson</Text>
                            <Badge size="sm" variant="outline">1 day ago</Badge>
                          </HStack>
                          <HStack>
                            <Icon as={FaUserPlus} color="purple.500" />
                            <Text fontSize="sm">Lisa Chen added to the project team</Text>
                            <Badge size="sm" variant="outline">3 days ago</Badge>
                          </HStack>
                          <HStack>
                            <Icon as={FaEdit} color="yellow.500" />
                            <Text fontSize="sm">Project deadline extended to August 15th</Text>
                            <Badge size="sm" variant="outline">1 week ago</Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Milestones */}
                    <Card bg={useColorModeValue('gray.50', 'gray.700')} borderColor={borderColor} w="full">
                      <CardBody>
                        <Heading size="md" mb={4}>Upcoming Milestones</Heading>
                        <VStack align="stretch" spacing={3}>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FaCalendarCheck} color="blue.500" />
                              <Text fontSize="sm">Payment Integration MVP</Text>
                            </HStack>
                            <Badge colorScheme="blue">May 30, 2024</Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FaCalendarCheck} color="yellow.500" />
                              <Text fontSize="sm">Analytics Dashboard Beta</Text>
                            </HStack>
                            <Badge colorScheme="yellow">July 15, 2024</Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FaCalendarCheck} color="green.500" />
                              <Text fontSize="sm">Project Launch</Text>
                            </HStack>
                            <Badge colorScheme="green">August 15, 2024</Badge>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Risk Assessment */}
                    <Card bg={useColorModeValue('gray.50', 'gray.700')} borderColor={borderColor} w="full">
                      <CardBody>
                        <Heading size="md" mb={4}>Risk Assessment</Heading>
                        <VStack align="stretch" spacing={3}>
                          <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">Payment Integration complexity may cause delays</Text>
                          </Alert>
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">Additional team member needed for mobile development</Text>
                          </Alert>
                          <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">Core features ahead of schedule</Text>
                          </Alert>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Burndown Chart Tab */}
                <TabPanel>
                  <BurndownChart />
                </TabPanel>

                {/* Gantt Chart Tab */}
                <TabPanel>
                  <GanttChart />
                </TabPanel>

                {/* Team Tab */}
                <TabPanel>
                  <Card bg={useColorModeValue('gray.50', 'gray.700')} borderColor={borderColor}>
                    <CardBody>
                      <HStack justify="space-between" mb={6}>
                        <Heading size="md">Team Members</Heading>
                        <Button leftIcon={<FaUserPlus />} colorScheme="blue" size="sm">
                          Add Member
                        </Button>
                      </HStack>
                      
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Member</Th>
                              <Th>Role</Th>
                              <Th>Status</Th>
                              <Th>Workload</Th>
                              <Th>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {project.team.map((member, index) => (
                              <Tr key={index}>
                                <Td>
                                  <HStack>
                                    <Avatar size="sm" name={member.name} />
                                    <Text>{member.name}</Text>
                                  </HStack>
                                </Td>
                                <Td>{member.role}</Td>
                                <Td>
                                  <Badge 
                                    colorScheme={member.status === 'active' ? 'green' : 'gray'}
                                    textTransform="capitalize"
                                  >
                                    {member.status}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Progress 
                                    value={Math.random() * 100} 
                                    size="sm" 
                                    colorScheme="blue" 
                                    borderRadius="full"
                                  />
                                </Td>
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      as={IconButton}
                                      icon={<FaEllipsisV />}
                                      size="sm"
                                      variant="ghost"
                                    />
                                    <MenuList>
                                      <MenuItem icon={<FaEye />}>View Profile</MenuItem>
                                      <MenuItem icon={<FaEdit />}>Edit Role</MenuItem>
                                      <MenuItem icon={<FaTasks />}>Assign Tasks</MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Features Tab */}
                <TabPanel>
                  <VStack spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Heading size="md">Project Features</Heading>
                      <Button leftIcon={<FaPlus />} colorScheme="blue" size="sm">
                        Add Feature
                      </Button>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
                      {features.map((feature) => (
                        <Card key={feature.id} borderColor={borderColor}>
                          <CardBody>
                            <VStack align="stretch" spacing={3}>
                              <HStack justify="space-between">
                                <Heading size="sm">{feature.name}</Heading>
                                <Badge 
                                  colorScheme={
                                    feature.status === 'Done' ? 'green' :
                                    feature.status === 'In Progress' ? 'blue' : 'gray'
                                  }
                                >
                                  {feature.status}
                                </Badge>
                              </HStack>
                              
                              <Text fontSize="sm" color="gray.600">
                                Assigned to: {feature.assignedTo}
                              </Text>
                              
                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="xs" color="gray.500">Progress</Text>
                                  <Text fontSize="xs" color="gray.500">{feature.progress}%</Text>
                                </HStack>
                                <Progress 
                                  value={feature.progress} 
                                  size="sm" 
                                  colorScheme={getProgressColor(feature.progress)}
                                  borderRadius="full"
                                />
                              </Box>
                              
                              <HStack justify="space-between" fontSize="xs" color="gray.500">
                                <Text>Tasks: {feature.completedTasks}/{feature.tasksCount}</Text>
                                <Text>Due: {formatDate(feature.endDate)}</Text>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default ProjectDetailsPage;
