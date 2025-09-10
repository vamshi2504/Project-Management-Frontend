// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add user info for API requests
    const userData = localStorage.getItem('projectManagementUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Add user ID to headers for backend authentication
        config.headers['X-User-ID'] = user.uid;
        config.headers['X-User-Email'] = user.email;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiClient();
