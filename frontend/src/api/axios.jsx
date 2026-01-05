import axios from 'axios';

const PUBLIC_ROUTES = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-user',
    '/auth/forgot-password',
    '/auth/set-new-password',
];

const api = axios.create({
    baseURL: 'http://localhost:7000/api',
    withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // console.log('INTERCEPTOR HIT', error.response?.status, error.config?.url);

        const originalRequest = error.config;

        // Network error → just reject
        if (!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;
        const url = originalRequest.url;

        //  Do NOT refresh for public routes
        if (PUBLIC_ROUTES.some((route) => url.includes(route))) {
            return Promise.reject(error);
        }

        //  Do NOT retry refresh endpoint itself
        if (url.includes('/auth/refresh-token')) {
            return Promise.reject(error);
        }

        //  No access token → logout
        const token = localStorage.getItem('accessToken');
        if (!token) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
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
                // Refresh failed → force logout
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
