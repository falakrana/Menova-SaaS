import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UtensilsCrossed, MapPin, Sparkles, Clock, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';
import LocationModal from '@/components/LocationModal';

export default function WarmRustic({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const layout = restaurant.layout || 'classic';
  const accent = restaurant.accentColor || '#D47530';
  const coverBg = restaurant.coverImage || menuItems.find((i: any) => i.image)?.image || null;

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchesSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && i.available;
  });

  const itemCountForCat = (catId: string) =>
    menuItems.filter((i) => i.categoryId === catId && i.available).length;
  const allCount = menuItems.filter((i) => i.available).length;

  const checkCatScroll = () => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkCatScroll();
    const current = catScrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkCatScroll);
      window.addEventListener('resize', checkCatScroll);
      return () => {
        current.removeEventListener('scroll', checkCatScroll);
        window.removeEventListener('resize', checkCatScroll);
      };
    }
  }, [categories]);

  return (
    <div
      className={`text-[#4A4036] ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-clip relative`}
      style={{
        fontFamily: restaurant.bodyFont || 'Merriweather, serif',
        ['--accent-color' as any]: accent,
        backgroundColor: '#FDFBF7',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slowSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: slowSpin 60s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .grain-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
      `}} />
      
      <div className="absolute inset-0 grain-bg opacity-[0.03] pointer-events-none" />

      {/* Top bar */}
      <div className="w-full py-4 px-6 flex items-center justify-between sticky top-0 z-50 border-b border-[#D47530]/5"
        style={{ backgroundColor: '#FDFBF7ee', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-3">
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt="Logo" className="w-9 h-9 object-cover rounded-full border-2 shadow-sm" style={{ borderColor: `${accent}20` }} />
          ) : (
            <UtensilsCrossed className="w-5 h-5" style={{ color: accent }} />
          )}
          <span className="font-black text-sm tracking-widest uppercase italic" style={{ fontFamily: restaurant.fontStyle, color: accent }}>
            {restaurant.name}
          </span>
        </div>
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border border-[#D47530]/10"
          style={{ color: accent }}
        >
          {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FDFBF7]"
          >
            <div className="max-w-2xl mx-auto px-6 py-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--accent-color)]" style={{ color: `${accent}40` }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="What can we prepare for you?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 text-base focus:outline-none transition-all shadow-inner"
                  style={{
                    borderColor: `${accent}10`,
                    backgroundColor: '#F5F0E8',
                    color: '#4A4036',
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: `${accent}40` }}>
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        {/* Watercolor Accent */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[100px] opacity-20 -z-10 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
        />
        
        <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div className="relative mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden relative bg-[#F5F0E8]"
            >
              {restaurant.logoUrl ? (
                <img src={restaurant.logoUrl} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <UtensilsCrossed className="w-10 h-10" style={{ color: accent }} />
              )}
            </motion.div>
            
            {/* Rotating Decorative Ring */}
            <div
              className="absolute inset-[-12px] rounded-full border-2 border-dashed spin-slow pointer-events-none"
              style={{ borderColor: `${accent}30` }}
            />
            {/* Static Diamonds */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: accent }} />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: accent }} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: restaurant.fontStyle, color: accent }}
          >
            {restaurant.name}
          </motion.h1>

          {restaurant.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-lg text-[#8C7A6B] text-lg italic leading-relaxed font-serif px-6"
            >
              "{restaurant.tagline}"
            </motion.p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {restaurant.location && (
              <button
                onClick={() => setLocationModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[#D47530]/20 text-[#4A4036] font-bold text-sm hover:shadow-lg transition-all"
              >
                <MapPin className="w-4 h-4" style={{ color: accent }} />
                <span>View Our Location</span>
              </button>
            )}
            <div className="w-1 h-1 rounded-full bg-[#8C7A6B]/30" />
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8C7A6B]">
              <Clock className="w-4 h-4" />
              <span>Authentic Flavors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Bleed Cover Section */}
      {coverBg && (
        <div className="relative w-full h-[400px] mb-16 overflow-hidden">
          <img
            src={coverBg}
            className="w-full h-full object-cover"
            alt="Atmosphere"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A4036] via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-10 left-0 right-0 text-center text-white p-6">
             <Sparkles className="w-6 h-6 mx-auto mb-4 opacity-80" />
             <h3 className="text-2xl font-serif italic mb-2 tracking-wide">Tradition in every bite</h3>
             <div className="w-12 h-px bg-white/40 mx-auto" />
          </div>
        </div>
      )}

      {/* Sticky Category Navigation */}
      <div className="sticky top-[73px] z-[45] bg-[#FDFBF7/90] backdrop-blur-xl py-6 border-b border-[#D47530]/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            <AnimatePresence>
              {showLeftArrow && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => scrollCategories('left')}
                  className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent flex items-center justify-start pl-1 transition-colors"
                  style={{ color: accent }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <div
              ref={catScrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-6 scroll-smooth"
            >
            <button
              onClick={() => setActiveCat('all')}
              className={`px-8 py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all shrink-0 flex items-center gap-3 border-2 ${
                activeCat === 'all'
                  ? 'bg-white shadow-xl translate-y-[-2px]'
                  : 'bg-transparent border-transparent text-[#8C7A6B]'
              }`}
              style={{ 
                borderColor: activeCat === 'all' ? accent : 'transparent',
                color: activeCat === 'all' ? accent : '#8C7A6B'
              }}
            >
              All Menu
              <span className="px-2 py-0.5 rounded-lg text-[10px]" style={{ background: `${accent}10`, color: accent }}>
                {allCount}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-8 py-3 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all shrink-0 flex items-center gap-3 border-2 ${
                  activeCat === cat.id
                    ? 'bg-white shadow-xl translate-y-[-2px]'
                    : 'bg-transparent border-transparent text-[#8C7A6B]'
                }`}
                style={{ 
                  borderColor: activeCat === cat.id ? accent : 'transparent',
                  color: activeCat === cat.id ? accent : '#8C7A6B'
                }}
              >
                {cat.name}
                <span className="px-2 py-0.5 rounded-lg text-[10px]" style={{ background: `${accent}10`, color: accent }}>
                  {itemCountForCat(cat.id)}
                </span>
              </button>
            ))}
            </div>

            <AnimatePresence>
              {showRightArrow && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  onClick={() => scrollCategories('right')}
                  className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent flex items-center justify-end pr-1 transition-colors"
                  style={{ color: accent }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Menu Items Area */}
      <div className="max-w-5xl mx-auto px-6">
        {search && filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-[#F5F0E8] rounded-3xl border-2 border-dashed border-[#D47530]/20">
            <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-[#8C7A6B] text-xl font-serif italic">The pantry is empty for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-6 text-sm font-black uppercase tracking-widest underline underline-offset-4" style={{ color: accent }}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="py-8">
            <MenuLayoutManager
              layout={layout}
              items={filteredItems}
              likedItems={likedItems}
              toggleLike={toggleLike}
              formatPrice={formatPrice}
              fontStyle={restaurant.fontStyle}
              primaryColor={accent}
              theme="warm"
            />
          </div>
        )}
      </div>

      {!embedded && (
        <footer className="mt-20 py-16 border-t" style={{ borderColor: `${accent}10`, backgroundColor: '#F5F0E8' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
             <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-8 h-px bg-[#8C7A6B]/20" />
                <UtensilsCrossed className="w-6 h-6 opacity-30" />
                <div className="w-8 h-px bg-[#8C7A6B]/20" />
             </div>
             <h4 className="text-2xl font-serif italic mb-4" style={{ color: accent }}>{restaurant.name}</h4>
             <p className="text-[#8C7A6B] text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                Thank you for visiting. We take pride in serving high-quality ingredients prepared with passion.
             </p>
             <div className="pt-8 border-t border-[#8C7A6B]/10">
                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">
                  Powered by <span style={{ color: accent }}>Menova</span>
                </p>
             </div>
          </div>
        </footer>
      )}

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        location={restaurant.location || ''}
        restaurantName={restaurant.name}
      />
    </div>
  );
}
