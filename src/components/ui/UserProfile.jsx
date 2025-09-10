import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Button,
  Heading,
  Divider,
  useToast,
  Flex,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaSignOutAlt, FaEdit, FaClock, FaCalendar } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  selectUser,
  selectUserProfile,
  selectUserPreferences,
  clearUser,
  updateLastActivity,
} from '../store/slices/userSlice';

const UserProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectUser);
  const profile = useSelector(selectUserProfile);
  const preferences = useSelector(selectUserPreferences);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleActivityUpdate = () => {
    dispatch(updateLastActivity());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      shadow="lg"
      maxW="400px"
      w="full"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Heading size="md" color="gray.800">
            User Profile
          </Heading>
          <Tooltip label="Logout">
            <Button
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={handleLogout}
              leftIcon={<Icon as={FaSignOutAlt} />}
            >
              Logout
            </Button>
          </Tooltip>
        </HStack>

        <Divider />

        {/* User Avatar and Basic Info */}
        <VStack spacing={3}>
          <Avatar
            size="xl"
            src={user.photoURL}
            name={user.displayName || user.email}
          />
          
          <VStack spacing={1} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {user.displayName || 'User'}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {user.email}
            </Text>
            
            {/* Provider Badge */}
            {user.provider && (
              <Badge
                colorScheme={user.provider === 'google.com' ? 'red' : 'gray'}
                variant="subtle"
              >
                {user.provider === 'google.com' ? 'Google' : 
                 user.provider === 'github.com' ? 'GitHub' : 
                 user.provider}
              </Badge>
            )}
            
            {/* Email Verification */}
            <Badge
              colorScheme={user.emailVerified ? 'green' : 'yellow'}
              variant="subtle"
            >
              {user.emailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </VStack>
        </VStack>

        <Divider />

        {/* Profile Information */}
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Profile Information
          </Text>
          
          {profile.firstName || profile.lastName ? (
            <HStack>
              <Text fontSize="sm" color="gray.600">Name:</Text>
              <Text fontSize="sm" fontWeight="medium">
                {`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Not set'}
              </Text>
            </HStack>
          ) : null}
          
          {profile.department && (
            <HStack>
              <Text fontSize="sm" color="gray.600">Department:</Text>
              <Text fontSize="sm" fontWeight="medium">{profile.department}</Text>
            </HStack>
          )}
          
          {profile.role && (
            <HStack>
              <Text fontSize="sm" color="gray.600">Role:</Text>
              <Badge colorScheme="blue" variant="subtle" size="sm">
                {profile.role}
              </Badge>
            </HStack>
          )}
        </VStack>

        <Divider />

        {/* Activity Information */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Activity
          </Text>
          
          <HStack>
            <Icon as={FaClock} color="gray.500" boxSize={3} />
            <Text fontSize="xs" color="gray.600">Last Activity:</Text>
            <Text fontSize="xs" fontWeight="medium">
              {formatTime(user.lastActivity)}
            </Text>
          </HStack>
          
          {profile.joinDate && (
            <HStack>
              <Icon as={FaCalendar} color="gray.500" boxSize={3} />
              <Text fontSize="xs" color="gray.600">Joined:</Text>
              <Text fontSize="xs" fontWeight="medium">
                {formatDate(profile.joinDate)}
              </Text>
            </HStack>
          )}
        </VStack>

        <Divider />

        {/* Preferences */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            Preferences
          </Text>
          
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.600">Theme:</Text>
            <Badge
              colorScheme={preferences.theme === 'dark' ? 'purple' : 'yellow'}
              variant="subtle"
              size="sm"
            >
              {preferences.theme}
            </Badge>
          </HStack>
          
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.600">Notifications:</Text>
            <Badge
              colorScheme={preferences.notifications ? 'green' : 'red'}
              variant="subtle"
              size="sm"
            >
              {preferences.notifications ? 'Enabled' : 'Disabled'}
            </Badge>
          </HStack>
        </VStack>

        <Divider />

        {/* Action Buttons */}
        <Flex gap={2}>
          <Button
            size="sm"
            variant="outline"
            flex="1"
            leftIcon={<Icon as={FaEdit} />}
            onClick={() => {
              // TODO: Open profile edit modal
              toast({
                title: 'Profile editing coming soon!',
                status: 'info',
                duration: 2000,
              });
            }}
          >
            Edit Profile
          </Button>
          
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={handleActivityUpdate}
          >
            Update Activity
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default UserProfile;
