import React, { useState, useMemo, useEffect } from 'react';
import { Box, Heading, VStack, Input, Select, Flex, useColorModeValue, Spinner } from '@chakra-ui/react';
import { fetchAllProjects } from '../api/projects';
import { fetchAllTasks } from '../api/tasks';
import { fetchAllFeatures } from '../api/features';
import { fetchAllStories } from '../api/stories';

const Board = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');


  // State for real data
  const [projectList, setProjectList] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAllProjects(),
      fetchAllTasks(),
      fetchAllFeatures(),
      fetchAllStories()
    ]).then(([projects, tasks, features, stories]) => {
      // Normalize projects
      const projectsNorm = (projects || []).map(p => ({ id: p._id || p.id, name: p.name }));
      setProjectList(projectsNorm);

      // Normalize all items to a common structure and map status to board columns
      const statusToColumn = (status) => {
        if (!status) return 'todo';
        const s = status.toLowerCase();
        if (['todo', 'planning'].includes(s)) return 'todo';
        if (['in_progress', 'inprogress'].includes(s)) return 'inprogress';
        if (['review'].includes(s)) return 'review';
        if (['done', 'completed', 'complete'].includes(s)) return 'done';
        return 'todo';
      };
      const normalize = (item, type) => ({
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        type,
        project: item.project || item.projectId || '',
        status: statusToColumn(item.status),
      });
      const allItems = [
        ...(tasks || []).map(t => normalize(t, 'Task')),
        ...(features || []).map(f => normalize(f, 'Feature')),
        ...(stories || []).map(s => normalize(s, 'Story')),
      ];
      setItems(allItems);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesProject = projectFilter === 'All' || item.project === projectFilter;
      return matchesSearch && matchesType && matchesProject;
    });
  }, [items, searchTerm, typeFilter, projectFilter]);

  // Kanban columns
  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  // Theme colors
  // Dashboard theme colors
  const bgColor = useColorModeValue('#181C2A', '#181C2A');
  const headingColor = useColorModeValue('white', 'white');
  const inputBg = useColorModeValue('#23263A', '#23263A');
  const inputColor = useColorModeValue('gray.100', 'gray.200');
  const cardBg = useColorModeValue('#23263A', '#23263A');
  const kanbanBg = useColorModeValue('#23263A', '#23263A');
  const accentColors = [
    { dot: '#5A6BFF', border: '#5A6BFF', text: '#5A6BFF' }, // To Do
    { dot: '#00C6AE', border: '#00C6AE', text: '#00C6AE' }, // In Progress
    { dot: '#FFB547', border: '#FFB547', text: '#FFB547' }, // Done
  ];

  return (
    <Box mb={10} mt={6} bg={bgColor} minH="100vh" px={{ base: 2, md: 8 }}>
      <VStack spacing={0} align="stretch">
        <Box
          mb={8}
          w="full"
          borderRadius="2xl"
          px={{ base: 4, md: 10 }}
          py={{ base: 6, md: 8 }}
          bgGradient="linear(to-r, purple.600, blue.500, green.500, orange.400)"
          boxShadow="lg"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Heading
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            color="white"
            fontWeight="extrabold"
            mb={2}
            letterSpacing="tight"
            display="flex"
            alignItems="center"
          >
            Project Board
          </Heading>
        </Box>
        <Flex
          gap={4}
          align="center"
          wrap="wrap"
          justify="center"
          bg={useColorModeValue('#20243A', '#20243A')}
          borderRadius="2xl"
          px={{ base: 2, md: 6 }}
          py={4}
          boxShadow="lg"
          mb={8}
        >
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            maxW="300px"
            bg={inputBg}
            color={inputColor}
            borderRadius="lg"
            boxShadow="sm"
            _placeholder={{ color: inputColor, opacity: 0.7 }}
          />
          <Select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            maxW="180px"
            bg={inputBg}
            color={inputColor}
            borderRadius="lg"
            boxShadow="sm"
          >
            <option value="All">All Types</option>
            <option value="Task">Tasks</option>
            <option value="Feature">Features</option>
            <option value="Story">Stories</option>
          </Select>
          <Select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            maxW="200px"
            bg={inputBg}
            color={inputColor}
            borderRadius="lg"
            boxShadow="sm"
          >
            <option value="All">All Projects</option>
            {projectList.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </Select>
        </Flex>
        {/* Kanban Board */}
        {loading ? (
          <Flex mt={8} justify="center" align="center" minH="300px"><Spinner size="xl" /></Flex>
        ) : (
          <Flex mt={8} gap={8} overflowX="auto">
            {columns.map((col, idx) => {
              const colColor = accentColors[idx] || accentColors[0];
              const count = filteredItems.filter(item => item.status === col.id).length;
              return (
                <Box
                  key={col.id}
                  flex="1 1 0"
                  minW="340px"
                  bg={cardBg}
                  borderRadius="2xl"
                  p={6}
                  boxShadow="lg"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  borderTopWidth={6}
                  borderTopColor={colColor.dot}
                >
                  <Flex align="center" mb={6} w="full" justify="space-between">
                    <Flex align="center" gap={2}>
                      <Box w={4} h={4} borderRadius="md" bg={colColor.dot} />
                      <Heading as="h3" fontSize="2xl" color={colColor.dot} fontWeight="extrabold" letterSpacing="tight">
                        {col.title}
                      </Heading>
                    </Flex>
                    <Box bg={useColorModeValue('#23263A','#23263A')} color={colColor.dot} fontWeight="bold" borderRadius="full" px={3} py={1} fontSize="lg">
                      {count}
                    </Box>
                  </Flex>
                  <VStack spacing={3} align="stretch" w="full">
                    {count === 0 ? (
                      <Box
                        bg={useColorModeValue('#23263A','#23263A')}
                        borderRadius="lg"
                        py={10}
                        px={4}
                        textAlign="center"
                        color={colColor.dot}
                        fontSize="xl"
                        fontWeight="medium"
                        borderWidth={2}
                        borderStyle="dashed"
                        borderColor={colColor.dot}
                      >
                        {`No ${col.title.toLowerCase()} features`}
                      </Box>
                    ) : (
                      filteredItems.filter(item => item.status === col.id).map(item => (
                        <Box
                          key={item.id}
                          bg={useColorModeValue('#23263A','#23263A')}
                          borderRadius="lg"
                          p={5}
                          mb={3}
                          boxShadow="md"
                          borderWidth={2}
                          borderColor={colColor.dot}
                          borderStyle="solid"
                          transition="box-shadow 0.2s, border-color 0.2s"
                          _hover={{ boxShadow: 'lg', borderColor: colColor.border }}
                        >
                          <Heading as="h4" size="md" mb={1} color={colColor.dot} fontWeight="bold">
                            {item.title}
                          </Heading>
                          <Box fontSize="sm" color={inputColor} mb={1}>{item.description}</Box>
                          <Box fontSize="sm" color={inputColor}>
                            {item.type} | Project: {projectList.find(p => p.id === item.project)?.name || item.project}
                          </Box>
                        </Box>
                      ))
                    )}
                  </VStack>
                </Box>
              );
            })}
          </Flex>
        )}
      </VStack>
    </Box>
  );
}

export default Board;