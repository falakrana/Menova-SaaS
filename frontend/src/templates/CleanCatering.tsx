import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, X, UtensilsCrossed, MapPin, Users, Award, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';
import LocationModal from '@/components/LocationModal';

export default function CleanCatering({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [catStickyVisible, setCatStickyVisible] = useState(false);
  const catSectionRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const layout = restaurant.layout || 'classic';
  const accentColor = restaurant.accentColor || '#10b981';

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchesSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && i.available;
  });

  const itemCountForCat = (catId: string) =>
    menuItems.filter((i) => i.categoryId === catId && i.available).length;
  const allCount = menuItems.filter((i) => i.available).length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setCatStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (catSectionRef.current) observer.observe(catSectionRef.current);
    return () => observer.disconnect();
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

  const heroImage =
    restaurant.coverImage ||
    menuItems.find((i) => i.image)?.image ||
    null;

  const heroHeadline = restaurant.heroHeadline || restaurant.tagline || 'Exquisite Culinary Services';


  return (
    <div
      className={`bg-white text-slate-800 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-clip`}
      style={{
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: accentColor,
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .dot-pattern { background-image: radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0); background-size: 24px 24px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt="Logo" className="w-10 h-10 object-cover rounded-2xl border border-slate-100 shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <UtensilsCrossed className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1" style={{ fontFamily: restaurant.fontStyle }}>
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitchen Open</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch((s) => !s)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden sticky top-[73px] z-40 bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="max-w-3xl mx-auto px-8 py-8">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Find your favorite dish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/10 focus:border-[var(--accent-color)] text-lg bg-slate-50/50 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent-color)]/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-[10px] font-black uppercase tracking-[0.2em]">
              <Award className="w-3 h-3" />
              <span>Premium Catering Experience</span>
            </div>
            
            <h2
              className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter"
              style={{ fontFamily: restaurant.fontStyle }}
            >
              {heroHeadline}
            </h2>
            
            {restaurant.tagline && (
              <p className="text-slate-500 text-xl leading-relaxed max-w-xl font-medium border-l-4 border-slate-200 pl-6">
                {restaurant.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {restaurant.location && (
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>View Our Location</span>
                </button>
              )}

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full relative"
          >
            <div className="relative aspect-[4/5] md:aspect-square">
               <div className="absolute -inset-4 bg-[var(--accent-color)]/10 rounded-[3rem] blur-2xl" />
               <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-white">
                  {heroImage ? (
                    <img src={heroImage} className="w-full h-full object-cover" alt="Featured" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <ChefHat className="w-20 h-20 text-slate-200" />
                    </div>
                  )}
               </div>
               
               {/* Floating Badges */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }} 
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -top-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900 leading-none">4.9</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Avg. Rating</div>
                    </div>
                  </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 10, 0] }} 
                 transition={{ duration: 5, repeat: Infinity }}
                 className="absolute -bottom-8 -left-8 bg-white py-4 px-6 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4"
               >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">Fresh Ingredients Daily</div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Category Pill Bar */}
      <div 
        className="sticky top-[73px] z-[45] bg-white/95 backdrop-blur-xl border-b border-slate-100 py-6"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative">
            <AnimatePresence>
              {showLeftArrow && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => scrollCategories('left')}
                  className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white via-white/90 to-transparent flex items-center justify-start pl-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <div ref={catScrollRef} className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth px-6">
            <button
              onClick={() => setActiveCat('all')}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                activeCat === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'
              }`}
            >
              Full Menu ({allCount})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                  activeCat === cat.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'
                }`}
              >
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
                  className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pr-1 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Menu Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        {search && filteredItems.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Search className="w-8 h-8 text-slate-200" />
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-2">No flavors match your search</h4>
             <p className="text-slate-400 font-medium mb-10">Try searching for something else or browse all categories.</p>
             <button onClick={() => setSearch('')} className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
                Show Full Menu
             </button>
          </div>
        ) : (
          <MenuLayoutManager
            layout={layout}
            items={filteredItems}
            likedItems={likedItems}
            toggleLike={toggleLike}
            formatPrice={formatPrice}
            fontStyle={restaurant.fontStyle}
            primaryColor={restaurant.themeColor}
            theme="light"
          />
        )}
      </div>

      {!embedded && (
        <footer className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-8 text-center">
             <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm mb-12">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" />
                <span className="text-xs font-black text-slate-900 tracking-widest uppercase">{restaurant.name}</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-left">
                <div>
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Experience</h5>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      We offer a refined catering experience for every occasion, ensuring the highest standards of culinary excellence.
                   </p>
                </div>
                <div>
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Contact</h5>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">{restaurant.location || 'Visit us to learn more'}</p>
                </div>
                <div>
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Partnership</h5>
                   <p className="text-sm text-slate-900 font-bold underline underline-offset-4 cursor-pointer hover:text-[var(--accent-color)] transition-colors">
                      Host with Menova
                   </p>
                </div>
             </div>
             <div className="pt-12 border-t border-slate-200/60">
                <p className="text-[10px] text-slate-300 font-bold tracking-[0.4em] uppercase">
                  Powered by <span className="text-slate-400">MENOVA SYSTEM</span>
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
