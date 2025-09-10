// Central API exports
import ApiClient from './apiClient.js';
import * as projectsAPI from './projects.js';
import * as tasksAPI from './tasks.js';
import * as featuresAPI from './features.js';
import * as storiesAPI from './stories.js';
import * as commentsAPI from './comments.js';
import * as projectMemberAPI from './projectMembers.js';
import * as dashboardAPI from './dashboard.js';
import * as authAPI from './auth.js';

// Create instances
const apiClient = ApiClient;

// Named exports
export { 
  apiClient,
  projectsAPI,
  tasksAPI,
  featuresAPI,
  storiesAPI,
  commentsAPI,
  projectMemberAPI,
  dashboardAPI,
  authAPI
};

// API endpoints configuration
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8080/api',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  FEATURES: '/features',
  STORIES: '/stories',
  COMMENTS: '/comments',
  PROJECT_MEMBERS: '/project-members',
  AUTH: '/auth'
};

// API status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Common API utilities
export const apiUtils = {
  // Format date for API
  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  },

  // Parse API date
  parseDate: (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  },

  // Handle API errors
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        message: data.message || 'An error occurred',
        status,
        data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        data: null
      };
    }
  },

  // Validate required fields
  validateRequired: (data, requiredFields) => {
    const missing = requiredFields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  },

  // Clean data (remove undefined/null values)
  cleanData: (data) => {
    const cleaned = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        cleaned[key] = data[key];
      }
    });
    return cleaned;
  }
};

// Default export with all APIs
export default {
  projects: projectsAPI,
  tasks: tasksAPI,
  features: featuresAPI,
  stories: storiesAPI,
  comments: commentsAPI,
  projectMembers: projectMemberAPI,
  dashboard: dashboardAPI,
  auth: authAPI,
  client: apiClient,
  endpoints: API_ENDPOINTS,
  status: API_STATUS,
  utils: apiUtils
};
