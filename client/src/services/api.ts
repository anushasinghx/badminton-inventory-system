import axios, { AxiosError } from 'axios';
import { Product, Analytics, StockHistory, ExportOptions } from '../types';


const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';


const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});


api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);



export const productAPI = {
  getAll: (params?: {
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get<Product[]>('/products', { params }),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Product>('/products', product),

  update: (id: string, product: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, product),

  delete: (id: string) => api.delete(`/products/${id}`),

  adjustStock: (id: string, adjustment: number, reason?: string) =>
    api.post<Product>(`/products/${id}/adjust-stock`, { adjustment, reason }),
};

export const analyticsAPI = {
  getAnalytics: () => api.get<Analytics>('/analytics'),
};

export const historyAPI = {
  getHistory: (params?: { productId?: string; limit?: number }) =>
    api.get<StockHistory[]>('/history', { params }),
};

export const exportAPI = {
  exportCSV: (options?: ExportOptions) =>
    api.get('/export/csv', {
      params: options,
      responseType: 'blob',
    }),

  exportJSON: (options?: ExportOptions) =>
    api.get('/export/json', {
      params: options,
      responseType: 'blob',
    }),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
