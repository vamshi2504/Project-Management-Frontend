import apiClient from './apiClient';

// Fetch a user by ID
export const fetchUserById = async (userId) => {
  try {
    const data = await apiClient.get(`/users/${userId}`);
    return data;
  } catch (error) {
    console.warn(`Failed to fetch user ${userId}:`, error);
    return null;
  }
};

// Fetch multiple users by IDs (batch)
export const fetchUsersByIds = async (userIds) => {
  try {
    const data = await apiClient.post(`/users/batch`, { userIds });
    return data;
  } catch (error) {
    console.warn('Failed to fetch users batch:', error);
    return [];
  }
};
