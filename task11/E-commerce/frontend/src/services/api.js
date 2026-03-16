import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const createOrder = (data) => api.post('/orders', data);
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const getOrder = (id) => api.get(`/orders/${id}`);

export const processPayment = (data) => api.post('/payments', data);
export const getPayment = (orderId) => api.get(`/payments/${orderId}`);

export default api;
