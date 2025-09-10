import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useUser } from '../hooks/useUser';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import ProjectChat from '../components/chat/ProjectChat';
import { fetchAllProjects } from '../api/projects';

const Chat = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // --- Chat logic ---
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user, loading } = useUser();
  // const { setSelectedGroup } = useChat();
  const sidebarBg = useColorModeValue('white', 'gray.900');
  const sidebarText = useColorModeValue('gray.800', 'white');
  const sidebarActiveBg = useColorModeValue('blue.50', 'gray.800');
  const sidebarActiveColor = useColorModeValue('blue.600', 'blue.300');
  const sidebarHoverBg = useColorModeValue('gray.100', 'gray.700');
  const sidebarBorder = useColorModeValue('gray.200', 'gray.700');
  const chatBg = useColorModeValue('gray.900', 'gray.800');
  const chatText = useColorModeValue('white', 'white');
  // const CHAT_BACKEND_URL = import.meta.env.VITE_REACT_APP_CHAT_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    if (!user || loading) return;
    fetchAllProjects().then((all) => {
      const filtered = all.filter(
        (p) =>
          p.ownerId === user.uid ||
          (Array.isArray(p.teamMembers) && p.teamMembers.some((m) => m.userId === user.uid))
      );
      setProjects(filtered);
      if (filtered.length > 0 && (!selectedProject || !filtered.some(p => p._id === selectedProject._id))) {
        setSelectedProject(filtered[0]);
      }
    });
  }, [user, loading]);

  // Sync selectedProject with ChatContext
  // useEffect(() => {
  //   if (selectedProject && selectedProject.id) {
  //     setSelectedGroup(selectedProject);
  //   }
  // }, [selectedProject, setSelectedGroup]);

  // Remove backend chat token logic
  const hasValidUser = user && user.uid && (user.displayName || user.email);
  const hasProjects = projects && projects.length > 0;
  const hasValidProject = selectedProject && selectedProject.id && selectedProject.name;

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Box minH="60vh">
        <Box maxW="1200px" mx="auto">
          <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
            {/* Sidebar */}
            <Box
              w={{ base: '100%', md: '260px' }}
              bg={sidebarBg}
              color={sidebarText}
              py={8}
              px={0}
              display="flex"
              flexDirection="column"
              borderRadius="2xl"
              m={4}
              boxShadow="md"
              borderWidth="1px"
              borderColor={sidebarBorder}
            >
              <Text fontWeight={600} fontSize={'lg'} mb={6} textAlign="center" letterSpacing={1} color={sidebarText}>
                Your Groups
              </Text>
              <VStack spacing={2} align="stretch" flex={1} overflowY="auto">
                {projects.length === 0 && <Text color="gray.400" textAlign="center">No groups</Text>}
                {projects.map((project, idx) => (
                  <Box
                    key={project._id || project.id || idx}
                    onClick={() => setSelectedProject(project)}
                    px={6}
                    py={3}
                    mx={2}
                    borderRadius="md"
                    bg={selectedProject && selectedProject._id === project._id ? sidebarActiveBg : 'transparent'}
                    color={selectedProject && selectedProject._id === project._id ? sidebarActiveColor : sidebarText}
                    fontWeight={selectedProject && selectedProject._id === project._id ? 700 : 400}
                    cursor="pointer"
                    _hover={{ bg: sidebarHoverBg }}
                    transition="background 0.2s"
                  >
                    <Box>
                      <Text fontSize="md">{project.name}</Text>
                      <Text fontSize="xs" color="gray.400">{project.teamMembers?.length || 1} members</Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
            {/* Chat Window */}
            <Box flex={1} display="flex" alignItems="stretch" justifyContent="center" minW={0}>
              {selectedProject && selectedProject.id && selectedProject.name && Array.isArray(selectedProject.teamMembers) ? (
                <ChatProvider>
                  <ChatWithContextSync
                    selectedProject={selectedProject}
                    navigate={navigate}
                    chatBg={chatBg}
                    chatText={chatText}
                  />
                </ChatProvider>
              ) : (
                <Box m="auto" color="gray.400" fontSize="lg">Select a valid group to start chatting.</Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Helper component to sync context inside provider
function ChatWithContextSync({ selectedProject, navigate, chatBg, chatText }) {
  const { setSelectedGroup } = useChat();
  React.useEffect(() => {
    if (selectedProject && selectedProject.id) {
      setSelectedGroup(selectedProject);
    }
  }, [selectedProject, setSelectedGroup]);
  return (
    <Box w="100%" maxW="900px" mx="auto" bg={chatBg} borderRadius="2xl" boxShadow="md" p={8} minH="600px" display="flex" flexDirection="column">
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: '#4FD1C5', lineHeight: 1 }}>Project: {selectedProject.name}</span>
        <button
          style={{
            background: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(49,130,206,0.08)',
            transition: 'background 0.2s',
            marginLeft: 24,
            lineHeight: 1
          }}
          onClick={() => {
            if (selectedProject && selectedProject.id) {
              navigate(`/videocall/${selectedProject.id}`);
            }
          }}
        >
          Join Video Call
        </button>
      </div>
      <ProjectChat
        key={`project-${selectedProject.id}`}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        members={selectedProject.teamMembers.map((m) => m.userId)}
        chatId={`project-${selectedProject.id}`}
      />
    </Box>
  );
}

export default Chat;