/**
 * Placeholder for future fetch API calls.
 * Utilizing environment variables for base URLs.
 */

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1';
const API_PORT = process.env.NEXT_PUBLIC_API_PORT_SECURITY || '8002';

const BASE_URL = `http://${API_HOST}:${API_PORT}`;

const handleResponseError = (response) => {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }
  } else if (response.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
  }
};

export const api = {
  get: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`GET ${url}`);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      if (!response.ok) {
        handleResponseError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  },
  post: async (endpoint, data) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`POST ${url}`, data);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store'
      });
      if (!response.ok) {
        handleResponseError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${url}:`, error.message);
      return null;
    }
  },
  delete: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`DELETE ${url}`);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      if (!response.ok) {
        handleResponseError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${url}:`, error.message);
      return null;
    }
  }
};
