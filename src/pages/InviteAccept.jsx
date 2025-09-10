import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Box, Button, Heading, Text, Spinner, useToast, VStack } from '@chakra-ui/react';
import { addUserToProject } from '../api/projectMembers';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const InviteAccept = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('Member');

  console.log("logged in user", user);

  useEffect(() => {
  const emailParam = query.get('email');
  const projectIdParam = query.get('projectId');
  const roleParam = query.get('role');
  setEmail(emailParam || '');
  setProjectId(projectIdParam || '');
  setRole(roleParam || 'Member');
  }, [query]);

  // Always preserve both projectId and email in redirect
  const getInviteRedirect = () => {
    // Use current values or fallback to query params
    let pid = projectId || query.get('projectId') || '';
    let eml = email || query.get('email') || '';
    if (!pid || !eml) return null;
    return `/invite/accept?projectId=${encodeURIComponent(pid)}&email=${encodeURIComponent(eml)}`;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    // Only redirect to login if both projectId and email are present
    if (!authLoading && !user && projectId && email) {
      const redirectUrl = getInviteRedirect();
      if (redirectUrl) {
        navigate(`/?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [authLoading, user, email, projectId, navigate]);

  // Helper to get the best available email from user object
  const getUserEmail = (user) => {
    if (!user) return null;
    return user.email || (user.providerData && user.providerData[0] && user.providerData[0].email) || null;
  };

  const handleLoginAndJoin = async () => {
    setLoading(true);
    setError('');
    try {
      const loggedInEmail = getUserEmail(user);
      if (!user || loggedInEmail !== email) {
        setError('You are logged in as a different Google account. Please sign out and log in as the invited email.');
        setLoading(false);
        return;
      }
  // Add user to project (backend call) with correct role
  await addUserToProject(projectId, user.uid, role || 'Member');
  toast({ title: 'Joined project successfully!', status: 'success' });
  navigate(`/project/${projectId}`);
    } catch (err) {
      setError(err.message || 'Failed to join project.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !projectId) {
    return (
      <Box p={8} textAlign="center">
        <Heading size="md">Invalid Invite Link</Heading>
        <Text mt={4}>The invite link is missing required information.</Text>
      </Box>
    );
  }
  if (authLoading || !user) {
    // Show nothing or a loading spinner while redirecting
    return null;
  }

  const loggedInEmail = getUserEmail(user);
  const emailMismatch = user && loggedInEmail && email && loggedInEmail !== email;
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
      <VStack spacing={6} bg="gray.800" p={8} borderRadius="xl" boxShadow="xl">
        <Heading size="lg" color="white">Accept Project Invitation</Heading>
        <Text color="gray.300">You are invited to join the project as <b>{email}</b>.</Text>
        {emailMismatch && (
          <Text color="red.400">
            You are logged in as <b>{loggedInEmail}</b>.<br />
            Please sign out and log in as <b>{email}</b> to accept this invite.
          </Text>
        )}
        {error && <Text color="red.400">{error}</Text>}
        <Button colorScheme="blue" onClick={handleLoginAndJoin} isLoading={loading} isDisabled={emailMismatch}>
          {emailMismatch ? 'Switch Google Account to Join Project' : 'Login with Google & Join Project'}
        </Button>
        {loading && <Spinner color="blue.400" />}
      </VStack>
    </Box>
  );
};

export default InviteAccept;
