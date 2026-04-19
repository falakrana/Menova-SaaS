import { create } from 'zustand';
import type { Restaurant, Category, MenuItem, DashboardStats, CartItem, Order } from '@/types';
import { api } from '@/lib/api';

interface AppState {
  restaurant: Restaurant | null;
  categories: Category[];
  menuItems: MenuItem[];
  stats: DashboardStats;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // ── Cart (public menu / customer side) ──────────────────────────────
  cart: CartItem[];
  tableNumber: number | null;

  // ── Orders (restaurant side) ────────────────────────────────────────
  orders: Order[];

  // ── Actions ────────────────────────────────────────────────────────

  // Initialization & Auth
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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


  // Orders
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Cart
  setTableNumber: (num: number) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
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
    totalOrders: 0,
  },
  sidebarOpen: true,
  isLoading: !!localStorage.getItem('menova_token'), // Boot up as true if token exists to prevent refresh flash
  error: null,
  cart: [],
  tableNumber: null,
  orders: [],

  initialize: async () => {
    const token = localStorage.getItem('menova_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      await get().fetchRestaurant();
      await Promise.all([
        get().fetchCategories(),
        get().fetchMenuItems(),
        get().fetchOrders(),
        get().fetchStats()
      ]);
    } catch (err: any) {
      set({ error: err.message });
      if (err.response?.status === 401 || err.response?.status === 403) {
        get().logout();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.login(email, password);
      await get().initialize();
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Login failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.register({ name, email, password });
      await get().login(email, password);
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Registration failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('menova_token');
    set({
      restaurant: null,
      categories: [],
      menuItems: [],
      orders: [],
      cart: [],
      tableNumber: null,
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



  fetchOrders: async () => {
    const data = await api.getOrders();
    set({ orders: data, stats: { ...get().stats, totalOrders: data.length } });
  },

  updateOrderStatus: async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
  },

  setTableNumber: (num) => set({ tableNumber: num }),

  addToCart: (item) => set((s) => {
    const existing = s.cart.find((c) => c.menuItem.id === item.id);
    if (existing) {
      return { cart: s.cart.map((c) => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
    }
    return { cart: [...s.cart, { menuItem: item, quantity: 1 }] };
  }),

  removeFromCart: (itemId) => set((s) => ({
    cart: s.cart.filter((c) => c.menuItem.id !== itemId),
  })),

  updateCartQuantity: (itemId, quantity) => set((s) => ({
    cart: quantity <= 0
      ? s.cart.filter((c) => c.menuItem.id !== itemId)
      : s.cart.map((c) => c.menuItem.id === itemId ? { ...c, quantity } : c),
  })),

  clearCart: () => set({ cart: [] }),

  placeOrder: async () => {
    const { cart, tableNumber, restaurant } = get();
    if (cart.length === 0 || !tableNumber || !restaurant) return;

    const total = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
    const orderData = {
      tableNumber,
      items: cart,
      total,
      restaurantId: restaurant.id,
    };

    await api.placeOrder(orderData);
    set({ cart: [], tableNumber: null });
  }
}));
