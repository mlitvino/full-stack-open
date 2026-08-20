import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

function handleError(error: unknown): Promise<never> {
  if (error instanceof Error) {
    return Promise.reject(error);
  }
  return Promise.reject(new Error(String(error)));
}

api.interceptors.response.use(null, handleError);

export default api;
