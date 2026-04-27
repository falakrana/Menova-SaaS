import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UtensilsCrossed, MapPin } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';
import LocationModal from '@/components/LocationModal';

export default function PremiumDark({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchesSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && i.available;
  });

  const layout = restaurant.layout || 'classic';
  const accentColor = restaurant.accentColor || '#f97316';

  const heroBg = restaurant.coverImage || restaurant.logoUrl || null;

  const itemCountForCat = (catId: string) =>
    menuItems.filter((i) => i.categoryId === catId && i.available).length;
  const allCount = menuItems.filter((i) => i.available).length;

  return (
    <div
      className={`bg-zinc-950 text-zinc-50 font-sans ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden`}
      style={{
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--accent-color' as any]: accentColor,
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
      }}
    >
      {/* Hero */}
      <div className="relative w-full h-[48vh] min-h-[300px] flex flex-col items-center justify-end pb-10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {heroBg ? (
            <img
              src={heroBg}
              className="w-full h-full object-cover opacity-25"
              alt="bg"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(ellipse at 60% 40%, ${accentColor}22 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #ffffff08 0%, transparent 50%)`,
              }}
            />
          )}
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.04] noise-bg" />
          {/* Bokeh blobs */}
          <div
            className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: accentColor }}
          />
          <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full blur-3xl opacity-10 bg-white" />
          {/* Gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
        </div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          {restaurant.logoUrl && (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              src={restaurant.logoUrl}
              alt="Logo"
              className="w-16 h-16 object-cover rounded-full mb-5 border-2 border-zinc-700 shadow-2xl"
            />
          )}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-zinc-400 uppercase tracking-[0.25em] text-[10px] font-bold mb-3"
          >
            {restaurant.tagline || 'Premium Restaurant'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
            style={{ fontFamily: restaurant.fontStyle }}
          >
            {restaurant.name}
          </motion.h1>
          {restaurant.location && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              onClick={() => setLocationModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium hover:bg-zinc-700 hover:text-white transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>View Location</span>
            </motion.button>
          )}
        </div>

        {/* Search toggle */}
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
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
            className="overflow-hidden bg-zinc-900 border-b border-zinc-800"
          >
            <div className="max-w-2xl mx-auto px-6 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search menu…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 focus:border-[var(--accent-color)] text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-20">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCat('all')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              activeCat === 'all'
                ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            All Menu
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeCat === 'all' ? 'bg-white/20' : 'bg-zinc-800 text-zinc-500'}`}>
              {allCount}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeCat === cat.id
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {cat.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeCat === cat.id ? 'bg-white/20' : 'bg-zinc-800 text-zinc-500'}`}>
                {itemCountForCat(cat.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {search && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg font-medium">No results for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-[var(--accent-color)] text-sm font-bold hover:underline">
              Clear search
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

      {!embedded && (
        <div className="text-center py-10 bg-zinc-900 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-600 font-bold tracking-[0.3em] uppercase">
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
