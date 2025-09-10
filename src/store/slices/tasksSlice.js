import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tasksAPI from '../../api/tasks.js';

// Async thunks for API calls
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await tasksAPI.fetchAllTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const tasks = await tasksAPI.fetchTasksByProject(projectId);
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch project tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const newTask = await tasksAPI.createTask(taskData);
      return newTask;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const updatedTask = await tasksAPI.updateTask(id, taskData);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId, { rejectWithValue }) => {
    try {
      await tasksAPI.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const updatedTask = await tasksAPI.updateTaskStatus(id, status);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task status');
    }
  }
);

export const assignTask = createAsyncThunk(
  'tasks/assign',
  async ({ id, assignedTo }, { rejectWithValue }) => {
    try {
      const updatedTask = await tasksAPI.assignTask(id, assignedTo);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to assign task');
    }
  }
);

export const fetchTaskAnalytics = createAsyncThunk(
  'tasks/fetchAnalytics',
  async (projectId = null, { rejectWithValue }) => {
    try {
      const analytics = await tasksAPI.fetchTaskAnalytics(projectId);
      return analytics;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch task analytics');
    }
  }
);

const initialState = {
  tasks: [],
  filteredTasks: [],
  selectedTask: null,
  analytics: {
    total: 0,
    statusBreakdown: {},
    priorityBreakdown: {},
    completed: 0,
    inProgress: 0,
    todo: 0
  },
  filters: {
    search: '',
    status: '',
    assignedTo: '',
    projectId: '',
    priority: '',
    tags: []
  },
  sorting: {
    field: 'dueDate',
    direction: 'asc'
  },
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Auto-apply filters
      state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
    },
    setSorting: (state, action) => {
      state.sorting = { ...state.sorting, ...action.payload };
      // Auto-apply sorting
      state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredTasks = [...state.tasks];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = applyFiltersAndSorting(action.payload, state.filters, state.sorting);
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch tasks by project
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = applyFiltersAndSorting(action.payload, state.filters, state.sorting);
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createLoading = false;
        state.tasks.push(action.payload);
        state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
        }
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.filteredTasks = state.filteredTasks.filter(task => task.id !== action.payload);
        if (state.selectedTask && state.selectedTask.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
        }
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Assign task
      .addCase(assignTask.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          state.filteredTasks = applyFiltersAndSorting(state.tasks, state.filters, state.sorting);
        }
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Fetch analytics
      .addCase(fetchTaskAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchTaskAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Helper function to apply filters and sorting
function applyFiltersAndSorting(tasks, filters, sorting) {
  let filtered = [...tasks];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search) ||
      task.assignedTo.toLowerCase().includes(search)
    );
  }

  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status);
  }

  if (filters.assignedTo) {
    filtered = filtered.filter(task => task.assignedTo === filters.assignedTo);
  }

  if (filters.projectId) {
    filtered = filtered.filter(task => task.projectId === filters.projectId);
  }

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(task => 
      filters.tags.some(tag => task.tags.includes(tag))
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sorting.field];
    let bValue = b[sorting.field];

    if (sorting.field === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) {
      return sorting.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sorting.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return filtered;
}

export const {
  setSelectedTask,
  clearSelectedTask,
  setFilters,
  setSorting,
  clearFilters,
  clearError
} = tasksSlice.actions;

export default tasksSlice.reducer;
