import axios from 'axios';

function getToken() {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return '';
  }
  
  const cname = 'token';
  try {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document?.cookie || '');
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  } catch (error) {
    console.error('Error getting token from cookie:', error);
  }
  return '';
}

const baseURL = "https://build-back.vercel.app"
const localURL = "http://localhost:3001"

const http = axios.create({
  baseURL: baseURL,
  timeout: 10000, // Reduced timeout to 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - only add token on client side
http.interceptors.request.use(
  (config) => {
    // Only attempt to get token on client-side
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' && error.message && error.message.includes('timeout')) {
      console.error('Request timeout:', error);
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    // Handle network errors more gracefully
    if (error.message === 'Network Error') {
      console.error('Network error - API may be unreachable');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle retry logic - but only once to prevent loops
    if (error.response && error.response.status >= 500 && !originalRequest._retry) {
      originalRequest._retry = true;
      return http(originalRequest);
    }
    
    return Promise.reject(error);
  }
);






export default http;



