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
  Avatar,
  Badge,
  Divider,
  Button,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Image,
  Link,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaAward,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHeart,
  FaCode,
  FaDesktop,
  FaMobile,
  FaCloud,
  FaShieldAlt,
  FaChartLine,
  FaGlobe,
  FaStar,
} from 'react-icons/fa';

const AboutUs = () => {
  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      avatar: 'Alex Johnson',
      bio: 'Visionary leader with 10+ years in project management and team collaboration.',
      skills: ['Leadership', 'Strategy', 'Product Vision'],
      social: { github: '#', linkedin: '#', twitter: '#' }
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      avatar: 'Sarah Chen',
      bio: 'Full-stack engineer passionate about building scalable, user-friendly applications.',
      skills: ['React', 'Node.js', 'Cloud Architecture'],
      social: { github: '#', linkedin: '#' }
    },
    {
      name: 'Mike Rodriguez',
      role: 'Lead Designer',
      avatar: 'Mike Rodriguez',
      bio: 'UX/UI designer focused on creating intuitive and beautiful user experiences.',
      skills: ['UI/UX Design', 'Prototyping', 'User Research'],
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Emma Davis',
      role: 'Product Manager',
      avatar: 'Emma Davis',
      bio: 'Product strategist who bridges the gap between user needs and technical solutions.',
      skills: ['Product Strategy', 'Analytics', 'User Stories'],
      social: { linkedin: '#' }
    }
  ];

  const companyStats = [
    { label: 'Happy Users', value: '10,000+', icon: FaUsers, color: 'blue' },
    { label: 'Projects Managed', value: '50,000+', icon: FaRocket, color: 'green' },
    { label: 'Team Members', value: '25+', icon: FaHeart, color: 'red' },
    { label: 'Countries', value: '15+', icon: FaGlobe, color: 'purple' }
  ];

  const technologies = [
    { name: 'React', icon: FaCode, description: 'Modern frontend framework' },
    { name: 'Node.js', icon: FaDesktop, description: 'Backend runtime environment' },
    { name: 'Mobile Ready', icon: FaMobile, description: 'Responsive across all devices' },
    { name: 'Cloud Hosted', icon: FaCloud, description: 'Scalable cloud infrastructure' },
    { name: 'Secure', icon: FaShieldAlt, description: 'Enterprise-grade security' },
    { name: 'Analytics', icon: FaChartLine, description: 'Advanced reporting & insights' }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to simplify project management for teams worldwide.'
    },
    {
      year: '2021',
      title: 'First 1000 Users',
      description: 'Reached our first major milestone with rapid user adoption.'
    },
    {
      year: '2022',
      title: 'Enterprise Launch',
      description: 'Launched enterprise features and gained Fortune 500 clients.'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded operations to serve teams in over 15 countries.'
    },
    {
      year: '2024',
      title: 'Innovation Award',
      description: 'Recognized as the most innovative project management solution.'
    }
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={8} maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={4} textAlign="center" py={8}>
          <Icon as={FaUsers} color="blue.400" boxSize={12} />
          <Heading size="2xl" color="white">
            About Us
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="600px">
            We're a passionate team dedicated to revolutionizing how teams collaborate and manage projects.
          </Text>
        </VStack>

        {/* Mission Statement */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody p={8} textAlign="center">
            <Icon as={FaLightbulb} color="yellow.400" boxSize={10} mb={4} />
            <Heading size="lg" color="white" mb={4}>
              Our Mission
            </Heading>
            <Text color="gray.300" fontSize="lg" lineHeight="1.8" maxW="800px" mx="auto">
              To empower teams around the world with intuitive, powerful project management tools that 
              make collaboration seamless and productivity effortless. We believe that great projects 
              start with great teamwork.
            </Text>
          </CardBody>
        </Card>

        {/* Company Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          {companyStats.map((stat, index) => (
            <Card key={index} bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody textAlign="center" p={6}>
                <Icon as={stat.icon} color={`${stat.color}.400`} boxSize={8} mb={3} />
                <Stat>
                  <StatNumber color="white" fontSize="2xl">
                    {stat.value}
                  </StatNumber>
                  <StatLabel color="gray.400" fontSize="sm">
                    {stat.label}
                  </StatLabel>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Team Section */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaUsers} color="blue.400" boxSize={6} />
              <Heading size="lg" color="white">Meet Our Team</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {teamMembers.map((member, index) => (
                <Card key={index} bg="gray.700" border="1px" borderColor="gray.600">
                  <CardBody p={6}>
                    <VStack spacing={4}>
                      <Avatar 
                        name={member.name} 
                        size="xl" 
                        bg="blue.500"
                      />
                      <VStack spacing={1} textAlign="center">
                        <Text color="white" fontWeight="bold" fontSize="lg">
                          {member.name}
                        </Text>
                        <Badge colorScheme="blue" borderRadius="full" px={3}>
                          {member.role}
                        </Badge>
                      </VStack>
                      <Text color="gray.300" fontSize="sm" textAlign="center">
                        {member.bio}
                      </Text>
                      <HStack spacing={2} flexWrap="wrap" justify="center">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex}
                            variant="outline" 
                            colorScheme="gray"
                            fontSize="xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                      <HStack spacing={3}>
                        {member.social.github && (
                          <Link href={member.social.github} isExternal>
                            <Icon as={FaGithub} color="gray.400" boxSize={5} _hover={{ color: "white" }} />
                          </Link>
                        )}
                        {member.social.linkedin && (
                          <Link href={member.social.linkedin} isExternal>
                            <Icon as={FaLinkedin} color="gray.400" boxSize={5} _hover={{ color: "blue.400" }} />
                          </Link>
                        )}
                        {member.social.twitter && (
                          <Link href={member.social.twitter} isExternal>
                            <Icon as={FaTwitter} color="gray.400" boxSize={5} _hover={{ color: "blue.400" }} />
                          </Link>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Technology Stack */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaCode} color="green.400" boxSize={6} />
              <Heading size="lg" color="white">Our Technology</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Text color="gray.400" mb={6} textAlign="center">
              Built with modern technologies for reliability, scalability, and performance.
            </Text>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
              {technologies.map((tech, index) => (
                <VStack 
                  key={index} 
                  spacing={3} 
                  p={4} 
                  bg="gray.700" 
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Icon as={tech.icon} color="blue.400" boxSize={8} />
                  <Text color="white" fontWeight="bold">
                    {tech.name}
                  </Text>
                  <Text color="gray.400" fontSize="sm">
                    {tech.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Company Timeline */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaAward} color="purple.400" boxSize={6} />
              <Heading size="lg" color="white">Our Journey</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {milestones.map((milestone, index) => (
                <HStack key={index} spacing={6} align="start">
                  <VStack spacing={1} minW="80px">
                    <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                      {milestone.year}
                    </Badge>
                    {index < milestones.length - 1 && (
                      <Box w="2px" h="60px" bg="gray.600" />
                    )}
                  </VStack>
                  <VStack align="start" spacing={2} flex={1}>
                    <Text color="white" fontWeight="bold" fontSize="lg">
                      {milestone.title}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      {milestone.description}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Values */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody textAlign="center" p={6}>
              <Icon as={FaHeart} color="red.400" boxSize={8} mb={4} />
              <Heading size="md" color="white" mb={3}>
                User-Centric
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Every feature we build starts with understanding our users' needs and challenges.
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody textAlign="center" p={6}>
              <Icon as={FaStar} color="yellow.400" boxSize={8} mb={4} />
              <Heading size="md" color="white" mb={3}>
                Excellence
              </Heading>
              <Text color="gray.400" fontSize="sm">
                We strive for excellence in everything we do, from code quality to customer support.
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody textAlign="center" p={6}>
              <Icon as={FaRocket} color="blue.400" boxSize={8} mb={4} />
              <Heading size="md" color="white" mb={3}>
                Innovation
              </Heading>
              <Text color="gray.400" fontSize="sm">
                We constantly innovate to stay ahead of the curve and deliver cutting-edge solutions.
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Call to Action */}
        <Card bg="blue.900" border="1px" borderColor="blue.700">
          <CardBody textAlign="center" p={8}>
            <Icon as={FaRocket} color="blue.400" boxSize={10} mb={4} />
            <Heading size="lg" color="white" mb={4}>
              Ready to Join Our Journey?
            </Heading>
            <Text color="blue.200" mb={6} maxW="600px" mx="auto">
              Whether you're looking to streamline your team's workflow or want to be part of our growing team, 
              we'd love to hear from you.
            </Text>
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button colorScheme="blue" size="lg" leftIcon={<FaUsers />}>
                Get Started
              </Button>
              <Button 
                variant="outline" 
                colorScheme="blue" 
                size="lg"
                borderColor="blue.400"
                color="blue.400"
                _hover={{ bg: "blue.800", borderColor: "blue.300" }}
              >
                Join Our Team
              </Button>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default AboutUs;
