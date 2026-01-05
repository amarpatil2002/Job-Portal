import axios from 'axios';

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
        console.log('INTERCEPTOR HIT', error.response?.status, error.config?.url);

        const originalRequest = error.config;

        // do not retry refresh endpoint
        if (originalRequest.url.includes('/auth/refresh-token')) {
            return Promise.reject(error);
        }

        // Access token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    'http://localhost:7000/api/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = res.data.accessToken;
                console.log(newAccessToken);
                // store new token
                localStorage.setItem('accessToken', newAccessToken);

                // update header
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // 🔥 REFRESH TOKEN FAILED → LOGOUT
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
