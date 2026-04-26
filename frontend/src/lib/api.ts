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

// Clerk session token getter — set by AuthSyncProvider once Clerk is ready
let _getClerkToken: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (fn: () => Promise<string | null>) => {
  _getClerkToken = fn;
};

// Attach Clerk JWT to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = _getClerkToken ? await _getClerkToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {

  getMe: async () => {

    const response = await apiClient.get('/auth/me');

    return response.data;

  },



  // Restaurant

  getRestaurant: async () => {

    const response = await apiClient.get('/restaurant');

    return response.data;

  },

  getStats: async () => {

    const response = await apiClient.get('/restaurant/stats');

    return response.data;

  },

  getViewsAnalytics: async (startDate: string, endDate: string) => {

    const response = await apiClient.get(`/restaurant/analytics/views?start_date=${startDate}&end_date=${endDate}`);

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





  // Public

  getPublicMenu: async (restaurantId: string) => {

    const response = await apiClient.get(`/public/menu/${restaurantId}`);

    return response.data;

  },

  likeMenuItem: async (itemId: string, like: boolean) => {

    const response = await apiClient.post(`/public/items/${itemId}/like?like=${like}`);

    return response.data;

  },



  // QR Code

  getQRCode: async (restaurantId: string) => {

    const response = await apiClient.get(`/qr-code/${restaurantId}`);

    return response.data;

  },

  regenerateQRCode: async (restaurantId: string) => {

    const response = await apiClient.post(`/qr-code/${restaurantId}/regenerate`);

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
  },

  uploadImageFromUrl: async (url: string, folder: string = 'others') => {
    const response = await apiClient.post('/uploads/image-url', { url, folder });
    return response.data;
  },



};

