import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Use VITE_API_URL in production, proxy in dev
    withCredentials: true
});

// Interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local auth state if backend says unauthorized
            // We can't use useAuth here, but we can clear things if needed
            // For now, let the context handle it via catch blocks
        }
        return Promise.reject(error);
    }
);

export default api;
