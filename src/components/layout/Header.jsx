import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  useColorModeValue,
  HStack,
  Badge,
  Divider,
  Image,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, HamburgerIcon, BellIcon, SettingsIcon } from '@chakra-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/docs':
    case '/documentation':
      return 'Documentation';
    case '/aboutus':
    case '/about':
      return 'About Us';
    case '/contactus':
    case '/contact':
      return 'Contact Us';
    default:
      return 'Documentation';
  }
};

const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  const navigationItems = [
    { name: 'Docs', path: '/docs' },
    { name: 'About Us', path: '/aboutus' },
    { name: 'Contact Us', path: '/contactus' },
  ];

  const { user } = useAuth();
  // Fallbacks for display
  const displayName = user?.displayName || user?.name || user?.email || 'User';
  const avatarUrl = user?.photoURL || user?.avatar || '';
  const role = user?.role || 'Project Manager'; // You may want to fetch role from backend if available

  return (
    <Box 
      bg={bgColor} 
      px={6} 
      py={4} 
      shadow="lg"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1001} // Above sidebar (999)
      borderBottom="1px"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
    >
      <Flex align="center" w="full">
        {/* Sidebar Toggle Button - Only visible on mobile */}
        <IconButton
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onSidebarToggle}
          mr={4}
          aria-label="Toggle Sidebar"
          color={textColor}
          display={{ base: "flex", md: "none" }}
          _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        />

        {/* Logo/Brand */}
        <HStack spacing={3}>
          <Image 
            src={logo} 
            alt="Logo" 
            h="32px" 
            w="auto"
            objectFit="contain"
          />
          <Text 
            fontSize="xl" 
            fontWeight="bold" 
            color={textColor}
            display={{ base: 'none', md: 'block' }}
          >
            ProjectHub
          </Text>
        </HStack>

        <Spacer />

        {/* Navigation Menu */}
        {/* <HStack spacing={3} mr={6} display={{ base: "none", md: "flex" }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              color={location.pathname === item.path ? "blue.500" : textColor}
              fontWeight={location.pathname === item.path ? "bold" : "medium"}
              _hover={{ 
                color: "blue.500",
                bg: useColorModeValue('blue.50', 'blue.900')
              }}
            >
              {item.name}
            </Button>
          ))}
        </HStack> */}
        
        {/* Search Bar */}
        <InputGroup maxW="250px" display={{ base: "none", md: "flex" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color={useColorModeValue('gray.400', 'gray.500')} />
          </InputLeftElement>
          <Input 
            placeholder="Search..." 
            variant="filled" 
            bg={inputBg}
            border="1px"
            borderColor={inputBorderColor}
            color={textColor}
            borderRadius="xl"
            _hover={{ 
              borderColor: useColorModeValue('gray.300', 'gray.500'),
              shadow: "md"
            }}
            _focus={{ 
              borderColor: "blue.500", 
              bg: inputBg,
              shadow: "0 0 0 1px var(--chakra-colors-blue-500)"
            }}
          />
        </InputGroup>

        {/* Search Icon - Mobile only */}
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          variant="ghost"
          color={textColor}
          borderRadius="xl"
          display={{ base: "flex", md: "none" }}
          _hover={{
            bg: useColorModeValue('gray.100', 'gray.700'),
            transform: "translateY(-1px)"
          }}
          transition="all 0.2s ease"
        />

        {/* Right Section */}
        <HStack spacing={4}>
          {/* Notifications */}
          {/* <IconButton
            aria-label="Notifications"
            icon={<BellIcon />}
            variant="ghost"
            color={textColor}
            position="relative"
            borderRadius="xl"
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
              transform: "translateY(-1px)"
            }}
            transition="all 0.2s ease"
          >
            <Badge
              position="absolute"
              top="6px"
              right="6px"
              colorScheme="red"
              borderRadius="full"
              boxSize="8px"
              p={0}
            />
          </IconButton> */}

          

          <Divider orientation="vertical" h="30px" borderColor={borderColor} />

          {/* Profile Menu */}
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              borderRadius="xl"
              p={2}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.700'),
                transform: "translateY(-1px)"
              }}
              _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
              transition="all 0.2s ease"
            >
              <HStack spacing={3}>
                <Avatar 
                  name={displayName}
                  src={avatarUrl}
                  size="sm"
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                />
                <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    {displayName}
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
                    {role}
                  </Text>
                </Box>
                <ChevronDownIcon color={textColor} />
              </HStack>
            </MenuButton>
            <MenuList
              bg={bgColor}
              borderColor={borderColor}
              shadow="xl"
              borderRadius="xl"
              py={2}
            >
              <MenuItem
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                borderRadius="md"
                mx={2}
              >
                Profile Settings
              </MenuItem>
              <MenuItem
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                borderRadius="md"
                mx={2}
              >
                Account Preferences
              </MenuItem>
              <MenuItem
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                borderRadius="md"
                mx={2}
              >
                Help & Support
              </MenuItem>
              <Divider my={2} />
              <MenuItem
                _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                color="red.500"
                borderRadius="md"
                mx={2}
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
