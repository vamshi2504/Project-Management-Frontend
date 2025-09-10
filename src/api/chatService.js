import axios from 'axios';

const API_BASE = import.meta.env.VITE_REACT_APP_CHAT_BACKEND_URL || 'http://localhost:5001';

export const fetchMessages = async (groupId) => {
  const res = await axios.get(`${API_BASE}/api/groups/${groupId}/messages`);
  return res.data.messages || [];
};

export const sendMessage = async (groupId, message) => {
  const res = await axios.post(`${API_BASE}/api/groups/${groupId}/messages`, message);
  return res.data.message;
};

export const uploadFile = async (groupId, formData) => {
  const res = await axios.post(`${API_BASE}/api/groups/${groupId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.file;
};

export const addReaction = async (groupId, messageId, userId, emoji) => {
  await axios.post(`${API_BASE}/api/groups/${groupId}/messages/${messageId}/reaction`, { userId, emoji });
};
