import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';

export default function DefaultTemplate({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      return () => current.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  const filteredItems = menuItems.filter((i) => (activeCat === 'all' || i.categoryId === activeCat) && i.available);
  const layout = restaurant.layout || 'classic';

  return (
    <div 
      className={`${embedded ? 'h-full min-h-0' : 'min-h-screen'} bg-background ${embedded ? 'pb-0' : 'pb-24'} transition-all`} 
      style={{ 
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
        ['--accent-color' as any]: restaurant.accentColor || '#f97316'
      }}
    >
      {/* Immersive Hero Header */}
      <div className="relative overflow-hidden min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 transition-all duration-700">
        <div className="absolute inset-0 z-0 bg-[var(--primary-color)]">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay gradient-mesh animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute inset-0 noise-bg"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent-color)]/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-2xl px-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-2xl overflow-hidden animate-blur-in">
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <UtensilsCrossed className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2" style={{ fontFamily: restaurant.fontStyle }}>
            {restaurant.name}
          </h1>
          
          {restaurant.tagline && (
            <p className="text-white/85 text-sm md:text-base font-medium tracking-wide border-y border-white/10 py-2 inline-block px-4 mx-auto" style={{ fontFamily: restaurant.fontStyle }}>
              {restaurant.tagline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/10 shadow-sm transition-all hover:bg-white/20">
              {restaurant.location || "Online"}
            </span>
          </div>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </div>

      <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/50 flex items-center shadow-lg shadow-black/[0.02]">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="absolute left-0 z-40 h-full w-12 bg-gradient-to-r from-background via-background/90 to-transparent flex items-center justify-start pl-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-border shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          className="flex px-4 py-3 gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          <button
            onClick={() => setActiveCat('all')}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
              activeCat === 'all'
                ? 'bg-[var(--accent-color)] text-white shadow-lg'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
            }`}
            style={{ fontFamily: restaurant.fontStyle }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                activeCat === cat.id
                  ? 'bg-[var(--accent-color)] text-white shadow-lg'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
              }`}
              style={{ fontFamily: restaurant.fontStyle }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className="absolute right-0 z-40 h-full w-12 bg-gradient-to-l from-background via-background/90 to-transparent flex items-center justify-end pr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-border shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className={`max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-8 ${restaurant.menuAlignment === 'center' ? 'text-center' : ''} surface-elegant`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: restaurant.fontStyle }}>
             {activeCat === 'all' ? "All Items" : categories.find(c => c.id === activeCat)?.name || "Menu"}
          </h2>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 via-border to-transparent ml-4 opacity-50"></div>
        </div>

        <MenuLayoutManager 
          layout={layout}
          items={filteredItems}
          likedItems={likedItems}
          toggleLike={toggleLike}
          formatPrice={formatPrice}
          fontStyle={restaurant.fontStyle}
          primaryColor={restaurant.themeColor}
          theme="default"
        />
      </div>

      {!embedded && (
        <div className="text-center py-16 px-4 bg-muted/10">
           <div className="w-20 h-0.5 bg-border mx-auto mb-8 opacity-40"></div>
           <p className="text-[10px] text-muted-foreground font-black tracking-[0.4em] uppercase">
              Powered by <span className="text-[#FF4A1D]">MENOVA</span> 2024
           </p>
        </div>
      )}
    </div>
  );
}
