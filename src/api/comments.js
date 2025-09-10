import apiClient from './apiClient';

/**
 * Fetch all comments
 * GET /comments
 */
export const fetchAllComments = async () => {
  const response = await apiClient.get('/comments');
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.data;
};

/**
 * Fetch comment by ID
 * GET /comments/:id
 */
export const fetchCommentById = async (id) => {
  const response = await apiClient.get(`/comments/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch comment ${id}`);
  return response.data;
};

/**
 * Fetch comments by entityId (task, story, feature)
 * GET /comments/entity/:entityId
 */
export const fetchCommentsByEntity = async (entityId) => {
  const response = await apiClient.get(`/comments/entity/${entityId}`);
  return response;
};

/**
 * Fetch comments by author
 * GET /comments/author/:authorId
 */
export const fetchCommentsByAuthor = async (authorId) => {
  const response = await apiClient.get(`/comments/author/${authorId}`);
  if (!response.ok) throw new Error(`Failed to fetch comments by author ${authorId}`);
  return response.data;
};

/**
 * Create new comment
 * POST /comments
 */
export const createComment = async (commentData) => {
  const response = await apiClient.post('/comments', commentData);
  if (!response.ok) throw new Error("Failed to create comment");
  return response.data;
};

/**
 * Update comment
 * PUT /comments/:id
 */
export const updateComment = async (id, commentData) => {
  const response = await apiClient.put(`/comments/${id}`, commentData);
  if (!response.ok) throw new Error(`Failed to update comment ${id}`);
  return response.data;
};

/**
 * Delete comment
 * DELETE /comments/:id
 */
export const deleteComment = async (id) => {
  const response = await apiClient.delete(`/comments/${id}`);
  if (!response.ok) throw new Error(`Failed to delete comment ${id}`);
  return response.data;
};

/**
 * Fetch comments for any entity (task, story, feature)
 * GET /comments/entity/:entityId
 */
export const fetchTaskComments = async (taskId) => {
  return await fetchCommentsByEntity(taskId);
};
export const fetchStoryComments = async (storyId) => {
  return await fetchCommentsByEntity(storyId);
};
export const fetchFeatureComments = async (featureId) => {
  return await fetchCommentsByEntity(featureId);
};

/**
 * Add comment to any entity (task, story, feature)
 * POST /comments
 */
export const addTaskComment = async (taskId, content, userId) => {
  return await createComment({
    entityId: taskId,
    content,
    userId
  });
};
export const addStoryComment = async (storyId, content, userId) => {
  return await createComment({
    entityId: storyId,
    content,
    userId
  });
};
export const addFeatureComment = async (featureId, content, userId) => {
  return await createComment({
    entityId: featureId,
    content,
    userId
  });
};
