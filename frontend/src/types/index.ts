/**
 * Types — shared TypeScript interfaces for the Menova application.
 *
 * These types are consumed by the Zustand store and all page/component files.
 * They represent the core domain model of a restaurant digital menu.
 */

/** Core restaurant profile managed via the Settings page. */
export interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  /** Optional URL to a logo image. */
  logo?: string;
  /** Primary hex/HSL color used across the public menu (header, buttons). */
  themeColor: string;
  backgroundColor: string;
  /** Font family name applied to the public menu body text. */
  fontStyle: string;
}

/** A menu category (e.g. "Starters", "Main Course"). */
export interface Category {
  id: string;
  name: string;
  /** Foreign key linking the category to its restaurant. */
  restaurantId: string;
  /** Denormalised count — updated in the store on add/delete of menu items. */
  itemCount: number;
  /** ISO date string (YYYY-MM-DD) recording when it was created. */
  createdAt: string;
}

/** A single dish or drink on the menu. */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in Indian Rupees (₹). */
  price: number;
  /** Optional URL to a food image. Shown in the public menu and item cards. */
  image?: string;
  categoryId: string;
  /** Denormalised category name for quick display without a join. */
  categoryName: string;
  /** When false, the item is hidden from the customer-facing public menu. */
  available: boolean;
  /** ISO date string (YYYY-MM-DD). */
  createdAt: string;
}

/** Aggregate statistics displayed on the dashboard home page. */
export interface DashboardStats {
  totalCategories: number;
  totalItems: number;
  qrCodeActive: boolean;
  menuViews: number;
  qrScans: number;
  /** Name of the most ordered or featured item. */
  popularItem: string;
  totalOrders: number;
}

/** A line item in the shopping cart (one menu item + chosen quantity). */
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

/** An order placed by a customer from the public menu. */
export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  /** Total price in ₹ (pre-calculated and stored at order creation). */
  total: number;
  /** Lifecycle status managed by restaurant staff on the Orders page. */
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  /** ISO timestamp of when the order was placed. */
  createdAt: string;
}
