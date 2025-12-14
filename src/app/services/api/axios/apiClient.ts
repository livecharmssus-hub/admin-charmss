import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../../stores/auth.store';

const apiUrl = import.meta.env.VITE_API_URL;
const ApiClient = axios.create({
  baseURL: apiUrl,
});

ApiClient.interceptors.request.use(
  async (config) => {
    const cookieSession = useAuthStore.getState().jwt;
    if (cookieSession) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${cookieSession}`;
      config.headers['Content-Type'] = `Application/json`;
      return config;
    } else {
      const sessionToken = '';
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${sessionToken}`;
      config.headers['Content-Type'] = `Application/json`;
      Cookies.set('session-token', sessionToken);
      return config;
    }
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

export default ApiClient;
