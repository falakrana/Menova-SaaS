import { create } from 'zustand';
import type { Restaurant, Category, MenuItem, DashboardStats } from '@/types';
import { api } from '@/lib/api';

interface AppState {
  restaurant: Restaurant | null;
  categories: Category[];
  menuItems: MenuItem[];
  stats: DashboardStats;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;



  // ── Actions ────────────────────────────────────────────────────────

  // Initialization & Auth
  initialize: () => Promise<void>;
  logout: () => void;

  // Restaurant
  fetchRestaurant: () => Promise<void>;
  updateRestaurant: (data: Partial<Restaurant>) => Promise<void>;
  fetchStats: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;

  // Categories
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Menu Items
  fetchMenuItems: (categoryId?: string) => Promise<void>;
  addMenuItem: (data: any) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleItemAvailability: (id: string) => Promise<void>;
  uploadImage: (file: File, folder?: string) => Promise<{ url: string }>;
  uploadImageFromUrl: (url: string, folder?: string) => Promise<{ url: string }>;


}

export const useStore = create<AppState>((set, get) => ({
  restaurant: null,
  categories: [],
  menuItems: [],
  stats: {
    totalCategories: 0,
    totalItems: 0,
    qrCodeActive: false,
    menuViews: 0,
    qrScans: 0,
    popularItem: 'None',
  },
  sidebarOpen: true,
  isLoading: false,
  error: null,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      await get().fetchRestaurant();
      await Promise.all([
        get().fetchCategories(),
        get().fetchMenuItems(),
        get().fetchStats(),
      ]);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({
      restaurant: null,
      categories: [],
      menuItems: [],
      error: null,
    });
  },

  fetchRestaurant: async () => {
    const data = await api.getRestaurant();
    set({ restaurant: data });
  },

  updateRestaurant: async (data) => {
    const updated = await api.updateRestaurant(data);
    set({ restaurant: updated });
  },

  fetchStats: async () => {
    try {
      const data = await api.getStats();
      set({ stats: data });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  fetchCategories: async () => {
    const data = await api.getCategories();
    set({ categories: data, stats: { ...get().stats, totalCategories: data.length } });
  },

  addCategory: async (name) => {
    const newCat = await api.createCategory(name);
    set((s) => ({ categories: [...s.categories, newCat] }));
    await get().fetchCategories();
  },

  updateCategory: async (id, name) => {
    const updated = await api.updateCategory(id, name);
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCategory: async (id) => {
    await api.deleteCategory(id);
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
    }));
    await get().fetchCategories();
  },

  fetchMenuItems: async (categoryId) => {
    const data = await api.getMenuItems(categoryId);
    set({ menuItems: data, stats: { ...get().stats, totalItems: data.length } });
  },

  addMenuItem: async (data) => {
    const newItem = await api.createMenuItem(data);
    set((s) => ({ menuItems: [...s.menuItems, newItem] }));
    await get().fetchMenuItems();
    await get().fetchCategories(); // itemCount changed
  },

  updateMenuItem: async (id, data) => {
    const updated = await api.updateMenuItem(id, data);
    set((s) => ({
      menuItems: s.menuItems.map((i) => (i.id === id ? updated : i)),
    }));
  },

  deleteMenuItem: async (id) => {
    await api.deleteMenuItem(id);
    set((s) => ({
      menuItems: s.menuItems.filter((i) => i.id !== id),
    }));
    await get().fetchMenuItems();
    await get().fetchCategories(); // itemCount changed
  },

  toggleItemAvailability: async (id) => {
    const item = get().menuItems.find((i) => i.id === id);
    if (!item) return;
    await get().updateMenuItem(id, { available: !item.available });
  },
  
  uploadImage: async (file: File, folder?: string) => {
    return await api.uploadImage(file, folder);
  },

  uploadImageFromUrl: async (url: string, folder?: string) => {
    return await api.uploadImageFromUrl(url, folder);
  },



}));
