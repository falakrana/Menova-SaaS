import React from 'react';
import { motion } from 'framer-motion';
import { TemplateProps } from './TemplateEngine';
import { useNavigate } from 'react-router-dom';
import MenuLayoutManager from '@/components/MenuLayoutManager';

export default function PremiumDark({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const navigate = useNavigate();
  const filteredItems = menuItems.filter((i) => (activeCat === 'all' || i.categoryId === activeCat) && i.available);
  const layout = restaurant.layout || 'classic';

  return (
    <div 
      className={`bg-zinc-950 text-zinc-50 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden`}
      style={{ 
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: restaurant.accentColor || '#f97316',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a'
      }}
    >
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] bg-zinc-900 flex flex-col items-center justify-center pt-10">
        <div className="absolute inset-0 overflow-hidden">
           {restaurant.logoUrl ? (
             <img src={restaurant.logoUrl} className="w-full h-full object-cover opacity-20 blur-sm" alt="bg" />
           ) : (
             <div className="w-full h-full bg-zinc-900" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          {restaurant.logoUrl && (
             <img src={restaurant.logoUrl} alt="Logo" className="w-16 h-16 object-cover rounded-full mb-6 border-2 border-zinc-800" />
          )}
          <p className="text-zinc-400 uppercase tracking-[0.2em] text-xs font-bold mb-4">Premium Restaurant</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{ fontFamily: restaurant.fontStyle }}>
            {restaurant.name}
          </h1>
          {restaurant.tagline && (
             <p className="text-zinc-400 max-w-md text-sm md:text-base mb-8 uppercase tracking-widest leading-relaxed">
               {restaurant.tagline}
             </p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveCat('all')}
            className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all ${
              activeCat === 'all' ? 'bg-[var(--accent-color)] text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            All Menu
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-3 text-sm font-bold tracking-wider uppercase transition-all ${
                activeCat === cat.id ? 'bg-[var(--accent-color)] text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <MenuLayoutManager 
          layout={layout}
          items={filteredItems}
          likedItems={likedItems}
          toggleLike={toggleLike}
          formatPrice={formatPrice}
          fontStyle={restaurant.fontStyle}
          primaryColor={restaurant.themeColor}
        />
      </div>
      
      {!embedded && (
        <div className="text-center py-16 bg-zinc-900 border-t border-zinc-800">
           <p className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] uppercase">Powered by MENOVA</p>
        </div>
      )}
    </div>
  );
}
