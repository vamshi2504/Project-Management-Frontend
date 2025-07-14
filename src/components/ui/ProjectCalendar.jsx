import React, { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  HStack,
  Heading,
  Badge,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  ModalFooter,
  IconButton,
  useToast,
  SimpleGrid,
  Divider,
  Tooltip,
  ButtonGroup,
  Tag,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaUsers,
  FaEdit,
  FaTrash,
  FaTasks,
  FaProjectDiagram,
  FaCalendarDay,
  FaCalendarWeek,
  FaTable,
  FaFlag,
} from 'react-icons/fa';

const ProjectCalendar = ({ storyData }) => {
  // Using consistent dark theme
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';
  const todayColor = 'blue.400';

  const { isOpen: isEventOpen, onOpen: onEventOpen, onClose: onEventClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const toast = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'meeting',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    feature: '',
    attendees: '',
    priority: 'Medium',
  });

  // Generate calendar events from story data
  const calendarEvents = useMemo(() => {
    const events = [];
    
    // Add story milestones
    if (storyData) {
      // Story due date
      events.push({
        id: `story-${storyData.id}`,
        title: `Story Due: ${storyData.title}`,
        description: storyData.description,
        type: 'deadline',
        date: storyData.dueDate,
        startTime: '23:59',
        endTime: '23:59',
        feature: 'Story Deadline',
        priority: storyData.priority,
        isStoryEvent: true,
      });

      // Feature deadlines
      storyData.features?.forEach((feature, index) => {
        events.push({
          id: `feature-${feature.id}`,
          title: `Feature: ${feature.name}`,
          description: feature.description,
          type: 'task',
          date: feature.dueDate,
          startTime: '17:00',
          endTime: '17:00',
          feature: feature.name,
          priority: feature.priority,
          assignee: feature.assignee,
          progress: feature.progress,
          isFeatureEvent: true,
        });
      });
    }

    // Add sample project events
    const sampleEvents = [
      {
        id: 'meeting-1',
        title: 'Sprint Planning',
        description: 'Plan upcoming sprint tasks',
        type: 'meeting',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:30',
        feature: 'Sprint Planning',
        attendees: ['Team Lead', 'Product Owner', 'Developers'],
        priority: 'High',
      },
      {
        id: 'review-1',
        title: 'Design Review',
        description: 'Review UI/UX designs for new features',
        type: 'review',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:30',
        feature: 'Design System',
        attendees: ['Design Team', 'Frontend Team'],
        priority: 'Medium',
      },
      {
        id: 'standup-1',
        title: 'Daily Standup',
        description: 'Daily team sync meeting',
        type: 'meeting',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '09:30',
        feature: 'Daily Sync',
        attendees: ['Team'],
        priority: 'High',
        isRecurring: true,
      },
    ];

    return [...events, ...sampleEvents];
  }, [storyData]);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'task': return 'green';
      case 'review': return 'purple';
      case 'deadline': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'gray';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return FaUsers;
      case 'task': return FaTasks;
      case 'review': return FaProjectDiagram;
      case 'deadline': return FaFlag;
      default: return FaCalendarAlt;
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: calendarView === 'day' ? 'numeric' : undefined
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (calendarView) {
      case 'day':
        newDate.setDate(currentDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.startDate || !newEvent.startTime) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields (title, date, start time)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Event Added',
      description: `"${newEvent.title}" has been added to the calendar`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewEvent({
      title: '',
      description: '',
      type: 'meeting',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      feature: '',
      attendees: '',
      priority: 'Medium',
    });
    onEventClose();
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onViewOpen();
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          <Box p={4} borderBottom="1px" borderColor={borderColor}>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </Box>
          
          <Box maxH="600px" overflowY="auto">
            {hours.map(hour => {
              const hourEvents = dayEvents.filter(event => {
                const eventHour = parseInt(event.startTime.split(':')[0]);
                return eventHour === hour;
              });

              return (
                <Flex key={hour} borderBottom="1px" borderColor={borderColor} minH="60px">
                  <Box w="80px" p={2} borderRight="1px" borderColor={borderColor}>
                    <Text fontSize="sm" color="gray.400">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </Text>
                  </Box>
                  <Box flex={1} p={2}>
                    <VStack align="stretch" spacing={1}>
                      {hourEvents.map(event => (
                        <Box
                          key={event.id}
                          bg={`${getEventTypeColor(event.type)}.600`}
                          color="white"
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{ opacity: 0.8 }}
                          onClick={() => handleEventClick(event)}
                        >
                          <HStack justify="space-between">
                            <HStack spacing={2}>
                              <Icon as={getEventTypeIcon(event.type)} boxSize={3} />
                              <Text fontSize="sm" fontWeight="bold">
                                {formatTime(event.startTime)} - {event.title}
                              </Text>
                            </HStack>
                            <Badge colorScheme={getPriorityColor(event.priority)} size="sm">
                              {event.priority}
                            </Badge>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Flex>
              );
            })}
          </Box>
        </CardBody>
      </Card>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          {/* Week header */}
          <Grid templateColumns="80px repeat(7, 1fr)" gap={0} borderBottom="1px" borderColor={borderColor}>
            <Box p={2}></Box>
            {weekDates.map(date => (
              <Box key={date.toISOString()} p={2} textAlign="center" borderLeft="1px" borderColor={borderColor}>
                <Text fontSize="sm" color="gray.400">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={isToday(date) ? todayColor : 'white'}
                >
                  {date.getDate()}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* Week body */}
          <Box maxH="600px" overflowY="auto">
            {hours.map(hour => (
              <Grid key={hour} templateColumns="80px repeat(7, 1fr)" gap={0} borderBottom="1px" borderColor={borderColor} minH="60px">
                <Box p={2} borderRight="1px" borderColor={borderColor}>
                  <Text fontSize="sm" color="gray.400">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </Text>
                </Box>
                {weekDates.map(date => {
                  const dayEvents = getEventsForDate(date).filter(event => {
                    const eventHour = parseInt(event.startTime.split(':')[0]);
                    return eventHour === hour;
                  });

                  return (
                    <Box key={date.toISOString()} p={1} borderLeft="1px" borderColor={borderColor}>
                      <VStack align="stretch" spacing={1}>
                        {dayEvents.map(event => (
                          <Box
                            key={event.id}
                            bg={`${getEventTypeColor(event.type)}.600`}
                            color="white"
                            p={1}
                            borderRadius="sm"
                            cursor="pointer"
                            _hover={{ opacity: 0.8 }}
                            onClick={() => handleEventClick(event)}
                            fontSize="xs"
                          >
                            <Text fontWeight="bold" noOfLines={1}>
                              {event.title}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  );
                })}
              </Grid>
            ))}
          </Box>
        </CardBody>
      </Card>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<GridItem key={`empty-${i}`} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isCurrentDay = isToday(date);

      days.push(
        <GridItem 
          key={day} 
          minH="120px" 
          border="1px" 
          borderColor={borderColor}
          bg={cardBg}
          p={2}
          position="relative"
          _hover={{ bg: 'gray.700' }}
          transition="background-color 0.2s"
        >
          <VStack align="stretch" spacing={1} h="full">
            <HStack justify="space-between">
              <Text 
                fontWeight={isCurrentDay ? "bold" : "normal"}
                color={isCurrentDay ? todayColor : "white"}
                fontSize="sm"
              >
                {day}
              </Text>
              {isCurrentDay && (
                <Box 
                  w={2} 
                  h={2} 
                  borderRadius="full" 
                  bg={todayColor}
                />
              )}
            </HStack>
            
            <VStack spacing={1} align="stretch" flex="1">
              {dayEvents.slice(0, 3).map((event) => (
                <Box
                  key={event.id}
                  bg={`${getEventTypeColor(event.type)}.600`}
                  color="white"
                  p={1}
                  borderRadius="sm"
                  fontSize="xs"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                  onClick={() => handleEventClick(event)}
                  noOfLines={1}
                >
                  <HStack spacing={1}>
                    <Icon as={getEventTypeIcon(event.type)} boxSize={2} />
                    <Text>{event.startTime}</Text>
                    <Text fontWeight="semibold">{event.title}</Text>
                  </HStack>
                </Box>
              ))}
              
              {dayEvents.length > 3 && (
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  +{dayEvents.length - 3} more
                </Text>
              )}
            </VStack>
          </VStack>
        </GridItem>
      );
    }

    return (
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          {/* Days of week header */}
          <Grid templateColumns="repeat(7, 1fr)" gap={0}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <GridItem 
                key={day} 
                p={3} 
                textAlign="center" 
                fontWeight="bold"
                bg="gray.700"
                borderRight="1px"
                borderColor={borderColor}
                color="gray.300"
              >
                {day}
              </GridItem>
            ))}
          </Grid>
          
          {/* Calendar days */}
          <Grid templateColumns="repeat(7, 1fr)" gap={0}>
            {days}
          </Grid>
        </CardBody>
      </Card>
    );
  };

  const renderCalendarView = () => {
    switch (calendarView) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
      default:
        return renderMonthView();
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      {/* Calendar Header */}
      <Flex 
        justify="space-between" 
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <HStack spacing={4}>
          <Icon as={FaCalendarAlt} color="purple.400" boxSize={6} />
          <VStack align="start" spacing={0}>
            <Heading size={{ base: "md", md: "lg" }} color="white">
              Project Calendar
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Track deadlines and events
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={3} flexWrap="wrap">
          {/* View Toggle */}
          <ButtonGroup isAttached variant="outline" size="sm">
            <Button
              leftIcon={<FaCalendarDay />}
              onClick={() => setCalendarView('day')}
              colorScheme={calendarView === 'day' ? 'blue' : 'gray'}
              variant={calendarView === 'day' ? 'solid' : 'outline'}
              borderColor="gray.600"
            >
              Day
            </Button>
            <Button
              leftIcon={<FaCalendarWeek />}
              onClick={() => setCalendarView('week')}
              colorScheme={calendarView === 'week' ? 'blue' : 'gray'}
              variant={calendarView === 'week' ? 'solid' : 'outline'}
              borderColor="gray.600"
            >
              Week
            </Button>
            <Button
              leftIcon={<FaTable />}
              onClick={() => setCalendarView('month')}
              colorScheme={calendarView === 'month' ? 'blue' : 'gray'}
              variant={calendarView === 'month' ? 'solid' : 'outline'}
              borderColor="gray.600"
            >
              Month
            </Button>
          </ButtonGroup>

          <Button 
            leftIcon={<FaPlus />} 
            colorScheme="purple" 
            onClick={onEventOpen}
            size="sm"
          >
            Add Event
          </Button>
        </HStack>
      </Flex>

      {/* Calendar Navigation */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="space-between" align="center">
            <IconButton
              icon={<FaChevronLeft />}
              onClick={() => navigateDate(-1)}
              variant="ghost"
              aria-label={`Previous ${calendarView}`}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            />
            
            <Heading size="lg" color="white">
              {formatDate(currentDate)}
            </Heading>
            
            <IconButton
              icon={<FaChevronRight />}
              onClick={() => navigateDate(1)}
              variant="ghost"
              aria-label={`Next ${calendarView}`}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            />
          </Flex>
        </CardBody>
      </Card>

      {/* Calendar View */}
      {renderCalendarView()}

      {/* Add Event Modal */}
      <Modal isOpen={isEventOpen} onClose={onEventClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color="white">
            <HStack>
              <Icon as={FaPlus} color="purple.400" />
              <Text>Add New Event</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="gray.300">Title</FormLabel>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title..."
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.300">Description</FormLabel>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                  rows={3}
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.300">Type</FormLabel>
                  <Select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                  >
                    <option value="meeting" style={{ backgroundColor: '#2D3748' }}>Meeting</option>
                    <option value="task" style={{ backgroundColor: '#2D3748' }}>Task</option>
                    <option value="review" style={{ backgroundColor: '#2D3748' }}>Review</option>
                    <option value="deadline" style={{ backgroundColor: '#2D3748' }}>Deadline</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.300">Priority</FormLabel>
                  <Select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value }))}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                  >
                    <option value="High" style={{ backgroundColor: '#2D3748' }}>High</option>
                    <option value="Medium" style={{ backgroundColor: '#2D3748' }}>Medium</option>
                    <option value="Low" style={{ backgroundColor: '#2D3748' }}>Low</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel color="gray.300">Start Date</FormLabel>
                  <Input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.300">Start Time</FormLabel>
                  <Input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                    bg="gray.700"
                    borderColor="gray.600"
                    color="white"
                    _hover={{ borderColor: "gray.500" }}
                    _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel color="gray.300">Feature/Category</FormLabel>
                <Input
                  value={newEvent.feature}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, feature: e.target.value }))}
                  placeholder="Related feature or category..."
                  bg="gray.700"
                  borderColor="gray.600"
                  color="white"
                  _hover={{ borderColor: "gray.500" }}
                  _focus={{ borderColor: "purple.500", bg: "gray.700" }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              mr={3} 
              onClick={onEventClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="purple" 
              onClick={handleAddEvent}
              leftIcon={<FaPlus />}
            >
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Event Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color="white">
            <HStack>
              <Icon 
                as={getEventTypeIcon(selectedEvent?.type)} 
                color={`${getEventTypeColor(selectedEvent?.type)}.400`} 
              />
              <Text>{selectedEvent?.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            {selectedEvent && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text color="gray.400" fontSize="sm" mb={1}>Description</Text>
                  <Text color="white">{selectedEvent.description || 'No description provided'}</Text>
                </Box>

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Date</Text>
                    <Text color="white">{new Date(selectedEvent.date).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Time</Text>
                    <Text color="white">
                      {formatTime(selectedEvent.startTime)}
                      {selectedEvent.endTime && selectedEvent.endTime !== selectedEvent.startTime && 
                        ` - ${formatTime(selectedEvent.endTime)}`
                      }
                    </Text>
                  </Box>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Type</Text>
                    <Badge colorScheme={getEventTypeColor(selectedEvent.type)}>
                      {selectedEvent.type}
                    </Badge>
                  </Box>
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Priority</Text>
                    <Badge colorScheme={getPriorityColor(selectedEvent.priority)}>
                      {selectedEvent.priority}
                    </Badge>
                  </Box>
                </SimpleGrid>

                {selectedEvent.feature && (
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Feature/Category</Text>
                    <Text color="white">{selectedEvent.feature}</Text>
                  </Box>
                )}

                {selectedEvent.assignee && (
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Assignee</Text>
                    <Text color="white">{selectedEvent.assignee}</Text>
                  </Box>
                )}

                {selectedEvent.progress !== undefined && (
                  <Box>
                    <Text color="gray.400" fontSize="sm" mb={1}>Progress</Text>
                    <Text color="white">{selectedEvent.progress}%</Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button 
              variant="ghost" 
              onClick={onViewClose}
              color="gray.400"
              _hover={{ color: "white", bg: "gray.700" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ProjectCalendar;
