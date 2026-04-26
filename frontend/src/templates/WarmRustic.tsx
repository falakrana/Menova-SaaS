import React from 'react';
import { motion } from 'framer-motion';
import { TemplateProps } from './TemplateEngine';
import { useNavigate } from 'react-router-dom';
import MenuLayoutManager from '@/components/MenuLayoutManager';

export default function WarmRustic({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const navigate = useNavigate();
  const filteredItems = menuItems.filter((i) => (activeCat === 'all' || i.categoryId === activeCat) && i.available);
  const layout = restaurant.layout || 'classic';

  return (
    <div 
      className={`bg-[#F9F6F0] text-[#4A4036] font-serif ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden relative`}
      style={{ 
        fontFamily: restaurant.bodyFont || 'Merriweather, serif',
        ['--accent-color' as any]: restaurant.accentColor || '#D47530',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a'
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30 pointer-events-none" />

      <div className="pt-20 pb-12 flex flex-col items-center justify-center text-center px-4 relative z-10">
         <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#EFE9E0] flex items-center justify-center mb-8 border-8 border-white shadow-xl relative overflow-hidden">
           {restaurant.logoUrl ? (
             <img src={restaurant.logoUrl} className="w-full h-full object-cover" alt="Logo" />
           ) : (
             <span className="text-[#D47530] text-xl font-bold italic">Rustic</span>
           )}
           <div className="absolute inset-0 border-[2px] border-dashed border-[#D47530]/20 rounded-full scale-[0.95]" />
         </div>

         <h1 className="text-5xl md:text-6xl font-bold text-[#D47530] mb-4 drop-shadow-sm" style={{ fontFamily: restaurant.fontStyle }}>
           {restaurant.name}
         </h1>
         {restaurant.tagline && (
           <p className="max-w-xl text-[#8C7A6B] text-lg italic leading-relaxed">
             {restaurant.tagline}
           </p>
         )}
         <div className="w-16 h-1 bg-[#D47530]/30 rounded-full mt-6" />
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveCat('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all border-2 ${
              activeCat === 'all' ? 'bg-[#D47530] text-white border-[#D47530]' : 'bg-transparent text-[#8C7A6B] border-[#8C7A6B]/20 hover:border-[#D47530]'
            }`}
          >
            All Menu
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all border-2 ${
                activeCat === cat.id ? 'bg-[#D47530] text-white border-[#D47530]' : 'bg-transparent text-[#8C7A6B] border-[#8C7A6B]/20 hover:border-[#D47530]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
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
        <div className="text-center py-12">
           <p className="text-[10px] text-[#8C7A6B] font-bold tracking-[0.2em] uppercase italic">Powered by Menova</p>
        </div>
      )}
    </div>
  );
}
