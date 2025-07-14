import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box, useColorModeValue } from '@chakra-ui/react';

const AppLayout = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed by default

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex={999}
          display={{ base: "block", md: "none" }}
          onClick={handleSidebarToggle}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
      
      {/* Header */}
      <Header 
        onSidebarToggle={handleSidebarToggle} 
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Main Content */}
      <Box 
        pl={{ 
          base: "0px", // No padding on mobile - sidebar will overlay
          md: isSidebarOpen ? "256px" : "60px", // Icons width when closed
        }}
        pt="80px" // Account for fixed header height
        minH="100vh"
        transition="padding-left 0.3s ease"
        w="100%"
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
