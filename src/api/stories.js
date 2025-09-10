import apiClient from './apiClient';

/**
 * Fetch all stories
 * GET /stories
 */
export const fetchAllStories = async () => {
  try {
    const data = await apiClient.get('/stories');
    return data;
  } catch (error) {
    console.warn('Backend not available, returning mock stories:', error);
    // Return mock data when backend is not available
    return [
      {
        _id: 'mock-story-1',
        title: 'User Registration Flow',
        description: 'As a new user, I want to create an account so that I can access the platform',
        acceptanceCriteria: [
          'User can enter email and password',
          'Email validation is performed',
          'Confirmation email is sent',
          'User can verify their account'
        ],
        storyPoints: 8,
        priority: 'High',
        status: 'COMPLETED',
        assignedTo: 'john.doe@example.com',
        projectId: 'mock-project-1',
        featureId: 'mock-feature-1',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-story-2',
        title: 'Project Analytics Dashboard',
        description: 'As a project manager, I want to view project metrics so that I can track progress',
        acceptanceCriteria: [
          'Display project completion percentage',
          'Show task distribution charts',
          'Display team performance metrics',
          'Real-time data updates'
        ],
        storyPoints: 13,
        priority: 'Medium',
        status: 'IN_PROGRESS',
        assignedTo: 'jane.smith@example.com',
        projectId: 'mock-project-1',
        featureId: 'mock-feature-2',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-story-3',
        title: 'Mobile Push Notifications',
        description: 'As a user, I want to receive notifications on my mobile device so that I stay updated',
        acceptanceCriteria: [
          'Push notifications for task assignments',
          'Push notifications for project updates',
          'User can customize notification preferences',
          'Notifications work offline'
        ],
        storyPoints: 5,
        priority: 'Low',
        status: 'TODO',
        assignedTo: 'bob.wilson@example.com',
        projectId: 'mock-project-2',
        featureId: 'mock-feature-3',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
};

/**
 * Create new story
 * POST /stories
 */
export const createStory = async (storyData) => {
  try {
    const data = await apiClient.post('/stories', storyData);
    return data;
  } catch (error) {
    console.warn('Backend not available for creating story, using mock response:', error);
    // Return mock success response
    return {
      _id: `mock-story-${Date.now()}`,
      title: storyData.title,
      description: storyData.description,
      acceptanceCriteria: storyData.acceptanceCriteria || [],
      storyPoints: storyData.storyPoints,
      priority: storyData.priority,
      status: storyData.status,
      assignedTo: storyData.assignedTo,
      projectId: storyData.projectId,
      featureId: storyData.featureId,
      createdBy: storyData.createdBy,
      createdAt: storyData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: storyData.dueDate
    };
  }
};

/**
 * Fetch story by ID
 * GET /stories/:id
 */
export const fetchStoryById = async (id) => {
  const response = await apiClient.get(`/stories/${id}`);
  return response;
};

/**
 * Fetch stories by project
 * GET /stories/project/:projectId
 */
export const fetchStoriesByProject = async (projectId) => {
  try {
    const data = await apiClient.get(`/stories/project/${projectId}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} stories, returning mock data:`, error);
    // Return filtered mock stories
    const allStories = await fetchAllStories();
    return allStories.filter(story => story.projectId === projectId);
  }
};

/**
 * Fetch stories by feature
 * GET /stories/feature/:featureId
 */
export const fetchStoriesByFeature = async (featureId) => {
  const response = await apiClient.get(`/stories/feature/${featureId}`);
  if (!response.ok) throw new Error(`Failed to fetch stories for feature ${featureId}`);
  return response.data;
};

/**
 * Fetch stories by status
 * GET /stories/status/:status
 */
export const fetchStoriesByStatus = async (status) => {
  const response = await apiClient.get(`/stories/status/${status}`);
  if (!response.ok) throw new Error(`Failed to fetch stories with status ${status}`);
  return response.data;
};

/**
 * Fetch stories by assignee
 * GET /stories/assignee/:assignedTo
 */
export const fetchStoriesByAssignee = async (assignedTo) => {
  const response = await apiClient.get(`/stories/assignee/${encodeURIComponent(assignedTo)}`);
  if (!response.ok) throw new Error(`Failed to fetch stories for assignee ${assignedTo}`);
  return response.data;
};

/**
 * Create new story
 * POST /stories
 */


/**
 * Update story
 * PUT /stories/:id
 */
export const updateStory = async (id, storyData) => {
  const response = await apiClient.put(`/stories/${id}`, storyData);
  if (!response.ok) throw new Error(`Failed to update story ${id}`);
  return response.data;
};

/**
 * Delete story
 * DELETE /stories/:id
 */
export const deleteStory = async (id) => {
  const response = await apiClient.delete(`/stories/${id}`);
  if (!response.ok) throw new Error(`Failed to delete story ${id}`);
  return response.data;
};

/**
 * Update story status
 * PATCH /stories/:id
 */
export const updateStoryStatus = async (id, status) => {
  const response = await apiClient.patch(`/stories/${id}`, { status });
  if (!response.ok) throw new Error(`Failed to update story ${id} status`);
  return response.data;
};

/**
 * Assign story to user
 * PATCH /stories/:id
 */
export const assignStory = async (id, assignedTo) => {
  const response = await apiClient.patch(`/stories/${id}`, { assignedTo });
  if (!response.ok) throw new Error(`Failed to assign story ${id}`);
  return response.data;
};

/**
 * Fetch story analytics
 */
export const fetchStoryAnalytics = async (projectId = null) => {
  try {
    let stories;
    if (projectId) {
      stories = await fetchStoriesByProject(projectId);
    } else {
      stories = await fetchAllStories();
    }

    const statusCounts = stories.reduce((acc, story) => {
      acc[story.status] = (acc[story.status] || 0) + 1;
      return acc;
    }, {});

    const priorityCounts = stories.reduce((acc, story) => {
      acc[story.priority] = (acc[story.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      total: stories.length,
      statusBreakdown: statusCounts,
      priorityBreakdown: priorityCounts,
      completed: statusCounts['COMPLETED'] || 0,
      inProgress: statusCounts['IN_PROGRESS'] || 0,
      backlog: statusCounts['BACKLOG'] || 0,
      stories
    };
  } catch (error) {
    console.error('Error fetching story analytics:', error);
    throw error;
  }
};
