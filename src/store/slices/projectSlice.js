import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsAPI } from '../../api';

// Async thunks for project operations
export const fetchUserProjects = createAsyncThunk(
  'project/fetchUserProjects',
  async (userId, { rejectWithValue }) => {
    try {
      const projects = await projectsAPI.fetchProjectsByUser(userId);
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const project = await projectsAPI.fetchProjectById(projectId);
      return project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const project = await projectsAPI.createProject(projectData);
      return project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const project = await projectsAPI.updateProject(projectId, data);
      return project;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Projects list
  projects: [],
  userProjects: [],
  
  // Current project
  currentProject: null,
  currentProjectId: null,
  
  // Loading states
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  
  // Filters and search
  filters: {
    status: 'all',
    priority: 'all',
    dateRange: null,
    search: '',
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  
  // View preferences
  viewMode: 'grid', // 'grid' | 'list' | 'kanban'
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Set current project
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
      state.currentProjectId = action.payload?.id || null;
    },
    
    // Clear current project
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.currentProjectId = null;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    
    // Set view preferences
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    
    // Add project to list
    addProject: (state, action) => {
      state.projects.unshift(action.payload);
      state.userProjects.unshift(action.payload);
    },
    
    // Update project in list
    updateProjectInList: (state, action) => {
      const { id, data } = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...data };
      }
      
      const userProjectIndex = state.userProjects.findIndex(p => p.id === id);
      if (userProjectIndex !== -1) {
        state.userProjects[userProjectIndex] = { ...state.userProjects[userProjectIndex], ...data };
      }
      
      if (state.currentProject?.id === id) {
        state.currentProject = { ...state.currentProject, ...data };
      }
    },
    
    // Remove project from list
    removeProject: (state, action) => {
      const projectId = action.payload;
      state.projects = state.projects.filter(p => p.id !== projectId);
      state.userProjects = state.userProjects.filter(p => p.id !== projectId);
      
      if (state.currentProject?.id === projectId) {
        state.currentProject = null;
        state.currentProjectId = null;
      }
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
    },
    
    // Set loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setCreating: (state, action) => {
      state.isCreating = action.payload;
    },
    
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch user projects
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProjects = action.payload;
        state.projects = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single project
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        state.currentProjectId = action.payload.id;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isCreating = false;
        state.projects.unshift(action.payload);
        state.userProjects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
      })
      
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedProject = action.payload;
        
        // Update in projects list
        const projectIndex = state.projects.findIndex(p => p.id === updatedProject.id);
        if (projectIndex !== -1) {
          state.projects[projectIndex] = updatedProject;
        }
        
        // Update in user projects list
        const userProjectIndex = state.userProjects.findIndex(p => p.id === updatedProject.id);
        if (userProjectIndex !== -1) {
          state.userProjects[userProjectIndex] = updatedProject;
        }
        
        // Update current project if it's the same
        if (state.currentProject?.id === updatedProject.id) {
          state.currentProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      });
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  updateFilters,
  clearFilters,
  updatePagination,
  setViewMode,
  setSortBy,
  setSortOrder,
  addProject,
  updateProjectInList,
  removeProject,
  clearErrors,
  setLoading,
  setCreating,
  setUpdating,
} = projectSlice.actions;

// Selectors
export const selectProjects = (state) => state.project.projects;
export const selectUserProjects = (state) => state.project.userProjects;
export const selectCurrentProject = (state) => state.project.currentProject;
export const selectCurrentProjectId = (state) => state.project.currentProjectId;
export const selectProjectFilters = (state) => state.project.filters;
export const selectProjectPagination = (state) => state.project.pagination;
export const selectProjectViewMode = (state) => state.project.viewMode;
export const selectProjectLoading = (state) => state.project.isLoading;
export const selectProjectCreating = (state) => state.project.isCreating;
export const selectProjectUpdating = (state) => state.project.isUpdating;
export const selectProjectError = (state) => state.project.error;
export const selectProjectCreateError = (state) => state.project.createError;
export const selectProjectUpdateError = (state) => state.project.updateError;

export default projectSlice.reducer;
