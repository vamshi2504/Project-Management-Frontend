import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Icon,
  Badge,
  Divider,
  Button,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Alert,
  AlertIcon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  FaBook,
  FaRocket,
  FaCode,
  FaCog,
  FaQuestionCircle,
  FaPlay,
  FaDownload,
  FaGithub,
  FaCheckCircle,
  FaLightbulb,
  FaTools,
  FaUsers,
} from 'react-icons/fa';

const Documentation = () => {
  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const quickStartSteps = [
    {
      title: 'Installation',
      description: 'Install the project dependencies',
      code: 'npm install'
    },
    {
      title: 'Development',
      description: 'Start the development server',
      code: 'npm start'
    },
    {
      title: 'Build',
      description: 'Create production build',
      code: 'npm run build'
    },
    {
      title: 'Test',
      description: 'Run the test suite',
      code: 'npm test'
    }
  ];

  const features = [
    {
      icon: FaRocket,
      title: 'Fast Performance',
      description: 'Optimized for speed with modern React patterns and efficient state management.'
    },
    {
      icon: FaCode,
      title: 'Modern Stack',
      description: 'Built with React 18, Chakra UI, and the latest development tools.'
    },
    {
      icon: FaCog,
      title: 'Configurable',
      description: 'Highly customizable components and themes to match your needs.'
    },
    {
      icon: FaUsers,
      title: 'Team Collaboration',
      description: 'Built-in features for team management and project collaboration.'
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/projects',
      description: 'Retrieve all projects'
    },
    {
      method: 'POST',
      endpoint: '/api/projects',
      description: 'Create a new project'
    },
    {
      method: 'GET',
      endpoint: '/api/projects/:id',
      description: 'Get project by ID'
    },
    {
      method: 'PUT',
      endpoint: '/api/projects/:id',
      description: 'Update project'
    },
    {
      method: 'DELETE',
      endpoint: '/api/projects/:id',
      description: 'Delete project'
    }
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={8} maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={4} textAlign="center" py={8}>
          <Icon as={FaBook} color="blue.400" boxSize={12} />
          <Heading size="2xl" color="white">
            Documentation
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="600px">
            Everything you need to know about using and developing with our project management platform.
          </Text>
        </VStack>

        {/* Quick Start */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaRocket} color="green.400" boxSize={6} />
              <Heading size="lg" color="white">Quick Start</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Text color="gray.400" mb={6}>
              Get up and running with the project in just a few steps:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {quickStartSteps.map((step, index) => (
                <Box key={index}>
                  <HStack spacing={3} mb={3}>
                    <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                      {index + 1}
                    </Badge>
                    <Text color="white" fontWeight="bold">
                      {step.title}
                    </Text>
                  </HStack>
                  <Text color="gray.400" mb={3} fontSize="sm">
                    {step.description}
                  </Text>
                  <Code 
                    p={3} 
                    borderRadius="md" 
                    bg="gray.700" 
                    color="green.300"
                    display="block"
                    fontFamily="mono"
                  >
                    {step.code}
                  </Code>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Features */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaLightbulb} color="yellow.400" boxSize={6} />
              <Heading size="lg" color="white">Key Features</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {features.map((feature, index) => (
                <HStack key={index} spacing={4} align="start">
                  <Icon 
                    as={feature.icon} 
                    color="blue.400" 
                    boxSize={6}
                    mt={1}
                  />
                  <VStack align="start" spacing={1}>
                    <Text color="white" fontWeight="bold">
                      {feature.title}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      {feature.description}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* API Documentation */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaCode} color="purple.400" boxSize={6} />
              <Heading size="lg" color="white">API Reference</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Text color="gray.400" mb={6}>
              RESTful API endpoints for project management operations:
            </Text>
            <VStack spacing={4} align="stretch">
              {apiEndpoints.map((api, index) => (
                <Box 
                  key={index}
                  p={4}
                  bg="gray.700"
                  borderRadius="lg"
                  border="1px"
                  borderColor="gray.600"
                >
                  <HStack spacing={3} mb={2}>
                    <Badge 
                      colorScheme={
                        api.method === 'GET' ? 'green' :
                        api.method === 'POST' ? 'blue' :
                        api.method === 'PUT' ? 'orange' :
                        'red'
                      }
                      borderRadius="md"
                      px={2}
                      py={1}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {api.method}
                    </Badge>
                    <Code 
                      bg="gray.600" 
                      color="cyan.300"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {api.endpoint}
                    </Code>
                  </HStack>
                  <Text color="gray.300" fontSize="sm">
                    {api.description}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* FAQ */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaQuestionCircle} color="orange.400" boxSize={6} />
              <Heading size="lg" color="white">Frequently Asked Questions</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton 
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  mb={2}
                >
                  <Box flex="1" textAlign="left" color="white">
                    How do I get started with the project?
                  </Box>
                  <AccordionIcon color="gray.400" />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.400">
                  Follow the Quick Start guide above to install dependencies and run the development server. 
                  Make sure you have Node.js 16+ installed on your system.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton 
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  mb={2}
                >
                  <Box flex="1" textAlign="left" color="white">
                    What technologies are used in this project?
                  </Box>
                  <AccordionIcon color="gray.400" />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.400">
                  The project is built with React 18, Chakra UI for components, React Router for navigation, 
                  and various modern development tools for optimal performance.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton 
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  mb={2}
                >
                  <Box flex="1" textAlign="left" color="white">
                    How can I contribute to the project?
                  </Box>
                  <AccordionIcon color="gray.400" />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.400">
                  We welcome contributions! Fork the repository, make your changes, and submit a pull request. 
                  Please follow our coding standards and include tests for new features.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton 
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  mb={2}
                >
                  <Box flex="1" textAlign="left" color="white">
                    Is there mobile support?
                  </Box>
                  <AccordionIcon color="gray.400" />
                </AccordionButton>
                <AccordionPanel pb={4} color="gray.400">
                  Yes! The application is fully responsive and optimized for mobile devices. 
                  All features work seamlessly across desktop, tablet, and mobile platforms.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>

        {/* Additional Resources */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaTools} color="cyan.400" boxSize={6} />
              <Heading size="lg" color="white">Additional Resources</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <VStack spacing={3} align="start">
                <Icon as={FaGithub} color="gray.400" boxSize={8} />
                <Text color="white" fontWeight="bold">Source Code</Text>
                <Text color="gray.400" fontSize="sm">
                  Access the complete source code on GitHub
                </Text>
                <Button 
                  leftIcon={<FaGithub />}
                  colorScheme="gray" 
                  variant="outline"
                  size="sm"
                >
                  View on GitHub
                </Button>
              </VStack>

              <VStack spacing={3} align="start">
                <Icon as={FaPlay} color="green.400" boxSize={8} />
                <Text color="white" fontWeight="bold">Video Tutorials</Text>
                <Text color="gray.400" fontSize="sm">
                  Step-by-step video guides for common tasks
                </Text>
                <Button 
                  leftIcon={<FaPlay />}
                  colorScheme="green" 
                  variant="outline"
                  size="sm"
                >
                  Watch Tutorials
                </Button>
              </VStack>

              <VStack spacing={3} align="start">
                <Icon as={FaDownload} color="blue.400" boxSize={8} />
                <Text color="white" fontWeight="bold">Downloads</Text>
                <Text color="gray.400" fontSize="sm">
                  Get the latest releases and assets
                </Text>
                <Button 
                  leftIcon={<FaDownload />}
                  colorScheme="blue" 
                  variant="outline"
                  size="sm"
                >
                  Download
                </Button>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Support Notice */}
        <Alert status="info" bg="blue.900" border="1px" borderColor="blue.700" borderRadius="lg">
          <AlertIcon color="blue.400" />
          <VStack align="start" spacing={1}>
            <Text color="blue.100" fontWeight="bold">
              Need Help?
            </Text>
            <Text color="blue.200" fontSize="sm">
              If you can't find what you're looking for in this documentation, 
              feel free to reach out through our contact page or create an issue on GitHub.
            </Text>
          </VStack>
        </Alert>
      </VStack>
    </Box>
  );
};

export default Documentation;
