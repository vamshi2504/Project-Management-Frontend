import apiClient from './apiClient';
/**
 * Invite a user to join a project (sends invite email)
 * POST /project-members/invite
 * @param {Object} inviteData { projectId, email, role }
 */
export const inviteProjectMember = async (inviteData) => {
  const response = await apiClient.post('/project-members/invite', inviteData);
  if (!response.ok) throw new Error('Failed to send invite');
  return response.data;
};

/**
 * Fetch all project members
 * GET /project-members
 */
export const fetchAllProjectMembers = async () => {
  const response = await apiClient.get('/project-members');
  if (!response.ok) throw new Error("Failed to fetch project members");
  return response.data;
};

/**
 * Fetch project member by ID
 * GET /project-members/:id
 */
export const fetchProjectMemberById = async (id) => {
  const response = await apiClient.get(`/project-members/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch project member ${id}`);
  return response.data;
};

/**
 * Fetch members by project
 * GET /project-members/project/:projectId
 */
export const fetchMembersByProject = async (projectId) => {
  const response = await apiClient.get(`/project-members/project/${projectId}`);
  if (!response.ok) throw new Error(`Failed to fetch members for project ${projectId}`);
  return response.data;
};

/**
 * Fetch projects by user
 * GET /project-members/user/:userId
 */
export const fetchProjectsByUser = async (userId) => {
  const response = await apiClient.get(`/project-members/user/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch projects for user ${userId}`);
  return response.data;
};

/**
 * Fetch members by role
 * GET /project-members/role/:role
 */
export const fetchMembersByRole = async (role) => {
  const response = await apiClient.get(`/project-members/role/${role}`);
  if (!response.ok) throw new Error(`Failed to fetch members with role ${role}`);
  return response.data;
};

/**
 * Create new project member
 * POST /project-members
 */
export const createProjectMember = async (memberData) => {
  const response = await apiClient.post('/project-members', memberData);
  if (!response.ok) throw new Error("Failed to create project member");
  return response.data;
};

/**
 * Update project member
 * PUT /project-members/:id
 */
export const updateProjectMember = async (id, memberData) => {
  const response = await apiClient.put(`/project-members/${id}`, memberData);
  if (!response.ok) throw new Error(`Failed to update project member ${id}`);
  return response.data;
};

/**
 * Delete project member
 * DELETE /project-members/:id
 */
export const deleteProjectMember = async (id) => {
  const response = await apiClient.delete(`/project-members/${id}`);
  if (!response.ok) throw new Error(`Failed to delete project member ${id}`);
  return response.data;
};

/**
 * Add user to project
 * POST /project-members
 */
export const addUserToProject = async (projectId, userId, role = 'MEMBER', permissions = []) => {
  return await createProjectMember({
    projectId,
    userId,
    role,
    permissions
  });
};

/**
 * Remove user from project
 * DELETE /project-members/:id
 */
export const removeUserFromProject = async (projectId, userId) => {
  const members = await fetchMembersByProject(projectId);
  const member = members.find(m => m.userId === userId);
  if (member) {
    return await deleteProjectMember(member.id);
  }
  throw new Error('User not found in project');
};

/**
 * Update user role in project
 * PUT /project-members/:id
 */
export const updateUserRole = async (projectId, userId, newRole) => {
  const members = await fetchMembersByProject(projectId);
  const member = members.find(m => m.userId === userId);
  if (member) {
    return await updateProjectMember(member.id, { ...member, role: newRole });
  }
  throw new Error('User not found in project');
};

/**
 * Check if user is member of project
 */
export const isUserMemberOfProject = async (projectId, userId) => {
  try {
    const members = await fetchMembersByProject(projectId);
    return members.some(member => member.userId === userId);
  } catch (error) {
    console.error('Error checking project membership:', error);
    return false;
  }
};

/**
 * Get user role in project
 */
export const getUserRoleInProject = async (projectId, userId) => {
  try {
    const members = await fetchMembersByProject(projectId);
    const member = members.find(m => m.userId === userId);
    return member ? member.role : null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
