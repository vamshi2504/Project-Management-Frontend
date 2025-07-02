import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
  Avatar,
  VStack,
  HStack,
  Input,
  Textarea,
  Icon,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { 
  FaArrowLeft, 
  FaUser, 
  FaClock, 
  FaComment, 
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaReply
} from 'react-icons/fa';

// Extended mock data with comments
const mockTasksWithComments = [
  {
    id: 1,
    title: 'Create Login Page',
    description: 'Design and develop login screen UI with modern authentication flow',
    status: 'To Do',
    assignedTo: 'Alice Johnson',
    dueDate: '2025-07-10',
    tags: ['Frontend', 'UI/UX'],
    priority: 'High',
    createdDate: '2025-06-25',
    projectName: 'Task Manager',
    comments: [
      {
        id: 1,
        author: 'Alice Johnson',
        content: 'Started working on the wireframes. Should have initial designs ready by tomorrow.',
        timestamp: '2025-07-01 10:30 AM',
        replies: [
          {
            id: 11,
            author: 'Bob Smith',
            content: 'Looks great! Make sure to include the forgot password flow.',
            timestamp: '2025-07-01 11:15 AM'
          }
        ]
      },
      {
        id: 2,
        author: 'Charlie Davis',
        content: 'Please ensure the design follows our accessibility guidelines.',
        timestamp: '2025-07-01 2:45 PM',
        replies: []
      }
    ]
  },
  {
    id: 2,
    title: 'Implement Task API',
    description: 'Create RESTful routes for task endpoints with proper validation',
    status: 'In Progress',
    assignedTo: 'Bob Smith',
    dueDate: '2025-07-08',
    tags: ['Backend', 'API'],
    priority: 'Medium',
    createdDate: '2025-06-20',
    projectName: 'Task Manager',
    comments: [
      {
        id: 3,
        author: 'Bob Smith',
        content: 'API endpoints are 70% complete. Working on input validation now.',
        timestamp: '2025-07-02 9:20 AM',
        replies: []
      }
    ]
  },
  {
    id: 3,
    title: 'Fix task list bug',
    description: 'Resolve issue with task filter not updating correctly',
    status: 'Done',
    assignedTo: 'Charlie Davis',
    dueDate: '2025-07-05',
    tags: ['Bug Fix', 'Frontend'],
    priority: 'Low',
    createdDate: '2025-06-28',
    projectName: 'Task Manager',
    comments: [
      {
        id: 4,
        author: 'Charlie Davis',
        content: 'Bug has been identified. Issue was with state management in the filter component.',
        timestamp: '2025-07-02 3:30 PM',
        replies: []
      },
      {
        id: 5,
        author: 'Charlie Davis',
        content: 'Fix has been implemented and tested. Ready for review.',
        timestamp: '2025-07-03 10:00 AM',
        replies: [
          {
            id: 51,
            author: 'Alice Johnson',
            content: 'Tested and confirmed the fix works. Great job!',
            timestamp: '2025-07-03 11:30 AM'
          }
        ]
      }
    ]
  }
];

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const commentBg = useColorModeValue('gray.50', 'gray.700');

  // Find the task by ID
  const task = mockTasksWithComments.find(t => t.id === parseInt(taskId));

  if (!task) {
    return (
      <Box px={8} py={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
        <VStack spacing={4} textAlign="center" mt={20}>
          <Heading size="lg" color={textColor}>Task Not Found</Heading>
          <Text color="gray.500">The task you're looking for doesn't exist.</Text>
          <Button colorScheme="blue" onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
        </VStack>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'gray';
      case 'In Progress': return 'blue';
      case 'Done': return 'green';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would make an API call
      console.log('Adding comment:', newComment);
      setNewComment('');
      onClose();
    }
  };

  const handleReply = (commentId) => {
    if (replyContent.trim()) {
      // In a real app, this would make an API call
      console.log('Adding reply to comment', commentId, ':', replyContent);
      setReplyContent('');
      setReplyTo(null);
    }
  };

  return (
    <Box px={8} py={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Back Button */}
      <Button
        leftIcon={<Icon as={FaArrowLeft} />}
        variant="ghost"
        colorScheme="blue"
        mb={6}
        onClick={() => navigate('/tasks')}
        _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
      >
        Back to Tasks
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Task Details - Left Column */}
        <Box gridColumn={{ base: 'span 1', lg: 'span 2' }}>
          {/* Task Header */}
          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
            mb={6}
          >
            <Flex justify="space-between" align="flex-start" mb={4}>
              <VStack align="start" spacing={2}>
                <Heading size="xl" color={textColor}>
                  {task.title}
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  {task.description}
                </Text>
              </VStack>
              <VStack spacing={2}>
                <Badge 
                  colorScheme={getStatusColor(task.status)}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {task.status}
                </Badge>
                <Badge 
                  colorScheme={getPriorityColor(task.priority)}
                  variant="outline"
                  borderRadius="full"
                  px={2}
                >
                  {task.priority}
                </Badge>
              </VStack>
            </Flex>

            <HStack spacing={4} flexWrap="wrap">
              {task.tags.map((tag, index) => (
                <Badge
                  key={index}
                  colorScheme="teal"
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                >
                  {tag}
                </Badge>
              ))}
            </HStack>
          </Box>

          {/* Comments Section */}
          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg" color={textColor}>
                Comments ({task.comments.length})
              </Heading>
              <Button
                leftIcon={<Icon as={FaPlus} />}
                colorScheme="blue"
                size="sm"
                onClick={onOpen}
              >
                Add Comment
              </Button>
            </Flex>

            <VStack spacing={4} align="stretch">
              {task.comments.map((comment) => (
                <Box key={comment.id}>
                  <Box
                    bg={commentBg}
                    borderRadius="xl"
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                  >
                    <Flex justify="space-between" align="center" mb={3}>
                      <HStack spacing={3}>
                        <Avatar name={comment.author} size="sm" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" color={textColor}>
                            {comment.author}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {comment.timestamp}
                          </Text>
                        </VStack>
                      </HStack>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaEllipsisV />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<FaEdit />}>Edit</MenuItem>
                          <MenuItem icon={<FaTrash />}>Delete</MenuItem>
                          <MenuItem 
                            icon={<FaReply />}
                            onClick={() => setReplyTo(comment.id)}
                          >
                            Reply
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                    <Text color={textColor}>{comment.content}</Text>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <Box mt={4} pl={4} borderLeft="2px" borderColor="blue.200">
                        {comment.replies.map((reply) => (
                          <Box key={reply.id} mb={3}>
                            <HStack spacing={2} mb={2}>
                              <Avatar name={reply.author} size="xs" />
                              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                                {reply.author}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {reply.timestamp}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color={textColor} ml={6}>
                              {reply.content}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Reply Input */}
                    {replyTo === comment.id && (
                      <Box mt={4}>
                        <HStack spacing={2}>
                          <Input
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            size="sm"
                          />
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => handleReply(comment.id)}
                          >
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Task Info Sidebar - Right Column */}
        <Box>
          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            boxShadow="xl"
            border="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={6} color={textColor}>
              Task Information
            </Heading>

            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Assigned To</Text>
                <HStack>
                  <Avatar name={task.assignedTo} size="sm" />
                  <Text fontWeight="semibold" color={textColor}>
                    {task.assignedTo}
                  </Text>
                </HStack>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Project</Text>
                <Text fontWeight="semibold" color={textColor}>
                  {task.projectName}
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Due Date</Text>
                <Text fontWeight="semibold" color={textColor}>
                  {formatDate(task.dueDate)}
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>Created</Text>
                <Text fontWeight="semibold" color={textColor}>
                  {formatDate(task.createdDate)}
                </Text>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>Actions</Text>
                <VStack spacing={2}>
                  <Button colorScheme="blue" size="sm" width="full">
                    Edit Task
                  </Button>
                  <Button colorScheme="green" size="sm" width="full">
                    Mark Complete
                  </Button>
                  <Button colorScheme="red" variant="outline" size="sm" width="full">
                    Delete Task
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </SimpleGrid>

      {/* Add Comment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Comment</FormLabel>
              <Textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
            </FormControl>
            <HStack spacing={3} mt={4}>
              <Button colorScheme="blue" onClick={handleAddComment}>
                Add Comment
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaskDetailsPage;
