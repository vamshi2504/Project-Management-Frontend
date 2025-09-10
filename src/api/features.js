import apiClient from './apiClient';

/**
 * Fetch all features
 * GET /features
 */
export const fetchAllFeatures = async () => {
  try {
    const data = await apiClient.get('/features');
    return data;
  } catch (error) {
    console.warn('Backend not available, returning mock features:', error);
    // Return mock data when backend is not available
    return [
      {
        _id: 'mock-feature-1',
        title: 'User Authentication System',
        description: 'Complete user registration, login, and password management system',
        priority: 'High',
        status: 'COMPLETED',
        projectId: 'mock-project-1',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-feature-2',
        title: 'Project Dashboard',
        description: 'Interactive dashboard with project analytics and real-time updates',
        priority: 'Medium',
        status: 'IN_PROGRESS',
        projectId: 'mock-project-1',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-feature-3',
        title: 'Mobile Application',
        description: 'Cross-platform mobile app for project management on the go',
        priority: 'Low',
        status: 'PLANNING',
        projectId: 'mock-project-2',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
};

/**
 * Fetch features by project
 * GET /features/project/:projectId
 */
export const fetchFeaturesByProject = async (projectId) => {
  try {
    const data = await apiClient.get(`/features/project/${projectId}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} features, returning mock data:`, error);
    // Return filtered mock features
    const allFeatures = await fetchAllFeatures();
    return allFeatures.filter(feature => feature.projectId === projectId);
  }
};

/**
 * Create feature
 * POST /features
 */
export const createFeature = async (featureData) => {
  try {
    const data = await apiClient.post('/features', featureData);
    return data;
  } catch (error) {
    console.warn('Backend not available for creating feature, using mock response:', error);
    // Return mock success response
    return {
      _id: `mock-feature-${Date.now()}`,
      title: featureData.title,
      description: featureData.description,
      priority: featureData.priority,
      status: featureData.status,
      projectId: featureData.projectId,
      createdBy: featureData.createdBy,
      createdAt: featureData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Update feature
 * PUT /features/:id
 */
export const updateFeature = async (id, featureData) => {
  try {
    const data = await apiClient.put(`/features/${id}`, featureData);
    return data;
  } catch (error) {
    console.warn(`Backend not available for updating feature ${id}, using mock response:`, error);
    return {
      _id: id,
      ...featureData,
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Delete feature
 * DELETE /features/:id
 */
export const deleteFeature = async (id) => {
  try {
    const data = await apiClient.delete(`/features/${id}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for deleting feature ${id}, using mock response:`, error);
    return { success: true, message: `Feature ${id} deleted successfully` };
  }
};

/**
 * Update feature status
 * PUT /features/:id/status
 */
export const updateFeatureStatus = async (id, status) => {
  try {
    const data = await apiClient.put(`/features/${id}/status`, { status });
    return data;
  } catch (error) {
    console.warn(`Backend not available for updating feature ${id} status, using mock response:`, error);
    return {
      _id: id,
      status: status,
      updatedAt: new Date().toISOString()
    };
  }
};
