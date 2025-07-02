import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header'; // if you have one
import { Box } from '@chakra-ui/react';

const AppLayout = ({ children }) => {
  return (
    <Box pl="250px" bg="gray.900" minH="100vh">
      <Header /> {/* Optional */}
      <Box p={6}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
