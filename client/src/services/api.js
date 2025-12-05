import axios from 'axios';
import { startLoading, stopLoading } from '../components/LoadingBar';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to start loading bar
api.interceptors.request.use(
    (config) => {
        startLoading();
        return config;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

// Add response interceptor to stop loading bar
api.interceptors.response.use(
    (response) => {
        stopLoading();
        return response;
    },
    (error) => {
        stopLoading();
        return Promise.reject(error);
    }
);

export const getDashboardSummary = (params) => api.get('/dashboard/summary', { params });
export const getProducts = () => api.get('/products');
export const getTransactions = (params) => api.get('/transactions', { params });
export const createTransaction = (data) => api.post('/transactions', data);
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const getLogsYears = () => api.get('/logs/years');
export const getLogsMonths = (year) => api.get(`/logs/${year}`);
export const getLogsDays = (year, month) => api.get(`/logs/${year}/${month}`);
export const getDayDetails = (year, month, day) => api.get(`/logs/${year}/${month}/${day}`);
export const searchLogs = (q, startDate, endDate) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/logs/search?${params.toString()}`);
};

// Category management endpoints
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export default api;
