import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Heading,
  Button,
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
  useToast,
  Icon,
  Badge,
  ButtonGroup,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaUsers,
  FaTasks,
  FaProjectDiagram,
  FaCalendar,
  FaCalendarWeek,
  FaCalendarDay,
} from 'react-icons/fa';

const Calendar = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const todayColor = useColorModeValue('blue.500', 'blue.300');
  
  const { isOpen: isEventOpen, onOpen: onEventOpen, onClose: onEventClose } = useDisclosure();
  const toast = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day'
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'meeting',
    startTime: '',
    endTime: '',
    project: '',
  });

  // Mock events data with current year dates
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Sprint Planning Meeting',
      description: 'Plan tasks for the upcoming sprint',
      type: 'meeting',
      date: '2025-07-15',
      startTime: '09:00',
      endTime: '10:30',
      project: 'E-commerce Platform',
    },
    {
      id: 2,
      title: 'Design Review',
      description: 'Review UI/UX designs for new features',
      type: 'review',
      date: '2025-07-16',
      startTime: '14:00',
      endTime: '15:30',
      project: 'Mobile App',
    },
    {
      id: 3,
      title: 'User Authentication Task',
      description: 'Complete OAuth implementation',
      type: 'task',
      date: '2025-07-17',
      startTime: '10:00',
      endTime: '17:00',
      project: 'E-commerce Platform',
    },
  ]);

  const projects = ['E-commerce Platform', 'Mobile App', 'UI/UX Redesign'];

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'task': return 'green';
      case 'review': return 'purple';
      case 'deadline': return 'red';
      default: return 'gray';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return FaUsers;
      case 'task': return FaTasks;
      case 'review': return FaProjectDiagram;
      case 'deadline': return FaClock;
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
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDay);
    }
    return weekDates;
  };

  const getHourSlots = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventsForTimeSlot = (date, hour) => {
    const dayEvents = getEventsForDate(date);
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate.toDateString() === today.toDateString();
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (currentView === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getNavigationLabel = () => {
    if (currentView === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (currentView === 'week') {
      const weekDates = getWeekDates(currentDate);
      const start = weekDates[0];
      const end = weekDates[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
      } else {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
      }
    } else if (currentView === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <Box>
        {/* Week Header */}
        <Grid templateColumns="repeat(7, 1fr)" gap={0} mb={4}>
          {weekDates.map((date, index) => (
            <GridItem
              key={index}
              p={3}
              textAlign="center"
              fontWeight="bold"
              bg={useColorModeValue('gray.100', 'gray.700')}
              color={textColor}
              fontSize="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Text fontSize="xs" color="gray.500" mb={1}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text 
                fontWeight={date.toDateString() === new Date().toDateString() ? "bold" : "normal"}
                color={date.toDateString() === new Date().toDateString() ? todayColor : textColor}
                fontSize="lg"
              >
                {date.getDate()}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {/* Week Days Grid - Similar to Month View */}
        <Grid templateColumns="repeat(7, 1fr)" gap={0}>
          {weekDates.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentDay = date.toDateString() === new Date().toDateString();
            const isSelected = isSameDay(date, selectedDate);

            return (
              <GridItem
                key={index}
                minH="400px"
                border="1px"
                borderColor={borderColor}
                bg={isSelected ? useColorModeValue('blue.50', 'blue.900') : cardBg}
                p={2}
                cursor="pointer"
                _hover={{ bg: useColorModeValue('blue.25', 'blue.800') }}
                onClick={() => setSelectedDate(date)}
                transition="background-color 0.2s"
              >
                <VStack align="stretch" spacing={2} h="full">
                  <HStack justify="space-between" mb={2}>
                    <Text
                      fontWeight={isCurrentDay ? "bold" : "normal"}
                      color={isCurrentDay ? todayColor : textColor}
                      fontSize="md"
                    >
                      {date.getDate()}
                    </Text>
                    {isCurrentDay && (
                      <Box w={2} h={2} borderRadius="full" bg={todayColor} />
                    )}
                  </HStack>
                  
                  <VStack spacing={1} align="stretch" flex="1">
                    {dayEvents.map((event) => (
                      <Box
                        key={event.id}
                        bg={useColorModeValue(`${getEventTypeColor(event.type)}.100`, `${getEventTypeColor(event.type)}.700`)}
                        color={useColorModeValue(`${getEventTypeColor(event.type)}.800`, `${getEventTypeColor(event.type)}.100`)}
                        p={2}
                        borderRadius="md"
                        fontSize="xs"
                        noOfLines={1}
                      >
                        <Text fontWeight="bold" fontSize="xs">
                          {event.startTime}
                        </Text>
                        <Text noOfLines={2}>
                          {event.title}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const isCurrentDay = currentDate.toDateString() === new Date().toDateString();
    
    return (
      <Box>
        {/* Single Day Card - Similar to Month View Cell */}
        <Grid templateColumns="1fr" gap={0}>
          <GridItem
            minH="600px"
            border="1px"
            borderColor={borderColor}
            bg={cardBg}
            p={4}
            borderRadius="lg"
          >
            <VStack align="stretch" spacing={4} h="full">
              {/* Day Header */}
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </Text>
                  <HStack>
                    <Text 
                      fontSize="3xl" 
                      fontWeight="bold" 
                      color={isCurrentDay ? todayColor : textColor}
                    >
                      {currentDate.getDate()}
                    </Text>
                    {isCurrentDay && (
                      <Box w={3} h={3} borderRadius="full" bg={todayColor} />
                    )}
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                </VStack>
                
                <Badge colorScheme="blue" fontSize="sm" p={2}>
                  {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                </Badge>
              </HStack>

              {/* Events List */}
              <VStack spacing={3} align="stretch" flex="1">
                {dayEvents.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Icon as={FaCalendarAlt} boxSize={16} color="gray.300" mb={4} />
                    <Text color="gray.500" fontSize="lg" mb={4}>
                      No events scheduled for this date
                    </Text>
                    <Button 
                      size="md"
                      colorScheme="blue"
                      variant="outline"
                      onClick={onEventOpen}
                      leftIcon={<FaPlus />}
                    >
                      Add Event
                    </Button>
                  </Box>
                ) : (
                  dayEvents.map((event) => (
                    <Box
                      key={event.id}
                      p={4}
                      bg={useColorModeValue(`${getEventTypeColor(event.type)}.50`, `${getEventTypeColor(event.type)}.900`)}
                      borderLeft="4px"
                      borderColor={`${getEventTypeColor(event.type)}.500`}
                      borderRadius="md"
                      _hover={{ 
                        transform: 'translateY(-2px)',
                        shadow: 'md',
                        transition: 'all 0.2s'
                      }}
                    >
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Icon 
                            as={getEventTypeIcon(event.type)} 
                            color={`${getEventTypeColor(event.type)}.500`}
                            boxSize={5}
                          />
                          <Text fontWeight="bold" fontSize="lg" color={textColor}>
                            {event.title}
                          </Text>
                        </HStack>
                        <Badge colorScheme={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </HStack>
                      
                      {event.description && (
                        <Text fontSize="sm" color="gray.600" mb={3}>
                          {event.description}
                        </Text>
                      )}
                      
                      <HStack justify="space-between" fontSize="sm" color="gray.500">
                        <HStack>
                          <Icon as={FaClock} boxSize={3} />
                          <Text fontWeight="medium">
                            {event.startTime} - {event.endTime || 'No end time'}
                          </Text>
                        </HStack>
                        {event.project && (
                          <HStack>
                            <Icon as={FaProjectDiagram} boxSize={3} />
                            <Text fontWeight="medium">
                              {event.project}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                    </Box>
                  ))
                )}
              </VStack>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const days = [];

    // Week day headers
    weekDays.forEach(day => {
      days.push(
        <GridItem
          key={day}
          p={3}
          textAlign="center"
          fontWeight="bold"
          bg={useColorModeValue('gray.100', 'gray.700')}
          color={textColor}
          fontSize="sm"
        >
          {day}
        </GridItem>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <GridItem
          key={`empty-${i}`}
          minH="80px"
          border="1px"
          borderColor={borderColor}
          bg={useColorModeValue('gray.50', 'gray.900')}
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(dayDate);
      const isCurrentDay = isToday(day);
      const isSelected = isSameDay(dayDate, selectedDate);

      days.push(
        <GridItem
          key={day}
          minH="80px"
          border="1px"
          borderColor={borderColor}
          bg={isSelected ? useColorModeValue('blue.50', 'blue.900') : cardBg}
          p={2}
          cursor="pointer"
          _hover={{ bg: useColorModeValue('blue.25', 'blue.800') }}
          onClick={() => handleDateClick(day)}
          transition="background-color 0.2s"
        >
          <VStack align="stretch" spacing={1} h="full">
            <HStack justify="space-between">
              <Text
                fontWeight={isCurrentDay ? "bold" : "normal"}
                color={isCurrentDay ? todayColor : textColor}
                fontSize="sm"
              >
                {day}
              </Text>
              {isCurrentDay && (
                <Box w={2} h={2} borderRadius="full" bg={todayColor} />
              )}
            </HStack>
            
            <VStack spacing={1} align="stretch" flex="1">
              {dayEvents.slice(0, 2).map((event) => (
                <Box
                  key={event.id}
                  bg={useColorModeValue(`${getEventTypeColor(event.type)}.100`, `${getEventTypeColor(event.type)}.700`)}
                  color={useColorModeValue(`${getEventTypeColor(event.type)}.800`, `${getEventTypeColor(event.type)}.100`)}
                  p={1}
                  borderRadius="sm"
                  fontSize="xs"
                  noOfLines={1}
                >
                  {event.title}
                </Box>
              ))}
              
              {dayEvents.length > 2 && (
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  +{dayEvents.length - 2} more
                </Text>
              )}
            </VStack>
          </VStack>
        </GridItem>
      );
    }

    return (
      <Grid templateColumns="repeat(7, 1fr)" gap={0}>
        {days}
      </Grid>
    );
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.startTime) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields (title, start time)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      date: selectedDate.toISOString().split('T')[0],
    };

    setEvents(prev => [...prev, event]);
    
    toast({
      title: 'Success',
      description: 'Event added successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewEvent({
      title: '',
      description: '',
      type: 'meeting',
      startTime: '',
      endTime: '',
      project: '',
    });

    onEventClose();
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 6 }}>
      <VStack align="stretch" spacing={6} maxW="1400px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={2} flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="2xl" mb={2} color={textColor}>
              Calendar
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Manage your schedule and deadlines
            </Text>
          </Box>
          
          <HStack spacing={4}>
            {/* View Selector */}
            <ButtonGroup size="md" isAttached variant="outline">
              <Button
                leftIcon={<FaCalendar />}
                colorScheme={currentView === 'month' ? 'blue' : 'gray'}
                variant={currentView === 'month' ? 'solid' : 'outline'}
                onClick={() => setCurrentView('month')}
              >
                Month
              </Button>
              <Button
                leftIcon={<FaCalendarWeek />}
                colorScheme={currentView === 'week' ? 'blue' : 'gray'}
                variant={currentView === 'week' ? 'solid' : 'outline'}
                onClick={() => setCurrentView('week')}
              >
                Week
              </Button>
              <Button
                leftIcon={<FaCalendarDay />}
                colorScheme={currentView === 'day' ? 'blue' : 'gray'}
                variant={currentView === 'day' ? 'solid' : 'outline'}
                onClick={() => setCurrentView('day')}
              >
                Day
              </Button>
            </ButtonGroup>

            <Button 
              leftIcon={<FaPlus />} 
              colorScheme="blue" 
              onClick={onEventOpen}
              size="lg"
              shadow="md"
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
            >
              Add Event
            </Button>
          </HStack>
        </Flex>

        <Flex gap={6} direction={{ base: 'column', lg: currentView === 'month' ? 'row' : 'column' }}>
          {/* Calendar */}
          <Card bg={cardBg} borderColor={borderColor} shadow="sm" flex="1">
            <CardBody>
              {/* Calendar Header */}
              <Flex justify="space-between" align="center" mb={4}>
                <IconButton
                  icon={<FaChevronLeft />}
                  onClick={() => navigateMonth(-1)}
                  variant="ghost"
                  aria-label={`Previous ${currentView}`}
                  size="sm"
                />
                
                <Heading size="lg" color={textColor}>
                  {getNavigationLabel()}
                </Heading>
                
                <IconButton
                  icon={<FaChevronRight />}
                  onClick={() => navigateMonth(1)}
                  variant="ghost"
                  aria-label={`Next ${currentView}`}
                  size="sm"
                />
              </Flex>

              {/* Calendar Content */}
              {currentView === 'month' && renderMonthView()}
              {currentView === 'week' && renderWeekView()}
              {currentView === 'day' && renderDayView()}
            </CardBody>
          </Card>

          {/* Events for Selected Date - Only show in month view */}
          {currentView === 'month' && (
            <Card bg={cardBg} borderColor={borderColor} shadow="sm" minW={{ lg: '400px' }}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="md" mb={2} color={textColor}>
                      Events for {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                      {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
                    </Text>
                  </Box>

                  {selectedDateEvents.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Icon as={FaCalendarAlt} boxSize={12} color="gray.300" mb={4} />
                      <Text color="gray.500">No events scheduled for this date</Text>
                      <Button 
                        mt={4}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={onEventOpen}
                      >
                        Add Event
                      </Button>
                    </Box>
                  ) : (
                    <VStack spacing={3} align="stretch">
                      {selectedDateEvents.map((event) => (
                        <Box
                          key={event.id}
                          p={4}
                          borderRadius="lg"
                          border="1px"
                          borderColor={borderColor}
                          bg={useColorModeValue(`${getEventTypeColor(event.type)}.50`, `${getEventTypeColor(event.type)}.900`)}
                          _hover={{ 
                            transform: 'translateY(-2px)',
                            shadow: 'md',
                            transition: 'all 0.2s'
                          }}
                        >
                          <HStack justify="space-between" mb={2}>
                            <HStack>
                              <Icon 
                                as={getEventTypeIcon(event.type)} 
                                color={`${getEventTypeColor(event.type)}.500`}
                                boxSize={4}
                              />
                              <Text fontWeight="bold" color={textColor}>
                                {event.title}
                              </Text>
                            </HStack>
                            <Badge colorScheme={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </HStack>
                          
                          {event.description && (
                            <Text fontSize="sm" color="gray.600" mb={2}>
                              {event.description}
                            </Text>
                          )}
                          
                          <HStack justify="space-between" fontSize="sm" color="gray.500">
                            <Text>
                              {event.startTime} - {event.endTime || 'No end time'}
                            </Text>
                            {event.project && (
                              <Text fontWeight="medium">
                                {event.project}
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}
        </Flex>

        {/* Add Event Modal */}
        <Modal isOpen={isEventOpen} onClose={onEventClose} size="lg">
          <ModalOverlay />
          <ModalContent bg={cardBg}>
            <ModalHeader>
              <HStack>
                <Icon as={FaPlus} color="blue.500" />
                <Text>Add New Event</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title..."
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description..."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="meeting">Meeting</option>
                      <option value="task">Task</option>
                      <option value="review">Review</option>
                      <option value="deadline">Deadline</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Project</FormLabel>
                    <Select
                      value={newEvent.project}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, project: e.target.value }))}
                    >
                      <option value="">Select project...</option>
                      {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Time</FormLabel>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </FormControl>
                </HStack>

                <Box w="full" p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                  <Text fontSize="sm" color="gray.600">
                    <strong>Selected Date:</strong> {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEventClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleAddEvent}>
                Add Event
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Calendar;