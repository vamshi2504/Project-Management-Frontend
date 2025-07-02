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
} from '@chakra-ui/react';
import {
  FaTasks,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
} from 'react-icons/fa';

const Dashboard = () => {
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

  const projects = [
    { name: 'E-commerce Platform', progress: 85, members: 4, deadline: '2 days' },
    { name: 'Mobile App Development', progress: 62, members: 6, deadline: '1 week' },
    { name: 'UI/UX Redesign', progress: 40, members: 3, deadline: '3 weeks' },
  ];

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
            <Box key={index}>
              <Flex justify="space-between" align="center" mb={3}>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold" color={textColor}>
                    {project.name}
                  </Text>
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
                  </HStack>
                </VStack>
                <VStack align="end" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color={textColor}>
                    {project.progress}%
                  </Text>
                  <AvatarGroup size="sm" max={3}>
                    <Avatar name="User 1" src="" />
                    <Avatar name="User 2" src="" />
                    <Avatar name="User 3" src="" />
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

      {/* Recent Activity */}
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
      </Box>
    </Box>
  );
};

export default Dashboard;
