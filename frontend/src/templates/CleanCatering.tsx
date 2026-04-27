import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, X, UtensilsCrossed, MapPin } from 'lucide-react';
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

  const heroImage =
    restaurant.coverImage ||
    menuItems.find((i) => i.image)?.image ||
    null;

  const heroHeadline = restaurant.heroHeadline || restaurant.tagline || 'Best Quality Food Service';

  const groupedItems =
    activeCat === 'all'
      ? categories.map((cat) => ({
          cat,
          items: filteredItems.filter((i) => i.categoryId === cat.id),
        })).filter((g) => g.items.length > 0)
      : null;

  return (
    <div
      className={`bg-white text-slate-800 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden`}
      style={{
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: accentColor,
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
      }}
    >
      {/* Sticky top navbar */}
      <div className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt="Logo" className="w-9 h-9 object-cover rounded-xl border border-slate-100 shadow-sm" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <h1 className="text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: restaurant.fontStyle }}>
            {restaurant.name}
          </h1>
        </div>
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden sticky top-[57px] z-40 bg-white border-b border-slate-100 shadow-sm"
          >
            <div className="max-w-2xl mx-auto px-6 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search menu items…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 focus:border-[var(--accent-color)] text-sm bg-slate-50"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 space-y-5"
        >
          <p className="text-[var(--accent-color)] font-bold tracking-widest uppercase text-xs">Professional Menu</p>
          <h2
            className="text-5xl md:text-6xl font-black text-slate-900 leading-tight"
            style={{ fontFamily: restaurant.fontStyle }}
          >
            {heroHeadline}
          </h2>
          {restaurant.tagline && restaurant.heroHeadline && (
            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">{restaurant.tagline}</p>
          )}
          {restaurant.location && (
            <button
              onClick={() => setLocationModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>View Location</span>
            </button>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="flex-1 w-full relative"
        >
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 relative shadow-xl">
            {heroImage ? (
              <img src={heroImage} className="w-full h-full object-cover" alt="Hero" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3">
                <UtensilsCrossed className="w-12 h-12 text-slate-300" />
                <p className="text-slate-400 text-sm font-medium">Add a cover image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <div
            className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden"
            style={{ background: `${accentColor}15` }}
          >
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8" style={{ color: accentColor }} />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category strip (primary) */}
      <div ref={catSectionRef} className="bg-slate-50 py-10 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCat('all')}
              className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 min-w-[110px] transition-all bg-white border-2 shrink-0 ${
                activeCat === 'all'
                  ? 'border-[var(--accent-color)] shadow-md text-[var(--accent-color)]'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black ${activeCat === 'all' ? 'bg-[var(--accent-color)]/10' : 'bg-slate-100'}`}>
                {allCount}
              </div>
              <span className="font-bold text-xs whitespace-nowrap">All</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-6 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 min-w-[110px] transition-all bg-white border-2 shrink-0 ${
                  activeCat === cat.id
                    ? 'border-[var(--accent-color)] shadow-md text-[var(--accent-color)]'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black ${activeCat === cat.id ? 'bg-[var(--accent-color)]/10' : 'bg-slate-100'}`}>
                  {itemCountForCat(cat.id)}
                </div>
                <span className="font-bold text-xs whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky mini category bar — appears when primary scrolls out */}
      <AnimatePresence>
        {catStickyVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-[57px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCat('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeCat === 'all'
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                All ({allCount})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    activeCat === cat.id
                      ? 'bg-[var(--accent-color)] text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({itemCountForCat(cat.id)})
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-14">
        {search && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-medium">No items match "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-4 text-[var(--accent-color)] text-sm font-bold hover:underline">
              Clear search
            </button>
          </div>
        )}

        {groupedItems && !search
          ? groupedItems.map(({ cat, items }) => (
              <div key={cat.id}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: restaurant.fontStyle }}>
                    {cat.name}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{items.length}</span>
                </div>
                <MenuLayoutManager
                  layout={layout}
                  items={items}
                  likedItems={likedItems}
                  toggleLike={toggleLike}
                  formatPrice={formatPrice}
                  fontStyle={restaurant.fontStyle}
                  primaryColor={restaurant.themeColor}
                  theme="light"
                />
              </div>
            ))
          : (
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
        <div className="text-center py-10 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
            Powered by <span style={{ color: accentColor }}>MENOVA</span>
          </p>
        </div>
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
