import axios from 'axios';

const API_BASE_URLS = [
  import.meta.env.VITE_API_BASE_URL,
  'http://localhost:5000/api',
  'http://localhost:5001/api',
].filter((value): value is string => Boolean(value));

let resolvedApiBaseUrl: string | null = null;
let resolvingApiBaseUrl: Promise<string> | null = null;

const resolveApiBaseUrl = async (): Promise<string> => {
  if (resolvedApiBaseUrl) {
    return resolvedApiBaseUrl;
  }

  if (resolvingApiBaseUrl) {
    return resolvingApiBaseUrl;
  }

  resolvingApiBaseUrl = (async () => {
    for (const baseUrl of API_BASE_URLS) {
      try {
        await axios.get(`${baseUrl}/health`, { timeout: 1500 });
        resolvedApiBaseUrl = baseUrl;
        return baseUrl;
      } catch {
        // Try the next backend candidate.
      }
    }

    resolvedApiBaseUrl = API_BASE_URLS[0] || 'http://localhost:5000/api';
    return resolvedApiBaseUrl;
  })();

  return resolvingApiBaseUrl;
};

const api = axios.create({
  baseURL: API_BASE_URLS[0] || 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await resolveApiBaseUrl();

  const token = localStorage.getItem('accessToken');
  console.log('Sending Request with Token:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const baseUrl = await resolveApiBaseUrl();
        const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
