import { cookies } from 'next/headers';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1';
const API_PORT = process.env.NEXT_PUBLIC_API_PORT_SECURITY || '8002';
const BASE_URL = `http://${API_HOST}:${API_PORT}`;

const getHeaders = async () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (tokenCookie) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }
  } catch (err) {
    console.warn('Could not read cookies on server', err.message);
  }
  return headers;
};

export const serverApi = {
  get: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  },
  post: async (endpoint, data) => {
    const url = `${BASE_URL}${endpoint}`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data), cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${url}:`, error.message);
      return null;
    }
  },
  delete: async (endpoint) => {
    const url = `${BASE_URL}${endpoint}`;
    try {
      const headers = await getHeaders();
      const response = await fetch(url, { method: 'DELETE', headers, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${url}:`, error.message);
      return null;
    }
  }
};
