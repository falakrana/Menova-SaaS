import React from 'react';

export interface TemplateProps {
  restaurant: any;
  categories: any[];
  menuItems: any[];
  activeCat: string;
  setActiveCat: (catId: string) => void;
  likedItems: string[];
  toggleLike: (itemId: string) => void;
  formatPrice: (price: number) => string;
  embedded?: boolean;
}

export const TEMPLATES = [
  { id: 'standard', label: 'Standard Modern', desc: 'The classic Menova look with dynamic hero sections.' },
  { id: 'premium-dark', label: 'Premium Dark', desc: 'Sleek dark theme with large hero images.' },
  { id: 'warm-rustic', label: 'Warm Rustic', desc: 'Organic feel with prominent featured items.' },
  { id: 'clean-catering', label: 'Clean Catering', desc: 'Professional, bright grid layout.' },
];
