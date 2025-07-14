import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  HStack,
  useColorModeValue,
  Heading,
  Badge,
  Avatar,
  AvatarGroup,
  Button,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Card,
  CardHeader,
  CardBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tag,
  TagLabel,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  Checkbox,
} from '@chakra-ui/react';
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaFlag,
  FaTasks,
  FaLayerGroup,
  FaBookOpen,
  FaExchangeAlt,
  FaArrowRight,
  FaCheckCircle,
  FaSpinner,
  FaEye,
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Board = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardContentBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const columnBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const gradientBg = useColorModeValue(
    'linear(135deg, teal.400 0%, blue.400 25%, purple.400 50%, pink.400 75%, orange.400 100%)',
    'linear(135deg, teal.600 0%, blue.600 25%, purple.600 50%, pink.600 75%, orange.600 100%)'
  );

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const navigate = useNavigate();

  // Current user - in a real app, this would come from authentication
  const [currentUser] = useState('John Doe'); // This would be from auth context

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [showOnlyMyItems, setShowOnlyMyItems] = useState(false);

  // Form state for new item
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'Task',
    priority: 'Medium',
    assignee: '',
    project: '',
    dueDate: '',
  });

  // Board data
  const [boardData, setBoardData] = useState({
    'todo': {
      title: 'To Do',
      items: [
        {
          id: '1',
          title: 'User Authentication System',
          description: 'Implement OAuth 2.0 authentication',
          type: 'Feature',
          priority: 'High',
          assignee: 'John Doe',
          project: 'E-commerce Platform',
          dueDate: '2024-07-20',
          tags: ['Backend', 'Security']
        },
        {
          id: '2',
          title: 'Fix login validation bug',
          description: 'Resolve form validation issues',
          type: 'Task',
          priority: 'High',
          assignee: 'Jane Smith',
          project: 'E-commerce Platform',
          dueDate: '2024-07-15',
          tags: ['Bug', 'Frontend']
        },
        {
          id: '3',
          title: 'User can create account',
          description: 'As a user, I want to create an account',
          type: 'Story',
          priority: 'Medium',
          assignee: 'Mike Johnson',
          project: 'E-commerce Platform',
          dueDate: '2024-07-25',
          tags: ['Frontend']
        }
      ]
    },
    'inprogress': {
      title: 'In Progress',
      items: [
        {
          id: '4',
          title: 'Payment Gateway Integration',
          description: 'Integrate Stripe payment system',
          type: 'Feature',
          priority: 'High',
          assignee: 'Sarah Wilson',
          project: 'E-commerce Platform',
          dueDate: '2024-07-18',
          tags: ['Backend', 'Payment']
        },
        {
          id: '5',
          title: 'Update product catalog UI',
          description: 'Redesign product listing page',
          type: 'Task',
          priority: 'Medium',
          assignee: 'Tom Brown',
          project: 'Mobile App',
          dueDate: '2024-07-22',
          tags: ['Frontend', 'UI']
        }
      ]
    },
    'review': {
      title: 'Review',
      items: [
        {
          id: '6',
          title: 'Shopping Cart Feature',
          description: 'Complete shopping cart functionality',
          type: 'Feature',
          priority: 'Medium',
          assignee: 'Alice Davis',
          project: 'E-commerce Platform',
          dueDate: '2024-07-16',
          tags: ['Frontend', 'Cart']
        }
      ]
    },
    'done': {
      title: 'Done',
      items: [
        {
          id: '7',
          title: 'Setup project structure',
          description: 'Initial project setup and configuration',
          type: 'Task',
          priority: 'Low',
          assignee: 'John Doe',
          project: 'Mobile App',
          dueDate: '2024-07-10',
          tags: ['Setup']
        }
      ]
    }
  });

  const projects = ['E-commerce Platform', 'Mobile App', 'UI/UX Redesign'];
  const assignees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown', 'Alice Davis'];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Feature': return FaLayerGroup;
      case 'Task': return FaTasks;
      case 'Story': return FaBookOpen;
      default: return FaTasks;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Feature': return 'blue';
      case 'Task': return 'green';
      case 'Story': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesProject = projectFilter === 'All' || item.project === projectFilter;
      const matchesAssignee = assigneeFilter === 'All' || item.assignee === assigneeFilter;
      const matchesMyItems = !showOnlyMyItems || item.assignee === currentUser;
      
      return matchesSearch && matchesType && matchesProject && matchesAssignee && matchesMyItems;
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = boardData[source.droppableId];
    const finish = boardData[destination.droppableId];

    if (start === finish) {
      const newItems = Array.from(start.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newColumn = {
        ...start,
        items: newItems,
      };

      setBoardData({
        ...boardData,
        [source.droppableId]: newColumn,
      });
    } else {
      const startItems = Array.from(start.items);
      const [removed] = startItems.splice(source.index, 1);
      const newStart = {
        ...start,
        items: startItems,
      };

      const finishItems = Array.from(finish.items);
      finishItems.splice(destination.index, 0, removed);
      const newFinish = {
        ...finish,
        items: finishItems,
      };

      setBoardData({
        ...boardData,
        [source.droppableId]: newStart,
        [destination.droppableId]: newFinish,
      });
    }
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    const item = {
      id: Date.now().toString(),
      ...newItem,
      tags: newItem.type === 'Feature' ? ['Feature'] : newItem.type === 'Story' ? ['Story'] : ['Task']
    };

    setBoardData(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, item]
      }
    }));

    setNewItem({
      title: '',
      description: '',
      type: 'Task',
      priority: 'Medium',
      assignee: '',
      project: '',
      dueDate: '',
    });

    onAddClose();
  };

  const handleStatusChange = (itemId, newStatus) => {
    // Find the item and its current column
    let sourceColumnId = null;
    let itemToMove = null;

    Object.entries(boardData).forEach(([columnId, column]) => {
      const item = column.items.find(item => item.id === itemId);
      if (item) {
        sourceColumnId = columnId;
        itemToMove = item;
      }
    });

    if (!sourceColumnId || !itemToMove) return;

    // Remove item from source column
    const sourceColumn = boardData[sourceColumnId];
    const updatedSourceItems = sourceColumn.items.filter(item => item.id !== itemId);

    // Add item to destination column
    const destinationColumn = boardData[newStatus];
    const updatedDestinationItems = [...destinationColumn.items, itemToMove];

    setBoardData(prev => ({
      ...prev,
      [sourceColumnId]: {
        ...sourceColumn,
        items: updatedSourceItems
      },
      [newStatus]: {
        ...destinationColumn,
        items: updatedDestinationItems
      }
    }));
  };

  const handleItemClick = (item) => {
    // Navigate to appropriate detail page based on item type
    switch (item.type) {
      case 'Task':
        // Tasks no longer have individual detail pages, stay on board
        break;
      case 'Feature':
        navigate(`/features/${item.id}`);
        break;
      case 'Story':
        navigate(`/stories/${item.id}`);
        break;
      default:
        console.warn('Unknown item type:', item.type);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg={bgColor}
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="-8%"
        right="-8%"
        width="220px"
        height="220px"
        borderRadius="full"
        bgGradient="linear(135deg, teal.400, blue.400)"
        opacity={0.1}
        animation="float 6s ease-in-out infinite"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-5%"
        left="-5%"
        width="160px"
        height="160px"
        borderRadius="full"
        bgGradient="linear(135deg, purple.400, pink.400)"
        opacity={0.1}
        animation="float 8s ease-in-out infinite reverse"
        zIndex={0}
      />
      
      <VStack align="stretch" spacing={8} position="relative" zIndex={1} p={6}>
        {/* Header Section with Gradient */}
        <Box
          bgGradient={gradientBg}
          borderRadius="2xl"
          p={8}
          color="white"
          position="relative"
          overflow="hidden"
          transform="translateY(0)"
          transition="all 0.3s ease"
          _hover={{
            transform: "translateY(-2px)",
            shadow: "2xl"
          }}
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)"
            animation="shimmer 3s ease-in-out infinite"
          />
          <Flex 
            justify="space-between" 
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={4}
            position="relative" 
            zIndex={1}
          >
            <Box>
              <Heading 
                size={{ base: "xl", md: "2xl" }}
                mb={3} 
                fontWeight="bold"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
                animation="slideInLeft 0.8s ease-out"
                noOfLines={1}
              >
                Project Board 📋
              </Heading>
              <Text 
                fontSize={{ base: "md", lg: "lg" }} 
                opacity={0.9}
                animation="slideInLeft 0.8s ease-out 0.2s both"
              >
                Manage your tasks with Kanban-style workflow
              </Text>
            </Box>
            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="whiteAlpha" 
              variant="solid"
              onClick={onAddOpen}
              size="lg"
              bg="rgba(255,255,255,0.2)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ 
                bg: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
                shadow: "xl"
              }}
              transition="all 0.3s ease"
              animation="slideInRight 0.8s ease-out 0.3s both"
            >
              Add Item
            </Button>
          </Flex>
        </Box>

        {/* Filters */}
        <Card 
          bg={cardBg} 
          borderColor={borderColor}
          shadow="xl"
          borderRadius="2xl"
          border="none"
          position="relative"
          overflow="hidden"
          transform="translateY(0)"
          transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          _hover={{ 
            transform: "translateY(-2px)",
            shadow: "2xl"
          }}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgGradient: "linear(90deg, teal.400, blue.400)",
          }}
          animation="fadeInScale 0.8s ease-out 0.4s both"
        >
          <CardBody>
            <VStack spacing={4}>
              <HStack spacing={4} w="full">
                <InputGroup flex="2">
                  <InputLeftElement>
                    <Icon as={FaSearch} color={mutedTextColor} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search tasks, features, or stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                    transition="all 0.2s ease"
                  />
                </InputGroup>

                <Select 
                  flex="1" 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  bg={useColorModeValue('white', 'gray.600')}
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.500')}
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                  }}
                >
                  <option value="All">All Types</option>
                  <option value="Feature">Features</option>
                  <option value="Task">Tasks</option>
                  <option value="Story">Stories</option>
                </Select>

                <Select 
                  flex="1" 
                  value={projectFilter} 
                  onChange={(e) => setProjectFilter(e.target.value)}
                  bg={useColorModeValue('white', 'gray.600')}
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.500')}
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                  }}
                >
                  <option value="All">All Projects</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </Select>

                <Select 
                  flex="1" 
                  value={assigneeFilter} 
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  bg={useColorModeValue('white', 'gray.600')}
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.500')}
                  _focus={{
                    borderColor: useColorModeValue('blue.400', 'blue.300'),
                    shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                  }}
                >
                  <option value="All">All Assignees</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </Select>
              </HStack>
              
              <HStack w="full" justify="flex-start">
                <Checkbox 
                  isChecked={showOnlyMyItems}
                  onChange={(e) => setShowOnlyMyItems(e.target.checked)}
                  colorScheme="blue"
                  size="md"
                  fontWeight="semibold"
                >
                  <HStack spacing={2}>
                    <Icon as={FaUser} color={useColorModeValue('blue.500', 'blue.300')} />
                    <Text color={textColor}>Show only my items</Text>
                  </HStack>
                </Checkbox>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex gap={6} overflow="auto" pb={4}>
            {Object.entries(boardData).map(([columnId, column], columnIndex) => (
              <Box 
                key={columnId} 
                minW="320px" 
                flex="1"
                animation={`slideInUp 0.6s ease-out ${0.5 + columnIndex * 0.1}s both`}
              >
                <Card 
                  bg={useColorModeValue('gray.50', 'gray.700')} 
                  borderColor={borderColor}
                  h="full"
                  shadow="xl"
                  borderRadius="2xl"
                  border="none"
                  position="relative"
                  overflow="hidden"
                  transform="translateY(0)"
                  transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _hover={{ 
                    transform: "translateY(-3px)",
                    shadow: "2xl"
                  }}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bgGradient: columnId === 'todo' ? "linear(90deg, blue.400, purple.400)" :
                               columnId === 'inprogress' ? "linear(90deg, orange.400, yellow.400)" :
                               columnId === 'review' ? "linear(90deg, purple.400, pink.400)" :
                               columnId === 'done' ? "linear(90deg, green.400, teal.400)" :
                               "linear(90deg, gray.400, gray.500)",
                  }}
                >
                  <CardHeader 
                    pb={3}
                    bg={useColorModeValue('white', 'gray.600')}
                    borderTopRadius="2xl"
                  >
                    <HStack justify="space-between">
                      <HStack>
                        <Box
                          p={2}
                          borderRadius="lg"
                          bg={columnId === 'todo' ? useColorModeValue('blue.100', 'blue.800') :
                             columnId === 'inprogress' ? useColorModeValue('orange.100', 'orange.800') :
                             columnId === 'review' ? useColorModeValue('purple.100', 'purple.800') :
                             columnId === 'done' ? useColorModeValue('green.100', 'green.800') :
                             useColorModeValue('gray.100', 'gray.800')}
                          color={columnId === 'todo' ? useColorModeValue('blue.600', 'blue.200') :
                                columnId === 'inprogress' ? useColorModeValue('orange.600', 'orange.200') :
                                columnId === 'review' ? useColorModeValue('purple.600', 'purple.200') :
                                columnId === 'done' ? useColorModeValue('green.600', 'green.200') :
                                useColorModeValue('gray.600', 'gray.200')}
                        >
                          <Icon 
                            as={columnId === 'todo' ? FaTasks :
                               columnId === 'inprogress' ? FaSpinner :
                               columnId === 'review' ? FaEye :
                               columnId === 'done' ? FaCheckCircle :
                               FaTasks} 
                            boxSize={4} 
                          />
                        </Box>
                        <Heading size="md" color={textColor} fontWeight="bold">{column.title}</Heading>
                      </HStack>
                      <Badge 
                        colorScheme={columnId === 'todo' ? 'blue' :
                                   columnId === 'inprogress' ? 'orange' :
                                   columnId === 'review' ? 'purple' : 
                                   columnId === 'done' ? 'green' : 'gray'} 
                        variant="solid"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontWeight="bold"
                      >
                        {filterItems(column.items).length}
                      </Badge>
                    </HStack>
                  </CardHeader>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <CardBody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        bg={snapshot.isDraggingOver ? 
                          useColorModeValue('blue.50', 'blue.900') : 
                          useColorModeValue('gray.50', 'gray.700')
                        }
                        minH="400px"
                        transition="background-color 0.3s ease"
                        borderRadius="xl"
                        m={2}
                        p={3}
                      >
                        <VStack spacing={4} align="stretch">
                          {filterItems(column.items).length === 0 ? (
                            <Box
                              p={8}
                              textAlign="center"
                              borderRadius="xl"
                              bg={useColorModeValue('gray.100', 'gray.600')}
                              border="2px dashed"
                              borderColor={useColorModeValue('gray.300', 'gray.500')}
                              transition="all 0.3s ease"
                              _hover={{
                                borderColor: useColorModeValue('gray.400', 'gray.400'),
                                bg: useColorModeValue('gray.150', 'gray.550')
                              }}
                            >
                              <VStack spacing={3}>
                                <Icon 
                                  as={FaTasks} 
                                  boxSize={8} 
                                  color={useColorModeValue('gray.400', 'gray.500')}
                                />
                                <Text 
                                  color={mutedTextColor} 
                                  fontSize="sm" 
                                  fontWeight="semibold"
                                >
                                  No items in {column.title}
                                </Text>
                                <Text 
                                  color={mutedTextColor} 
                                  fontSize="xs" 
                                  opacity={0.8}
                                >
                                  {searchTerm || typeFilter !== 'All' || projectFilter !== 'All' || assigneeFilter !== 'All' || showOnlyMyItems
                                    ? 'No items match the current filters' 
                                    : 'Drag items here or click the + button to add new ones'
                                  }
                                </Text>
                              </VStack>
                            </Box>
                          ) : (
                            filterItems(column.items).map((item, index) => {
                            const originalIndex = column.items.findIndex(originalItem => originalItem.id === item.id);
                            return (
                              <Draggable key={item.id} draggableId={item.id} index={originalIndex}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    bg={cardBg}
                                    borderColor={item.assignee === currentUser && item.type === 'Task' ? 
                                      useColorModeValue('blue.300', 'blue.500') : 
                                      borderColor
                                    }
                                    shadow={snapshot.isDragging ? '2xl' : 'lg'}
                                    transform={snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'none'}
                                    transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    _hover={{ 
                                      shadow: 'xl', 
                                      transform: 'translateY(-3px) scale(1.01)',
                                      borderColor: item.assignee === currentUser && item.type === 'Task' ?
                                        useColorModeValue('blue.400', 'blue.400') :
                                        useColorModeValue('blue.200', 'blue.500')
                                    }}
                                    cursor="grab"
                                    borderRadius="xl"
                                    border={item.assignee === currentUser && item.type === 'Task' ? "2px solid" : "1px solid"}
                                    position="relative"
                                    overflow="hidden"
                                    _before={{
                                      content: '""',
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: "3px",
                                      bg: `${getTypeColor(item.type)}.400`,
                                      borderLeftRadius: "xl"
                                    }}
                                    _after={item.assignee === currentUser && item.type === 'Task' ? {
                                      content: '""',
                                      position: "absolute",
                                      right: "8px",
                                      top: "8px",
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "full",
                                      bg: useColorModeValue('blue.500', 'blue.400'),
                                      animation: "pulse 2s ease-in-out infinite"
                                    } : {}}
                                  >
                                    <CardBody 
                                      p={4} 
                                      bg={cardContentBg}
                                      onClick={(e) => {
                                        // Only open details if not clicking on menu button or other interactive elements
                                        if (!e.target.closest('button') && !e.target.closest('[role="menuitem"]')) {
                                          e.stopPropagation();
                                          handleItemClick(item);
                                        }
                                      }}
                                      cursor="pointer"
                                      _hover={{
                                        bg: useColorModeValue('gray.50', 'gray.650')
                                      }}
                                      transition="background-color 0.2s ease"
                                    >
                                      <VStack align="stretch" spacing={3}>
                                        {/* Header */}
                                        <HStack justify="space-between">
                                          <HStack>
                                            <Icon 
                                              as={getTypeIcon(item.type)} 
                                              color={useColorModeValue(`${getTypeColor(item.type)}.600`, `${getTypeColor(item.type)}.300`)}
                                              boxSize={4}
                                            />
                                            <Badge 
                                              colorScheme={getTypeColor(item.type)} 
                                              size="sm"
                                              borderRadius="full"
                                              px={2}
                                              py={1}
                                              fontWeight="bold"
                                            >
                                              {item.type}
                                            </Badge>
                                            {item.assignee === currentUser && item.type === 'Task' && (
                                              <Badge 
                                                colorScheme="blue" 
                                                size="sm"
                                                borderRadius="full"
                                                px={2}
                                                py={1}
                                                fontWeight="bold"
                                                variant="solid"
                                              >
                                                Mine
                                              </Badge>
                                            )}
                                          </HStack>
                                          <Menu>
                                            <MenuButton
                                              as={IconButton}
                                              icon={<FaEllipsisV />}
                                              size="xs"
                                              variant="ghost"
                                              color={textColor}
                                              _hover={{
                                                bg: useColorModeValue('gray.100', 'gray.600'),
                                                transform: "scale(1.1)"
                                              }}
                                              transition="all 0.2s ease"
                                            />
                                            <MenuList 
                                              bg={cardBg}
                                              borderColor={borderColor}
                                              shadow="xl"
                                            >
                                              {item.assignee === currentUser && item.type === 'Task' && (
                                                <>
                                                  <MenuItem 
                                                    icon={<FaExchangeAlt />}
                                                    color={useColorModeValue('blue.600', 'blue.300')}
                                                    _hover={{
                                                      bg: useColorModeValue('blue.50', 'gray.600')
                                                    }}
                                                    fontWeight="semibold"
                                                    isDisabled
                                                    fontSize="xs"
                                                  >
                                                    Change Status
                                                  </MenuItem>
                                                  {columnId !== 'todo' && (
                                                    <MenuItem 
                                                      icon={<FaTasks />}
                                                      pl={8}
                                                      fontSize="sm"
                                                      onClick={() => handleStatusChange(item.id, 'todo')}
                                                      _hover={{
                                                        bg: useColorModeValue('blue.50', 'gray.600')
                                                      }}
                                                    >
                                                      Move to To Do
                                                    </MenuItem>
                                                  )}
                                                  {columnId !== 'inprogress' && (
                                                    <MenuItem 
                                                      icon={<FaSpinner />}
                                                      pl={8}
                                                      fontSize="sm"
                                                      onClick={() => handleStatusChange(item.id, 'inprogress')}
                                                      _hover={{
                                                        bg: useColorModeValue('orange.50', 'gray.600')
                                                      }}
                                                    >
                                                      Move to In Progress
                                                    </MenuItem>
                                                  )}
                                                  {columnId !== 'review' && (
                                                    <MenuItem 
                                                      icon={<FaEye />}
                                                      pl={8}
                                                      fontSize="sm"
                                                      onClick={() => handleStatusChange(item.id, 'review')}
                                                      _hover={{
                                                        bg: useColorModeValue('purple.50', 'gray.600')
                                                      }}
                                                    >
                                                      Move to Review
                                                    </MenuItem>
                                                  )}
                                                  {columnId !== 'done' && (
                                                    <MenuItem 
                                                      icon={<FaCheckCircle />}
                                                      pl={8}
                                                      fontSize="sm"
                                                      onClick={() => handleStatusChange(item.id, 'done')}
                                                      _hover={{
                                                        bg: useColorModeValue('green.50', 'gray.600')
                                                      }}
                                                    >
                                                      Move to Done
                                                    </MenuItem>
                                                  )}
                                                  <MenuItem 
                                                    as="div" 
                                                    p={0} 
                                                    bg="transparent"
                                                    _hover={{ bg: "transparent" }}
                                                  >
                                                    <Box w="full" h="1px" bg={borderColor} />
                                                  </MenuItem>
                                                </>
                                              )}
                                              <MenuItem 
                                                icon={<FaEdit />}
                                                _hover={{
                                                  bg: useColorModeValue('blue.50', 'gray.600')
                                                }}
                                              >
                                                Edit
                                              </MenuItem>
                                              <MenuItem 
                                                icon={<FaTrash />} 
                                                color="red.500"
                                                _hover={{
                                                  bg: useColorModeValue('red.50', 'red.800')
                                                }}
                                              >
                                                Delete
                                              </MenuItem>
                                            </MenuList>
                                          </Menu>
                                        </HStack>

                                        {/* Content */}
                                        <Box>
                                          <Text fontWeight="bold" fontSize="sm" mb={2} color={textColor}>
                                            {item.title}
                                          </Text>
                                          <Text fontSize="xs" color={mutedTextColor} noOfLines={2} fontWeight="medium">
                                            {item.description}
                                          </Text>
                                        </Box>

                                        {/* Tags */}
                                        <HStack spacing={1} flexWrap="wrap">
                                          {item.tags.map(tag => (
                                            <Tag 
                                              key={tag} 
                                              size="sm" 
                                              colorScheme={getTypeColor(item.type)}
                                              variant="outline"
                                              borderRadius="full"
                                            >
                                              <TagLabel>{tag}</TagLabel>
                                            </Tag>
                                          ))}
                                        </HStack>

                                        {/* Footer */}
                                        <HStack justify="space-between" fontSize="xs">
                                          <VStack align="start" spacing={1}>
                                            <HStack>
                                              <Icon 
                                                as={FaFlag} 
                                                color={useColorModeValue(`${getPriorityColor(item.priority)}.600`, `${getPriorityColor(item.priority)}.300`)}
                                                boxSize={3}
                                              />
                                              <Text color={mutedTextColor} fontWeight="semibold">{item.priority}</Text>
                                            </HStack>
                                            <HStack>
                                              <Icon as={FaCalendarAlt} color={useColorModeValue('blue.500', 'blue.300')} boxSize={3} />
                                              <Text color={mutedTextColor} fontWeight="semibold">{item.dueDate}</Text>
                                            </HStack>
                                          </VStack>
                                          <VStack align="end" spacing={1}>
                                            <Text color={mutedTextColor} fontSize="xs" fontWeight="semibold">{item.project}</Text>
                                            <Tooltip label={item.assignee} hasArrow>
                                              <Avatar 
                                                size="xs" 
                                                name={item.assignee}
                                                border="2px solid"
                                                borderColor={useColorModeValue('white', 'gray.700')}
                                                _hover={{
                                                  transform: "scale(1.1)"
                                                }}
                                                transition="all 0.2s ease"
                                              />
                                            </Tooltip>
                                          </VStack>
                                        </HStack>
                                      </VStack>
                                    </CardBody>
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })
                          )}
                          {provided.placeholder}
                        </VStack>
                      </CardBody>
                    )}
                  </Droppable>
                </Card>
              </Box>
            ))}
          </Flex>
        </DragDropContext>

        {/* Add Item Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent 
            bg={cardBg}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            shadow="2xl"
          >
            <ModalHeader 
              bg={useColorModeValue('teal.50', 'gray.700')}
              borderTopRadius="2xl"
              borderBottom="1px"
              borderColor={borderColor}
            >
              <HStack>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={useColorModeValue('teal.100', 'teal.800')}
                  color={useColorModeValue('teal.600', 'teal.200')}
                >
                  <Icon as={FaPlus} />
                </Box>
                <Text color={textColor} fontWeight="bold">Add New Item</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton 
              color={textColor}
              _hover={{
                bg: useColorModeValue('gray.100', 'gray.600')
              }}
            />
            <ModalBody p={6}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="semibold">Title</FormLabel>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title..."
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontWeight="semibold">Description</FormLabel>
                  <Textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description..."
                    rows={3}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Type</FormLabel>
                    <Select
                      value={newItem.type}
                      onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    >
                      <option value="Feature">Feature</option>
                      <option value="Task">Task</option>
                      <option value="Story">Story</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Priority</FormLabel>
                    <Select
                      value={newItem.priority}
                      onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Project</FormLabel>
                    <Select
                      value={newItem.project}
                      onChange={(e) => setNewItem(prev => ({ ...prev, project: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    >
                      <option value="">Select project...</option>
                      {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} fontWeight="semibold">Assignee</FormLabel>
                    <Select
                      value={newItem.assignee}
                      onChange={(e) => setNewItem(prev => ({ ...prev, assignee: e.target.value }))}
                      bg={useColorModeValue('gray.50', 'gray.600')}
                      border="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.500')}
                      _focus={{
                        borderColor: useColorModeValue('blue.400', 'blue.300'),
                        shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                      }}
                    >
                      <option value="">Select assignee...</option>
                      {assignees.map(assignee => (
                        <option key={assignee} value={assignee}>{assignee}</option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel color={textColor} fontWeight="semibold">Due Date</FormLabel>
                  <Input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, dueDate: e.target.value }))}
                    bg={useColorModeValue('gray.50', 'gray.600')}
                    border="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.500')}
                    _focus={{
                      borderColor: useColorModeValue('blue.400', 'blue.300'),
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter 
              borderTop="1px"
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderBottomRadius="2xl"
            >
              <Button 
                variant="ghost" 
                mr={3} 
                onClick={onAddClose}
                color={mutedTextColor}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.600')
                }}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="teal" 
                onClick={handleAddItem}
                borderRadius="lg"
                px={6}
                _hover={{
                  transform: "translateY(-1px)",
                  shadow: "lg"
                }}
                transition="all 0.2s ease"
              >
                Add Item
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    
      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </Box>
  );
};

export default Board;
