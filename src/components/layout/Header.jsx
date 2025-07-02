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
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import React from 'react';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/projects':
      return 'Projects';
    case '/tasks':
      return 'My Tasks';
    case '/chat':
      return 'Chat';
    case '/settings':
      return 'Settings';
    default:
      return '';
  }
};


const Header = ({ onSidebarToggle }) => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);
    const bgColor = useColorModeValue('gray.100', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} px={4} py={2} shadow="md">
      <Flex align="center">
        {/* Sidebar Toggle Button */}
        {/* <IconButton
          aria-label="Toggle Sidebar"
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onSidebarToggle}
          mr={3}
        /> */}

        {/* 🔄 Show dynamic page title */}
        <Text fontSize="xl" fontWeight="bold">
            {pageTitle}
        </Text>



        <Spacer />
        
        {/* Search Bar */}
        <InputGroup mx={8} maxW="400px">
          <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.500" />} />
          <Input placeholder="Search" variant="filled" />
        </InputGroup>

        {/* Profile Avatar */}
        <Avatar name="Vamshi" src="/profile.jpg" ml={4} />
      </Flex>
    </Box>
  );
};

export default Header;
