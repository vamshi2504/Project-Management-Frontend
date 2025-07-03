import { Box, VStack, Text, Icon, Image, Divider, Button, useToast } from '@chakra-ui/react';
import logo from '../../assets/logo.png'; 
import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const menuItems = [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { label: 'Projects', icon: FiFolder, path: '/projects' },
    { label: 'My Tasks', icon: FiCheckSquare, path: '/tasks' },
    { label: 'Chat', icon: FiMessageSquare, path: '/chat' },
    { label: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  const handleLogout = () => {
    // Show logout confirmation toast
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

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
      display="flex"
      flexDirection="column"
    >
      <Box>
        <VStack spacing={3} align="center" mb={8}>
          {/* Logo */}
          <Image
            src={logo}
            alt="Logo"
            boxSize="50px"
            objectFit="cover"
            mb={2}
          />
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

      {/* Logout Button at Bottom */}
      <Box mt="auto" pt={6}>
        <Divider borderColor="gray.600" mb={4} />
        <Button
          variant="ghost"
          leftIcon={<Icon as={FiLogOut} />}
          onClick={handleLogout}
          w="full"
          justifyContent="flex-start"
          color="gray.300"
          _hover={{ 
            bg: 'red.900', 
            color: 'red.300',
            transform: 'translateX(2px)'
          }}
          _active={{ bg: 'red.800' }}
          transition="all 0.2s ease"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
