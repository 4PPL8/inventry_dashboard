import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getProducts = () => api.get('/products');
export const getTransactions = () => api.get('/transactions');
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

export default api;
