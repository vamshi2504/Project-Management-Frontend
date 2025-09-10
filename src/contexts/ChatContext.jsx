import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import chatService from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [groups, setGroups] = useState([]); // project-based groups
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      connectToChat();
      loadUserProjectGroups();
    } else {
      disconnectFromChat();
    }

    return () => {
      disconnectFromChat();
    };
  }, [user]);

  const connectToChat = () => {
    if (!user) return;
    chatService.connectWebSocket(user.uid, handleNewMessage);
    setIsConnected(true);
  };

  const disconnectFromChat = () => {
    chatService.disconnectWebSocket();
    setIsConnected(false);
    setGroups([]);
    setMessages({});
    setUnreadCounts({});
  };

  /**
   * Load groups only for projects where the user is a member
   */
  const loadUserProjectGroups = async () => {
    if (!user) return;

    try {

      const unsubscribe = chatService.subscribeToGroups(user.uid, (updatedGroups) => {
        setGroups(updatedGroups); // each project = group
        updatedGroups.forEach(project => {
          if (!messages[project.id]) {
            loadGroupMessages(project.id);
          }
        });
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading project groups:', error);
    }
  };

  const loadGroupMessages = (groupId) => {
    setLoading(true);
    const unsubscribe = chatService.subscribeToGroupMessages(groupId, (groupMessages) => {
      setMessages(prev => ({
        ...prev,
        [groupId]: groupMessages
      }));
      updateUnreadCount(groupId, groupMessages);
      setLoading(false);
    });
    return unsubscribe;
  };

  const handleNewMessage = (groupId, groupMessages) => {
    setMessages(prev => ({
      ...prev,
      [groupId]: groupMessages
    }));
    updateUnreadCount(groupId, groupMessages);
  };

  const updateUnreadCount = (groupId, groupMessages) => {
    if (!user || !groupMessages) return;

    const unreadCount = groupMessages.filter(
      message =>
        message.senderId !== user.uid &&
        !message.readBy?.includes(user.uid)
    ).length;

    setUnreadCounts(prev => ({
      ...prev,
      [groupId]: unreadCount
    }));
  };

  const sendMessage = async (groupId, messageData) => {
    if (!user) throw new Error('User not authenticated');
    // If file is present, use uploadFile endpoint
    if (messageData.file) {
      return await chatService.uploadFile(groupId, messageData.file, user.uid, messageData.text);
    }
    // Always send plain text message to backend
    return await chatService.sendMessage(groupId, {
      userId: user.uid,
      userName: user.displayName || user.email,
      userAvatar: user.photoURL,
      text: messageData.text
    });
  };

  // Add reaction to a message
  const addReaction = async (groupId, messageId, emoji) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await chatService.addReaction(groupId, messageId, user.uid, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  // Upload file and return URL
  const uploadFile = async (groupId, file) => {
    if (!user) throw new Error('User not authenticated');
    try {
      return await chatService.uploadFile(groupId, file);
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  /**
   * Instead of free groups, groups are created with projects
   */
  const createProjectGroup = async (projectData) => {
    if (!user) throw new Error('User not authenticated');

    return await chatService.createGroup({
      id: projectData.id, // projectId = groupId
      name: `${projectData.name} Chat`,
      createdBy: user.uid,
      members: projectData.members, // all project members
    });
  };

  const value = {
    // State
    user,
    groups,
    selectedGroup,
    messages,
    unreadCounts,
    isConnected,
    loading,

    // Actions
    setSelectedGroup,
    sendMessage,
    addReaction,
    uploadFile,
    createProjectGroup,

    // Utilities
    getGroupMessages: (groupId) => messages[groupId] || [],
    getGroupUnreadCount: (groupId) => unreadCounts[groupId] || 0,
    getTotalUnreadCount: () =>
      Object.values(unreadCounts).reduce((total, count) => total + count, 0),
  };

  // Add this after the definition of loadGroupMessages and before the return statement
  useEffect(() => {
    if (selectedGroup && selectedGroup.id) {
      loadGroupMessages(selectedGroup.id);
    }
    // Optionally, clean up previous polling interval if needed
    // return () => { ... };
  }, [selectedGroup]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
