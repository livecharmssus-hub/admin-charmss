import axios from 'axios';

const metaEnv =
  typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, unknown> }).env
    ? (import.meta as { env?: Record<string, unknown> }).env
    : undefined;
const apiUrl = String(metaEnv?.VITE_API_URL ?? process.env.VITE_API_URL ?? '');

const ApiClientOpen = axios.create({
  baseURL: apiUrl,
});

ApiClientOpen.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    config.headers['Content-Type'] = `Application/json`;
    return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

ApiClientOpen.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

export default ApiClientOpen;
