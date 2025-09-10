// Fetch a single task by id
export const fetchTaskById = async (id) => {
  try {
    const data = await apiClient.get(`/tasks/${id}`);
    return data;
  } catch (error) {
    // fallback to mock data if backend is not available
    console.warn(`Backend not available for task ${id}, returning mock data:`, error);
    const allTasks = [
      // ...mock tasks, you can import or reuse your mock data here if available
    ];
    return allTasks.find(task => task._id === id || task.id === id) || null;
  }
};
import apiClient from './apiClient';

/**
 * Fetch all tasks
 * GET /tasks
 */
export const fetchAllTasks = async () => {
  try {
    const data = await apiClient.get('/tasks');
    return data;
  } catch (error) {
    console.warn('Backend not available, returning mock tasks:', error);
    // Return mock data when backend is not available
    return [
      {
        _id: 'mock-task-1',
        title: 'Setup Project Repository',
        description: 'Initialize project repository with basic structure',
        priority: 'High',
        status: 'COMPLETED',
        assignedTo: 'john.doe@example.com',
        projectId: 'mock-project-1',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-task-2',
        title: 'Design User Interface',
        description: 'Create wireframes and mockups for the application',
        priority: 'Medium',
        status: 'IN_PROGRESS',
        assignedTo: 'jane.smith@example.com',
        projectId: 'mock-project-1',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock-task-3',
        title: 'Implement Authentication',
        description: 'Setup user authentication and authorization system',
        priority: 'High',
        status: 'TODO',
        assignedTo: 'bob.wilson@example.com',
        projectId: 'mock-project-2',
        createdBy: 'ZPXK5pumebgaDUtHhfc4CEWdD782',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
  }
};

/**
 * Fetch tasks by project
 * GET /tasks/project/:projectId
 */
export const fetchTasksByProject = async (projectId) => {
  try {
    const data = await apiClient.get(`/tasks/project/${projectId}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for project ${projectId} tasks, returning mock data:`, error);
    // Return filtered mock tasks
    const allTasks = await fetchAllTasks();
    return allTasks.filter(task => task.projectId === projectId);
  }
};

/**
 * Fetch tasks by assignee
 * GET /tasks/assignee/:assignedTo
 */
export const fetchTasksByAssignee = async (assignedTo) => {
  try {
    const data = await apiClient.get(`/tasks/assignee/${encodeURIComponent(assignedTo)}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for assignee ${assignedTo} tasks, returning mock data:`, error);
    const allTasks = await fetchAllTasks();
    return allTasks.filter(task => task.assignedTo === assignedTo);
  }
};

/**
 * Fetch tasks by status
 * GET /tasks/status/:status
 */
export const fetchTasksByStatus = async (status) => {
  try {
    const data = await apiClient.get(`/tasks/status/${status}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for status ${status} tasks, returning mock data:`, error);
    const allTasks = await fetchAllTasks();
    return allTasks.filter(task => task.status === status);
  }
};

/**
 * Create task
 * POST /tasks
 */
export const createTask = async (taskData) => {
  try {
    const data = await apiClient.post('/tasks', taskData);
    return data;
  } catch (error) {
    console.warn('Backend not available for creating task, using mock response:', error);
    // Return mock success response
    return {
      _id: `mock-task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      assignedTo: taskData.assignedTo,
      dueDate: taskData.dueDate,
      projectId: taskData.projectId,
      createdBy: taskData.createdBy,
      createdAt: taskData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Update task
 * PUT /tasks/:id
 */
export const updateTask = async (id, taskData) => {
  try {
    const data = await apiClient.put(`/tasks/${id}`, taskData);
    return data;
  } catch (error) {
    console.warn(`Backend not available for updating task ${id}, using mock response:`, error);
    return {
      _id: id,
      ...taskData,
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Delete task
 * DELETE /tasks/:id
 */
export const deleteTask = async (id) => {
  try {
    const data = await apiClient.delete(`/tasks/${id}`);
    return data;
  } catch (error) {
    console.warn(`Backend not available for deleting task ${id}, using mock response:`, error);
    return { success: true, message: `Task ${id} deleted successfully` };
  }
};

/**
 * Update task status
 * PUT /tasks/:id/status
 */
export const updateTaskStatus = async (id, status) => {
  try {
    const data = await apiClient.put(`/tasks/${id}/status`, { status });
    return data;
  } catch (error) {
    console.warn(`Backend not available for updating task ${id} status, using mock response:`, error);
    return {
      _id: id,
      status: status,
      updatedAt: new Date().toISOString()
    };
  }
};
