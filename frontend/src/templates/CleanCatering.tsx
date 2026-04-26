import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import { useNavigate } from 'react-router-dom';
import MenuLayoutManager from '@/components/MenuLayoutManager';

export default function CleanCatering({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const navigate = useNavigate();
  const filteredItems = menuItems.filter((i) => (activeCat === 'all' || i.categoryId === activeCat) && i.available);
  const layout = restaurant.layout || 'classic';

  return (
    <div 
      className={`bg-white text-slate-800 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden`}
      style={{ 
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: restaurant.accentColor || '#10b981',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a'
      }}
    >
      <div className="w-full bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {restaurant.logoUrl && (
             <img src={restaurant.logoUrl} alt="Logo" className="w-10 h-10 object-cover rounded-md" />
          )}
          <h1 className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: restaurant.fontStyle }}>
            {restaurant.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <p className="text-[var(--accent-color)] font-bold tracking-widest uppercase text-sm">Professional Menu</p>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight" style={{ fontFamily: restaurant.fontStyle }}>
            Best Quality <br />Food Service
          </h2>
          {restaurant.tagline && (
             <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
               {restaurant.tagline}
             </p>
          )}
        </div>
        <div className="flex-1 w-full relative">
          <div className="w-full aspect-square md:aspect-video rounded-3xl overflow-hidden bg-slate-100 relative">
             {menuItems[0]?.image ? (
               <img src={menuItems[0].image} className="w-full h-full object-cover" alt="Hero" />
             ) : (
               <div className="w-full h-full bg-slate-100 flex items-center justify-center">Image</div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
             <button
               onClick={() => setActiveCat('all')}
               className={`px-8 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 min-w-[120px] transition-all bg-white border ${
                 activeCat === 'all' ? 'border-[var(--accent-color)] shadow-md text-[var(--accent-color)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'
               }`}
             >
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeCat === 'all' ? 'bg-[var(--accent-color)]/10' : 'bg-slate-100'}`}>
                 <Star className="w-5 h-5" />
               </div>
               <span className="font-bold text-sm">All</span>
             </button>

             {categories.map((cat, idx) => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCat(cat.id)}
                 className={`px-8 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 min-w-[120px] transition-all bg-white border ${
                   activeCat === cat.id ? 'border-[var(--accent-color)] shadow-md text-[var(--accent-color)]' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                 }`}
               >
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeCat === cat.id ? 'bg-[var(--accent-color)]/10' : 'bg-slate-100'}`}>
                   <span className="font-black text-lg">{idx + 1}</span>
                 </div>
                 <span className="font-bold text-sm whitespace-nowrap">{cat.name}</span>
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
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
        <div className="text-center py-12 bg-slate-900 text-white mt-20">
           <p className="text-sm font-medium">Powered by <span className="font-black text-[var(--accent-color)]">MENOVA</span></p>
        </div>
      )}
    </div>
  );
}
