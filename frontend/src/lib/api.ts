import axios from 'axios';

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL as string | undefined;
const API_BASE = API_ORIGIN
  ? `${API_ORIGIN.replace(/\/$/, '')}/api/v1`
  : '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('menova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const { access_token } = response.data;
    localStorage.setItem('menova_token', access_token);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Restaurant
  getRestaurant: async () => {
    const response = await apiClient.get('/restaurant');
    return response.data;
  },
  updateRestaurant: async (data: any) => {
    const response = await apiClient.put('/restaurant', data);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  createCategory: async (name: string) => {
    const response = await apiClient.post('/categories', { name });
    return response.data;
  },
  updateCategory: async (id: string, name: string) => {
    const response = await apiClient.put(`/categories/${id}`, { name });
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // Menu Items
  getMenuItems: async (categoryId?: string) => {
    const response = await apiClient.get('/menu-items', {
      params: categoryId ? { category_id: categoryId } : {},
    });
    return response.data;
  },
  createMenuItem: async (data: any) => {
    const response = await apiClient.post('/menu-items', data);
    return response.data;
  },
  updateMenuItem: async (id: string, data: any) => {
    const response = await apiClient.put(`/menu-items/${id}`, data);
    return response.data;
  },
  deleteMenuItem: async (id: string) => {
    const response = await apiClient.delete(`/menu-items/${id}`);
    return response.data;
  },

  // Orders
  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Public
  getPublicMenu: async (restaurantId: string) => {
    const response = await apiClient.get(`/public/menu/${restaurantId}`);
    return response.data;
  },
  placeOrder: async (data: any) => {
    const response = await apiClient.post('/public/orders', data);
    return response.data;
  },

  // QR Code
  getQRCode: async (restaurantId: string) => {
    const response = await apiClient.get(`/qr-code/${restaurantId}`);
    return response.data;
  },

  // Uploads
  uploadImage: async (file: File, folder: string = 'others') => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/uploads/image?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};
