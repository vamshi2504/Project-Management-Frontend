import * as projectsAPI from './projects.js';
import * as tasksAPI from './tasks.js';
import * as featuresAPI from './features.js';
import * as storiesAPI from './stories.js';
import * as commentsAPI from './comments.js';
import * as projectMemberAPI from './projectMembers.js';

/**
 * Calculate dashboard analytics
 */
export const calculateDashboardAnalytics = (data) => {
  const { projects, tasks, features, stories } = data;

  // Project analytics
  const projectAnalytics = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    onHold: projects.filter(p => p.status === 'ON_HOLD').length
  };

  // Task analytics
  const taskAnalytics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED';
    }).length
  };

  // Feature analytics
  const featureAnalytics = {
    total: features.length,
    completed: features.filter(f => f.status === 'COMPLETED').length,
    inProgress: features.filter(f => f.status === 'IN_PROGRESS').length,
    planned: features.filter(f => f.status === 'PLANNED').length
  };

  // Story analytics
  const storyAnalytics = {
    total: stories.length,
    completed: stories.filter(s => s.status === 'COMPLETED').length,
    inProgress: stories.filter(s => s.status === 'IN_PROGRESS').length,
    backlog: stories.filter(s => s.status === 'BACKLOG').length
  };

  // Overall completion rates
  const overallCompletion = {
    projects: projectAnalytics.total > 0 ? (projectAnalytics.completed / projectAnalytics.total) * 100 : 0,
    tasks: taskAnalytics.total > 0 ? (taskAnalytics.completed / taskAnalytics.total) * 100 : 0,
    features: featureAnalytics.total > 0 ? (featureAnalytics.completed / featureAnalytics.total) * 100 : 0,
    stories: storyAnalytics.total > 0 ? (storyAnalytics.completed / storyAnalytics.total) * 100 : 0
  };

  return {
    projects: projectAnalytics,
    tasks: taskAnalytics,
    features: featureAnalytics,
    stories: storyAnalytics,
    completion: overallCompletion,
    summary: {
      totalItems: projects.length + tasks.length + features.length + stories.length,
      completedItems: projectAnalytics.completed + taskAnalytics.completed + 
                     featureAnalytics.completed + storyAnalytics.completed
    }
  };
};

/**
 * Fetch comprehensive dashboard data
 */
export const fetchDashboardData = async (userId = null) => {
  try {
    const [projects, tasks, features, stories] = await Promise.all([
      projectsAPI.fetchAllProjects(),
      tasksAPI.fetchAllTasks(),
      featuresAPI.fetchAllFeatures(),
      storiesAPI.fetchAllStories()
    ]);

    // Filter data by user if userId is provided
    let userProjects = projects;
    let userTasks = tasks;
    let userStories = stories;

    if (userId) {
      // Get user's project memberships
      const userProjectMemberships = await projectMemberAPI.fetchProjectsByUser(userId);
      const userProjectIds = userProjectMemberships.map(pm => pm.projectId);
      
      userProjects = projects.filter(p => userProjectIds.includes(p.id) || p.ownerId === userId);
      userTasks = tasks.filter(t => t.assignedTo === userId || userProjectIds.includes(t.projectId));
      userStories = stories.filter(s => s.assignedTo === userId || userProjectIds.includes(s.projectId));
    }

    // Calculate analytics
    const analytics = calculateDashboardAnalytics({
      projects: userProjects,
      tasks: userTasks,
      features,
      stories: userStories
    });

    return {
      projects: userProjects,
      tasks: userTasks,
      features,
      stories: userStories,
      analytics,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Fetch recent activity
 */
export const fetchRecentActivity = async (userId = null, limit = 10) => {
  try {
    const [tasks, stories, comments] = await Promise.all([
      tasksAPI.fetchAllTasks(),
      storiesAPI.fetchAllStories(),
      commentsAPI.fetchAllComments()
    ]);

    let activities = [];

    // Add task activities
    tasks.forEach(task => {
      activities.push({
        id: `task-${task.id}`,
        type: 'task',
        action: 'updated',
        title: task.title || task.name,
        description: `Task status: ${task.status}`,
        timestamp: task.updatedAt || task.createdAt,
        entityId: task.id,
        projectId: task.projectId,
        userId: task.assignedTo
      });
    });

    // Add story activities
    stories.forEach(story => {
      activities.push({
        id: `story-${story.id}`,
        type: 'story',
        action: 'updated',
        title: story.title || story.name,
        description: `Story status: ${story.status}`,
        timestamp: story.updatedAt || story.createdAt,
        entityId: story.id,
        projectId: story.projectId,
        userId: story.assignedTo
      });
    });

    // Add comment activities
    comments.forEach(comment => {
      activities.push({
        id: `comment-${comment.id}`,
        type: 'comment',
        action: 'added',
        title: 'New comment',
        description: comment.content.substring(0, 100),
        timestamp: comment.createdAt,
        entityId: comment.entityId,
        entityType: comment.entityType,
        userId: comment.authorId
      });
    });

    // Filter by user if provided
    if (userId) {
      activities = activities.filter(activity => activity.userId === userId);
    }

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

/**
 * Fetch project-specific dashboard
 */
export const fetchProjectDashboard = async (projectId) => {
  try {
    const [project, tasks, features, stories, members] = await Promise.all([
      projectsAPI.fetchProjectById(projectId),
      tasksAPI.fetchTasksByProject(projectId),
      featuresAPI.fetchFeaturesByProject(projectId),
      storiesAPI.fetchStoriesByProject(projectId),
      projectMemberAPI.fetchMembersByProject(projectId)
    ]);

    const analytics = calculateDashboardAnalytics({
      projects: [project],
      tasks,
      features,
      stories
    });

    return {
      project,
      tasks,
      features,
      stories,
      members,
      analytics,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching project dashboard:', error);
    throw error;
  }
};
