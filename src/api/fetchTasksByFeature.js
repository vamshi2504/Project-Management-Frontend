// Fetch tasks by featureId
// GET /tasks/feature/:featureId
import apiClient from './apiClient';

export const fetchTasksByFeature = async (featureId) => {
  try {
    const data = await apiClient.get(`/tasks/feature/${featureId}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for feature ${featureId} tasks, returning mock data:`, error);
    // fallback: filter all tasks by featureId
    const allTasks = await import('./tasks').then(mod => mod.fetchAllTasks());
    return allTasks.filter(task => task.featureId === featureId);
  }
};
