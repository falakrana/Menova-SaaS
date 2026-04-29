import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UtensilsCrossed, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';
import LocationModal from '@/components/LocationModal';

export default function PremiumDark({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
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

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchesSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && i.available;
  });

  const layout = restaurant.layout || 'classic';
  const accentColor = restaurant.accentColor || '#f97316';

  const heroBg = restaurant.coverImage || (menuItems.length > 0 ? menuItems[0].image : null);

  const itemCountForCat = (catId: string) =>
    menuItems.filter((i) => i.categoryId === catId && i.available).length;
  const allCount = menuItems.filter((i) => i.available).length;

  return (
    <div
      className={`bg-zinc-950 text-zinc-50 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-clip`}
      style={{
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: accentColor,
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .noise-bg { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
      `}} />

      {/* Sticky Navbar */}
      {!embedded && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: scrolled ? 0 : -100 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {restaurant.logoUrl && (
              <img src={restaurant.logoUrl} alt="Logo" className="w-8 h-8 rounded-full border border-white/10" />
            )}
            <span className="font-bold tracking-tight text-sm uppercase" style={{ fontFamily: restaurant.fontStyle }}>
              {restaurant.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSearch(true)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </motion.nav>
      )}

      {/* Hero */}
      <div className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {heroBg ? (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              src={heroBg}
              className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
              alt="bg"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          
          {/* Animated Orbs */}
          <motion.div
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
          />
          <motion.div
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 40, 0],
              opacity: [0.05, 0.15, 0.05] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] bg-white/20"
          />

          <div className="absolute inset-0 noise-bg opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-zinc-950/20" />
        </div>

        <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl">
          {restaurant.logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 rounded-full blur-2xl opacity-50 scale-150" style={{ background: accentColor }} />
              <img
                src={restaurant.logoUrl}
                alt="Logo"
                className="w-24 h-24 object-cover rounded-full border-2 border-white/20 shadow-2xl relative z-10"
              />
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 uppercase tracking-[0.4em] text-xs font-black mb-4"
          >
            {restaurant.tagline || 'Experience Excellence'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <h1 
              className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 leading-none"
              style={{ 
                fontFamily: restaurant.fontStyle,
                textShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              {restaurant.name}
            </h1>
            <div className="absolute -inset-x-20 -inset-y-10 bg-[var(--accent-color)]/5 blur-3xl -z-10 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {restaurant.location && (
              <button
                onClick={() => setLocationModalOpen(true)}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all backdrop-blur-md group"
              >
                <MapPin className="w-4 h-4 group-hover:text-[var(--accent-color)]" />
                <span>{restaurant.location.split(',')[0]}</span>
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            )}
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent mt-8"
            />
          </motion.div>
        </div>

        {/* Floating Search Toggle (Mobile) */}
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-zinc-900/50 backdrop-blur-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
        >
          {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-zinc-950/95 backdrop-blur-2xl flex flex-col p-6"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setShowSearch(false)} className="p-3 text-zinc-400 hover:text-white">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="max-w-3xl mx-auto w-full">
              <div className="relative border-b-2 border-white/10 focus-within:border-[var(--accent-color)] transition-colors pb-4">
                <Search className="absolute left-0 top-1 w-8 h-8 text-zinc-600" />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you craving?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent pl-12 text-3xl font-light text-zinc-100 placeholder-zinc-700 focus:outline-none"
                />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {categories.slice(0, 5).map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => { setActiveCat(cat.id); setShowSearch(false); }}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 hover:text-white"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation & Menu Content */}
      <div className="relative z-20 -mt-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Sticky Category Scroller */}
          <div className="sticky top-[73px] z-[45] mb-12">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-4 shadow-2xl">
              <div className="relative">
                <AnimatePresence>
                  {showLeftArrow && (
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={() => scrollCategories('left')}
                      className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent flex items-center justify-start pl-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div 
                  ref={catScrollRef}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-6"
                >
                <button
                  onClick={() => setActiveCat('all')}
                  className={`relative px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shrink-0 ${
                    activeCat === 'all' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {activeCat === 'all' && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-[var(--accent-color)] rounded-2xl -z-10 shadow-lg shadow-[var(--accent-color)]/20" />
                  )}
                  All Menu ({allCount})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`relative px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all shrink-0 ${
                      activeCat === cat.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {activeCat === cat.id && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-[var(--accent-color)] rounded-2xl -z-10 shadow-lg shadow-[var(--accent-color)]/20" />
                    )}
                    {cat.name} ({itemCountForCat(cat.id)})
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
                      className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-zinc-900 via-zinc-900/90 to-transparent flex items-center justify-end pr-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="pb-20">
            {search && filteredItems.length === 0 && (
              <div className="text-center py-32">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Search className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-300 mb-2">No matches found</h3>
                <p className="text-zinc-500 mb-8">We couldn't find anything matching "{search}"</p>
                <button onClick={() => setSearch('')} className="px-8 py-3 rounded-full bg-[var(--accent-color)] text-white font-bold">
                  Browse all dishes
                </button>
              </div>
            )}
            
            <MenuLayoutManager
              layout={layout}
              items={filteredItems}
              likedItems={likedItems}
              toggleLike={toggleLike}
              formatPrice={formatPrice}
              fontStyle={restaurant.fontStyle}
              primaryColor={restaurant.themeColor}
              theme="dark"
            />
          </div>
        </div>
      </div>

      {!embedded && (
        <footer className="relative z-20 py-16 bg-zinc-950 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-white/10" />
                <UtensilsCrossed className="w-5 h-5 text-zinc-800" />
                <div className="w-12 h-px bg-white/10" />
             </div>
             <p className="text-[10px] text-zinc-600 font-bold tracking-[0.5em] uppercase text-center">
              Crafted with Precision by <span className="text-zinc-400">MENOVA</span>
            </p>
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
