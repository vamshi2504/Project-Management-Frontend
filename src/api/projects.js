import apiClient from './apiClient';

/**
 * Fetch all projects
 * GET /projects
 */
export const fetchAllProjects = async () => {
  try {
    const data = await apiClient.get('/projects');
    return data;
  } catch (error) {
    console.warn('Backend not available, returning mock projects:', error);
    // Return mock data when backend is not available
    return [
      {
        _id: 'mock-project-1',
        name: 'Project Management System',
        description: 'A comprehensive project management solution',
        ownerId: 'ZPXK5pumebgaDUtHhfc4CEWdD782', // Use actual user ID
        status: 'ACTIVE',
        priority: 'High',
        startDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['development', 'web', 'management'],
        teamMembers: [
          { userId: 'ZPXK5pumebgaDUtHhfc4CEWdD782', role: 'Project Manager' },
          { userId: 'user2', role: 'Developer' },
          { userId: 'user3', role: 'Designer' }
        ],
        progress: 65,
        budget: 50000,
        actualBudget: 32000,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        _class: 'com.ProjectManagementAPI.ProjectManagementAPI.Entity.Project'
      },
      {
        _id: 'mock-project-2',
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for customer engagement',
        ownerId: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        status: 'IN_PROGRESS',
        priority: 'Medium',
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['mobile', 'react-native', 'app'],
        teamMembers: [
          { userId: 'ZPXK5pumebgaDUtHhfc4CEWdD782', role: 'Product Owner' },
          { userId: 'user4', role: 'Mobile Developer' },
          { userId: 'user5', role: 'UI/UX Designer' }
        ],
        progress: 40,
        budget: 75000,
        actualBudget: 25000,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        _class: 'com.ProjectManagementAPI.ProjectManagementAPI.Entity.Project'
      },
      {
        _id: 'mock-project-3',
        name: 'E-commerce Platform',
        description: 'Modern e-commerce solution with advanced analytics',
        ownerId: 'user6',
        status: 'PLANNING',
        priority: 'High',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['e-commerce', 'analytics', 'microservices'],
        teamMembers: [
          { userId: 'user6', role: 'Technical Lead' },
          { userId: 'user7', role: 'Backend Developer' },
          { userId: 'user8', role: 'Frontend Developer' },
          { userId: 'user9', role: 'DevOps Engineer' }
        ],
        progress: 5,
        budget: 120000,
        actualBudget: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        _class: 'com.ProjectManagementAPI.ProjectManagementAPI.Entity.Project'
      }
    ];
  }
};

/**
 * Fetch projects by user
 * GET /projects/user/:userId
 */
export const fetchProjectsByUser = async (userId) => {
  try {
    // For now, fetch all projects and filter on frontend until backend endpoint is ready
    const allProjects = await fetchAllProjects();
    // Filter projects where user is owner or in teamMembers
    return allProjects.filter(project => 
      project.ownerId === userId || 
      (project.teamMembers && project.teamMembers.some(member => member.userId === userId))
    );
  } catch (error) {
    console.warn('Error fetching user projects, returning all projects:', error);
    // Return all projects as fallback
    return await fetchAllProjects();
  }
};

/**
 * Fetch project by ID
 * GET /projects/:id
 */
export const fetchProjectById = async (id) => {
  try {
    const data = await apiClient.get(`/projects/${id}`);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch project ${id}`);
  }
};

/**
 * Create new project
 * POST /projects
 */
export const createProject = async (projectData) => {
  try {
    const data = await apiClient.post('/projects', projectData);
    return data;
  } catch (error) {
    throw new Error("Failed to create project");
  }
};

/**
 * Update project
 * PUT /projects/:id
 */
export const updateProject = async (id, projectData) => {
  try {
    const data = await apiClient.put(`/projects/${id}`, projectData);
    return data;
  } catch (error) {
    throw new Error(`Failed to update project ${id}`);
  }
};

/**
 * Delete project
 * DELETE /projects/:id
 */
export const deleteProject = async (id) => {
  try {
    const data = await apiClient.delete(`/projects/${id}`);
    return data;
  } catch (error) {
    throw new Error(`Failed to delete project ${id}`);
  }
};

/**
 * Fetch project tasks
 * GET /projects/:projectId/tasks
 */
export const fetchProjectTasks = async (projectId) => {
  try {
    // Import and use the tasks API
    const { fetchTasksByProject } = await import('./tasks');
    return await fetchTasksByProject(projectId);
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} tasks, returning empty array:`, error);
    return [];
  }
};

/**
 * Fetch project features
 * GET /projects/:projectId/features
 */
export const fetchProjectFeatures = async (projectId) => {
  try {
    // Import and use the features API
    const { fetchFeaturesByProject } = await import('./features');
    return await fetchFeaturesByProject(projectId);
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} features, returning empty array:`, error);
    return [];
  }
};

/**
 * Fetch project stories
 * GET /projects/:projectId/stories
 */
export const fetchProjectStories = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/stories`);
  if (!response.ok) throw new Error(`Failed to fetch stories for project ${projectId}`);
  return response.data;
};

/**
 * Fetch project members
 * GET /projects/:projectId/members
 */
export const fetchProjectMembers = async (projectId) => {
  try {
    const data = await apiClient.get(`/projects/${projectId}/members`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} members:`, error);
    // Return empty array if backend is not available
    return [];
  }
};

/**
 * Add project member
 * POST /projects/:projectId/members
 */
export const addProjectMember = async (projectId, memberData) => {
  try {
    const data = await apiClient.post(`/projects/${projectId}/members`, memberData);
    return data;
  } catch (error) {
    console.warn('Backend not available for adding member, using mock response:', error);
    // Return mock success response
    return {
      _id: `mock-member-${Date.now()}`,
      email: memberData.email,
      role: memberData.role,
      joinedAt: new Date().toISOString(),
      addedBy: memberData.addedBy
    };
  }
};

/**
 * Update project member
 * PUT /projects/:projectId/members/:memberId
 */
export const updateProjectMember = async (projectId, memberId, memberData) => {
  const response = await apiClient.put(`/projects/${projectId}/members/${memberId}`, memberData);
  if (!response.ok) throw new Error(`Failed to update member ${memberId} in project ${projectId}`);
  return response.data;
};

/**
 * Remove project member
 * DELETE /projects/:projectId/members/:memberId
 */
export const removeProjectMember = async (projectId, memberId) => {
  const response = await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
  if (!response.ok) throw new Error(`Failed to remove member ${memberId} from project ${projectId}`);
  return response.data;
};

/**
 * Fetch project analytics
 */
export const fetchProjectAnalytics = async (projectId) => {
  try {
    const [tasks, features, stories] = await Promise.all([
      fetchProjectTasks(projectId),
      fetchProjectFeatures(projectId),
      fetchProjectStories(projectId)
    ]);

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'COMPLETED').length,
      totalFeatures: features.length,
      completedFeatures: features.filter(feature => feature.status === 'COMPLETED').length,
      totalStories: stories.length,
      completedStories: stories.filter(story => story.status === 'COMPLETED').length,
      tasks,
      features,
      stories
    };
  } catch (error) {
    console.error('Error fetching project analytics:', error);
    throw error;
  }
};
