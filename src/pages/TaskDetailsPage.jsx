import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, Text, Spinner, Button, Badge, VStack, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Textarea, useToast, Card, CardBody, CardHeader, Divider, Icon
} from '@chakra-ui/react';
import { FaEdit, FaClock, FaUser, FaComment } from 'react-icons/fa';
import { fetchTaskById, updateTask } from '../api/tasks';
import { fetchTaskComments, addTaskComment } from '../api/comments';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchTaskById(id).then(found => {
      setTask(found);
      setEditTask(found);
      setLoading(false);
    });
    fetchTaskComments(id).then(comments => {
      console.log('Fetched comments:', comments);
      setComments(comments || []);
      setCommentLoading(false);
    });
  }, [id]);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditTask(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await updateTask(id, editTask);
      setTask(editTask);
      toast({ title: 'Task updated', status: 'success' });
      handleEditClose();
    } catch (err) {
      toast({ title: 'Error updating task', description: err.message, status: 'error' });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setAddingComment(true);
    try {
      // Replace 'authorId' with actual user id if available
      await addTaskComment(id, newComment, 'authorId');
      setNewComment('');
      const updated = await fetchTaskComments(id);
      setComments(updated || []);
      toast({ title: 'Comment added', status: 'success' });
    } catch (err) {
      toast({ title: 'Error adding comment', description: err.message, status: 'error' });
    }
    setAddingComment(false);
  };




  // Modern dark theme colors
  const bgColor = 'gray.900';
  const cardBg = 'gray.800';
  const borderColor = 'gray.700';

  if (loading) return <Spinner />;
  if (!task) return <Box p={8}><Text>Task not found</Text></Box>;

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      {/* Gradient Banner Heading */}
      <Box
        w="100%"
        borderRadius="2xl"
        p={{ base: 6, md: 10 }}
        mb={6}
        bgGradient="linear(to-r, purple.500, blue.400, teal.400, green.400, orange.300)"
        boxShadow="lg"
        display="flex"
        alignItems="center"
      >
        <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="extrabold" color="white" mr={4}>
          📝
        </Text>
        <Box>
          <Text fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="extrabold" color="white" lineHeight="1.1">
            {task.title}
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} color="whiteAlpha.800" fontWeight="medium">
            Task Details & Comments
          </Text>
        </Box>
        <Button ml="auto" leftIcon={<FaEdit />} colorScheme="blue" onClick={handleEditOpen} borderRadius="xl" px={6} size="lg">
          Edit
        </Button>
      </Box>

      {/* Task Details Card */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="2xl" mb={8}>
        <CardHeader pb={0}>
          <HStack spacing={4} align="center">
            <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">{task.status}</Badge>
            <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">{task.priority}</Badge>
            <HStack spacing={2} ml={6}>
              <Icon as={FaUser} color="gray.400" />
              <Text color="gray.300" fontWeight="medium">Assigned to:</Text>
              <Text color="white" fontWeight="bold">{task.assignedTo || 'Unassigned'}</Text>
            </HStack>
            <HStack spacing={2} ml={6}>
              <Icon as={FaClock} color="gray.400" />
              <Text color="gray.300" fontWeight="medium">Due:</Text>
              <Text color="white" fontWeight="bold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</Text>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <Text color="gray.300" fontSize="lg" fontWeight="medium" mb={2}>Description</Text>
          <Text color="gray.100" fontSize="md" mb={2}>{task.description}</Text>
        </CardBody>
      </Card>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onClose={handleEditClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} border="1px" borderColor={borderColor}>
          <ModalHeader color="white">Edit Task</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel color="gray.300">Title</FormLabel>
                <Input name="title" value={editTask?.title || ''} onChange={handleEditChange} bg="gray.700" color="white" borderColor="gray.600" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="gray.300">Description</FormLabel>
                <Textarea name="description" value={editTask?.description || ''} onChange={handleEditChange} bg="gray.700" color="white" borderColor="gray.600" />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.300">Status</FormLabel>
                <Input name="status" value={editTask?.status || ''} onChange={handleEditChange} bg="gray.700" color="white" borderColor="gray.600" />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.300">Priority</FormLabel>
                <Input name="priority" value={editTask?.priority || ''} onChange={handleEditChange} bg="gray.700" color="white" borderColor="gray.600" />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.300">Due Date</FormLabel>
                <Input name="dueDate" type="date" value={editTask?.dueDate ? editTask.dueDate.split('T')[0] : ''} onChange={handleEditChange} bg="gray.700" color="white" borderColor="gray.600" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSave}>Save</Button>
            <Button variant="ghost" onClick={handleEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Comments Section - Modern Card */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="2xl">
        <CardHeader pb={0}>
          <HStack spacing={3} align="center">
            <Icon as={FaComment} color="purple.400" boxSize={5} />
            <Heading size="md" color="white">Comments</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          {commentLoading ? <Spinner /> : (
            <VStack align="stretch" spacing={4}>
              {comments.length === 0 ? (
                <Text color="gray.500">No comments yet.</Text>
              ) : comments.map((c, i) => (
                <Box key={c._id || i} p={4} bg="gray.700" borderRadius="xl" border="1px" borderColor="gray.600">
                  <Text fontWeight="bold" color="white">{c.authorName || c.authorId || 'User'}</Text>
                  <Text color="gray.200">{c.content}</Text>
                  <Text fontSize="xs" color="gray.400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</Text>
                </Box>
              ))}
            </VStack>
          )}
          <Divider my={6} borderColor="gray.600" />
          <HStack align="start">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              isDisabled={addingComment}
              bg="gray.700"
              color="white"
              borderColor="gray.600"
            />
            <Button colorScheme="blue" onClick={handleAddComment} isLoading={addingComment} borderRadius="xl" px={6}>
              Comment
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TaskDetailsPage;
