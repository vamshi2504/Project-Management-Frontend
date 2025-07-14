import { Box, VStack, Text, Icon, Image, Divider, Button, useToast, useColorModeValue, Tooltip } from '@chakra-ui/react';
import logo from '../../assets/logo.png'; 
import {
  FiHome,
  FiFolder,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiTrello,
  FiCalendar,
  FiBook,
  FiInfo,
  FiMail,
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'gray.800');
  const activeColor = useColorModeValue('blue.600', 'blue.300');

  const menuItems = [
    { label: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { label: 'Projects', icon: FiFolder, path: '/projects' },
    { label: 'Board', icon: FiTrello, path: '/board' },
    { label: 'Calendar', icon: FiCalendar, path: '/calendar' },
    { label: 'Chat', icon: FiMessageSquare, path: '/chat' },
    { label: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  // Navigation items that appear in sidebar on mobile only
  const navigationItems = [
    { label: 'Docs', icon: FiBook, path: '/docs', mobileOnly: true },
    { label: 'About Us', icon: FiInfo, path: '/aboutus', mobileOnly: true },
    { label: 'Contact Us', icon: FiMail, path: '/contactus', mobileOnly: true },
  ];

  // Combine menu items with navigation items for mobile
  const allMenuItems = [...menuItems, ...navigationItems];

  const handleLogout = () => {
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Box
      w={isOpen ? "256px" : { base: "0px", md: "60px" }} // Show icons on desktop when closed
      bg={bgColor}
      color={textColor}
      h="calc(100vh - 80px)" // Subtract header height
      p={isOpen ? "6" : { base: "0", md: "3" }} // Padding for icons on desktop
      position="fixed"
      top="80px" // Start below header (header height is approximately 80px)
      left="0"
      boxShadow={isOpen ? "xl" : { base: "none", md: "md" }}
      display="flex"
      flexDirection="column"
      borderRight={isOpen || !isOpen ? "1px solid" : "none"}
      borderColor={borderColor}
      zIndex={999} // Lower than header (1001)
      transition="all 0.3s ease"
      overflow="hidden"
      transform={{
        base: isOpen ? "translateX(0)" : "translateX(-100%)", // Slide in/out on mobile
        md: "translateX(0)" // Always visible on desktop
      }}
    >
      {/* Always show content on desktop, conditional on mobile */}
      <Box display={{ base: isOpen ? "block" : "none", md: "block" }}>
        {/* Close button for mobile only */}
        {isOpen && (
          <Box 
            display={{ base: "flex", md: "none" }} 
            justifyContent="flex-end" 
            mb={4}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggle}
              color={textColor}
              _hover={{ bg: hoverBg }}
            >
              ✕
            </Button>
          </Box>
        )}

        <VStack spacing={3} align="center" mb={8}>
          {/* Logo */}
          <Image
            src={logo}
            alt="Logo"
            boxSize={isOpen ? "50px" : { base: "50px", md: "35px" }}
            objectFit="cover"
            mb={isOpen ? 2 : { base: 2, md: 0 }}
            transition="all 0.3s ease"
          />
          {isOpen && (
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              ProjectHub
            </Text>
          )}
        </VStack>

        <Divider borderColor={borderColor} mb={4} />

        <VStack align="stretch" spacing={2}>
          {allMenuItems.map((item) => {
            const isActive = isActiveRoute(item.path);
            
            // Hide mobile-only items on larger screens
            if (item.mobileOnly) {
              return (
                <Box key={item.label} display={{ base: "block", md: "none" }}>
                  <Tooltip
                    label={item.label}
                    placement="right"
                    isDisabled={isOpen}
                  >
                    <Link to={item.path}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={isOpen ? "4" : "0"}
                        p="3"
                        borderRadius="xl"
                        bg={isActive ? activeBg : "transparent"}
                        color={isActive ? activeColor : textColor}
                        cursor="pointer"
                        transition="all 0.3s ease"
                        justifyContent={isOpen ? "flex-start" : "center"}
                        _hover={{
                          bg: isActive ? activeBg : hoverBg,
                          transform: "translateY(-1px)",
                        }}
                      >
                        <Icon as={item.icon} boxSize={5} />
                        {isOpen && (
                          <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"}>
                            {item.label}
                          </Text>
                        )}
                      </Box>
                    </Link>
                  </Tooltip>
                </Box>
              );
            }

            // Regular menu items (always visible)
            return (
              <Tooltip
                key={item.label}
                label={item.label}
                placement="right"
                isDisabled={isOpen}
              >
                <Link to={item.path}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={isOpen ? "4" : "0"}
                    p="3"
                    borderRadius="xl"
                    bg={isActive ? activeBg : 'transparent'}
                    color={isActive ? activeColor : textColor}
                    justifyContent={isOpen ? 'flex-start' : 'center'}
                    _hover={{ 
                      bg: isActive ? activeBg : hoverBg,
                      transform: isOpen ? 'translateX(4px)' : 'scale(1.1)',
                      shadow: 'md'
                    }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                    position="relative"
                    border="2px solid"
                    borderColor={isActive ? activeColor : 'transparent'}
                  >
                    <Icon 
                      as={item.icon} 
                      boxSize="5" 
                      color={isActive ? activeColor : 'inherit'}
                    />
                    {isOpen && (
                      <Text 
                        fontWeight={isActive ? "bold" : "medium"}
                        fontSize="sm"
                      >
                        {item.label}
                      </Text>
                    )}
                  </Box>
                </Link>
              </Tooltip>
            );
          })}
        </VStack>
      </Box>

      {/* Logout Button at Bottom */}
      <Box 
        mt="auto" 
        pt={6}
        display={{ base: isOpen ? "block" : "none", md: "block" }}
      >
        <Divider borderColor={borderColor} mb={4} />
        <Tooltip label="Logout" placement="right" isDisabled={isOpen}>
          <Button
            variant="ghost"
            leftIcon={isOpen ? <Icon as={FiLogOut} /> : undefined}
            onClick={handleLogout}
            w="full"
            justifyContent={isOpen ? "flex-start" : "center"}
            color={useColorModeValue('gray.600', 'gray.300')}
            size={isOpen ? "md" : "sm"}
            _hover={{ 
              bg: useColorModeValue('red.50', 'red.900'), 
              color: useColorModeValue('red.600', 'red.300'),
              transform: isOpen ? 'translateX(2px)' : 'scale(1.05)'
            }}
            _active={{ bg: useColorModeValue('red.100', 'red.800') }}
            transition="all 0.2s ease"
            borderRadius="xl"
          >
            {!isOpen ? <Icon as={FiLogOut} /> : "Logout"}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
