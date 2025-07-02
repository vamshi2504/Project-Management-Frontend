import AnimatedLogo from '@/assets/AnimatedLogo';
import { Box, VStack, Text, Icon, Image, Divider } from '@chakra-ui/react';
import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiMessageSquare,
  FiSettings,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', icon: FiHome, path: '/' },
    { label: 'Projects', icon: FiFolder, path: '/projects' },
    { label: 'My Tasks', icon: FiCheckSquare, path: '/tasks' },
    { label: 'Chat', icon: FiMessageSquare, path: '/chat' },
    { label: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  return (
    <Box
      w="64"
      bg="gray.900"
      color="white"
      h="100vh"
      p="4"
      position="fixed"
      top="0"
      left="0"
      boxShadow="lg"
    >
      <VStack spacing={3} align="center" mb={8}>
        {/* Logo */}
        <AnimatedLogo />
        <Text fontSize="xl" fontWeight="bold">
          Project Manager
        </Text>
      </VStack>

      <Divider borderColor="gray.600" mb={4} />

      <VStack align="stretch" spacing={4}>
        {menuItems.map((item) => (
          <Link to={item.path} key={item.label}>
            <Box
              display="flex"
              alignItems="center"
              gap="4"
              p="2"
              borderRadius="md"
              _hover={{ bg: 'gray.700' }}
              transition="0.2s ease"
            >
              <Icon as={item.icon} boxSize="5" />
              <Text>{item.label}</Text>
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
