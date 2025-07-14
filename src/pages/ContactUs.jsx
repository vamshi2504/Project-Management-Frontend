import React, { useState } from 'react';
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
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Divider,
  Link,
  Badge,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaSlack,
  FaPaperPlane,
  FaHeadset,
  FaBug,
  FaLightbulb,
} from 'react-icons/fa';

const ContactUs = () => {
  const toast = useToast();
  
  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: 'support@promanager.com',
      description: 'Send us an email anytime',
      color: 'blue.400'
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST',
      color: 'green.400'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: '123 Tech Street, San Francisco, CA 94105',
      description: 'Our headquarters',
      color: 'red.400'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: 'Monday - Friday: 9AM - 6PM EST',
      description: 'We respond within 24 hours',
      color: 'orange.400'
    }
  ];

  const socialLinks = [
    { icon: FaTwitter, name: 'Twitter', url: '#', color: 'twitter' },
    { icon: FaLinkedin, name: 'LinkedIn', url: '#', color: 'linkedin' },
    { icon: FaGithub, name: 'GitHub', url: '#', color: 'gray' },
    { icon: FaSlack, name: 'Slack', url: '#', color: 'purple' }
  ];

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: FaHeadset },
    { value: 'technical', label: 'Technical Support', icon: FaBug },
    { value: 'feature', label: 'Feature Request', icon: FaLightbulb },
    { value: 'billing', label: 'Billing Question', icon: FaEnvelope }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={8} maxW="1200px" mx="auto">
        {/* Header */}
        <VStack spacing={4} textAlign="center" py={8}>
          <Icon as={FaEnvelope} color="blue.400" boxSize={12} />
          <Heading size="2xl" color="white">
            Contact Us
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="600px">
            Have questions or need support? We're here to help! Reach out to us through any of the channels below.
          </Text>
        </VStack>

        {/* Contact Information */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {contactInfo.map((info, index) => (
            <Card key={index} bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody textAlign="center" p={6}>
                <Icon as={info.icon} color={info.color} boxSize={8} mb={4} />
                <Text color="white" fontWeight="bold" mb={2}>
                  {info.title}
                </Text>
                <Text color="gray.300" fontSize="sm" mb={1}>
                  {info.details}
                </Text>
                <Text color="gray.500" fontSize="xs">
                  {info.description}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Contact Form */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack spacing={3}>
                <Icon as={FaPaperPlane} color="blue.400" boxSize={6} />
                <Heading size="lg" color="white">Send us a Message</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl isRequired>
                      <FormLabel color="gray.300" fontSize="sm">Your Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.300" fontSize="sm">Email Address</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl>
                      <FormLabel color="gray.300" fontSize="sm">Subject</FormLabel>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief subject line"
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color="gray.300" fontSize="sm">Category</FormLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        bg="gray.700"
                        borderColor="gray.600"
                        color="white"
                        _hover={{ borderColor: "gray.500" }}
                        _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      >
                        {supportCategories.map((category) => (
                          <option 
                            key={category.value} 
                            value={category.value}
                            style={{ backgroundColor: '#2D3748' }}
                          >
                            {category.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel color="gray.300" fontSize="sm">Message</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      bg="gray.700"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "gray.500" }}
                      _focus={{ borderColor: "blue.500", bg: "gray.700" }}
                      resize="vertical"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<FaPaperPlane />}
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    w="full"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                    transition="all 0.2s"
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Additional Information */}
          <VStack spacing={6}>
            {/* Support Categories */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} w="full">
              <CardHeader>
                <HStack spacing={3}>
                  <Icon as={FaHeadset} color="green.400" boxSize={6} />
                  <Heading size="md" color="white">Support Categories</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  {supportCategories.map((category, index) => (
                    <HStack 
                      key={index} 
                      spacing={3} 
                      p={3} 
                      bg="gray.700" 
                      borderRadius="lg"
                      w="full"
                    >
                      <Icon as={category.icon} color="blue.400" boxSize={5} />
                      <Text color="white" fontWeight="medium">
                        {category.label}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Social Links */}
            <Card bg={cardBg} border="1px" borderColor={borderColor} w="full">
              <CardHeader>
                <Heading size="md" color="white">Connect With Us</Heading>
              </CardHeader>
              <CardBody>
                <Text color="gray.400" mb={4} fontSize="sm">
                  Follow us on social media for updates and community discussions:
                </Text>
                <SimpleGrid columns={2} spacing={3}>
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      isExternal
                      _hover={{ textDecoration: 'none' }}
                    >
                      <HStack
                        spacing={3}
                        p={3}
                        bg="gray.700"
                        borderRadius="lg"
                        _hover={{ bg: "gray.600", transform: 'translateY(-2px)' }}
                        transition="all 0.2s"
                      >
                        <Icon as={social.icon} color={`${social.color}.400`} boxSize={5} />
                        <Text color="white" fontSize="sm">
                          {social.name}
                        </Text>
                      </HStack>
                    </Link>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Response Time */}
            <Alert 
              status="info" 
              bg="blue.900" 
              border="1px" 
              borderColor="blue.700" 
              borderRadius="lg"
            >
              <AlertIcon color="blue.400" />
              <VStack align="start" spacing={1}>
                <Text color="blue.100" fontWeight="bold" fontSize="sm">
                  Response Time
                </Text>
                <Text color="blue.200" fontSize="xs">
                  We typically respond to all inquiries within 24 hours during business days.
                </Text>
              </VStack>
            </Alert>
          </VStack>
        </SimpleGrid>

        {/* FAQ Quick Links */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <Text color="white" fontWeight="bold">
                Before contacting us, you might find your answer in our:
              </Text>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<Icon as={FaBug} />}
                >
                  Bug Reports
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  size="sm"
                  leftIcon={<Icon as={FaLightbulb} />}
                >
                  Feature Requests
                </Button>
                <Button
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                  leftIcon={<Icon as={FaHeadset} />}
                >
                  Help Center
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default ContactUs;
