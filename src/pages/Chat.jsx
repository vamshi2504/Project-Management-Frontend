import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  useColorModeValue,
  Container,
  Badge,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaComments, FaTools } from 'react-icons/fa';
import workingInProgress from '../assets/comming_soon.png';

const Chat = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="4xl" centerContent>
        <VStack spacing={8} textAlign="center">
          {/* Header Section */}
          <VStack spacing={4}>
            <HStack spacing={3}>
              <Icon as={FaComments} boxSize={8} color="green.500" />
              <Heading size="2xl" color={textColor}>
                Team Chat
              </Heading>
            </HStack>
            <Text color="gray.500" fontSize="lg" maxW="md">
              Collaborate with your team in real-time conversations
            </Text>
          </VStack>

          {/* Main Content Card */}
          <Box
            bg={cardBg}
            borderRadius="3xl"
            p={12}
            boxShadow="2xl"
            border="1px"
            borderColor={borderColor}
            maxW="lg"
            w="full"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Background */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="4px"
              bgGradient="linear(to-r, green.400, teal.500, blue.400)"
            />

            <VStack spacing={6}>
              {/* Status Badge */}
              <Badge
                colorScheme="teal"
                variant="subtle"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="medium"
              >
                <HStack spacing={2}>
                  <Icon as={FaTools} boxSize={3} />
                  <Text>Under Development</Text>
                </HStack>
              </Badge>

              {/* Image */}
              <Box
                borderRadius="2xl"
                overflow="hidden"
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={6}
              >
                <Image
                  src={workingInProgress}
                  alt="Work in Progress"
                  maxW="300px"
                  maxH="250px"
                  objectFit="contain"
                  mx="auto"
                  fallback={
                    <Box
                      w="300px"
                      h="250px"
                      bg={useColorModeValue('gray.100', 'gray.600')}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="xl"
                    >
                      <VStack spacing={2}>
                        <Icon as={FaTools} boxSize={16} color="gray.400" />
                        <Text color="gray.500" fontSize="sm">
                          Work in Progress
                        </Text>
                      </VStack>
                    </Box>
                  }
                />
              </Box>

              {/* Content */}
              <VStack spacing={4}>
                <Heading size="lg" color={textColor}>
                  Chat Coming Soon!
                </Heading>
                <Text color="gray.500" fontSize="md" lineHeight="1.6" maxW="sm">
                  We're building an amazing chat experience for seamless team collaboration. 
                  Get ready for instant messaging, file sharing, and more!
                </Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Chat