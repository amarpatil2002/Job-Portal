import axios from 'axios';

const PUBLIC_ROUTES = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-user',
    '/auth/forgot-password',
    '/auth/set-new-password',
];

const api = axios.create({
    baseURL: 'http://localhost:8800/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Network error
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const url = originalRequest.url;

        // Public routes → do nothing
        if (PUBLIC_ROUTES.some((route) => url.includes(route))) {
            return Promise.reject(error);
        }

        // Refresh endpoint itself → do nothing
        if (url.includes('/auth/refresh-token')) {
            return Promise.reject(error);
        }

        const token = localStorage.getItem('accessToken');

        // No token → let React logout
        if (!token) {
            localStorage.removeItem('accessToken');
            return Promise.reject(error);
        }

        // Try refresh ONCE
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.post('/auth/refresh-token');
                const newAccessToken = res.data.accessToken;

                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
