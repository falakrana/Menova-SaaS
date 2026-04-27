import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UtensilsCrossed, MapPin } from 'lucide-react';
import { TemplateProps } from './TemplateEngine';
import MenuLayoutManager from '@/components/MenuLayoutManager';
import LocationModal from '@/components/LocationModal';

export default function WarmRustic({
  restaurant, categories, menuItems, activeCat, setActiveCat, likedItems, toggleLike, formatPrice, embedded
}: TemplateProps) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const layout = restaurant.layout || 'classic';
  const accent = restaurant.accentColor || '#D47530';

  const filteredItems = menuItems.filter((i) => {
    const matchesCat = activeCat === 'all' || i.categoryId === activeCat;
    const matchesSearch = !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch && i.available;
  });

  const itemCountForCat = (catId: string) =>
    menuItems.filter((i) => i.categoryId === catId && i.available).length;
  const allCount = menuItems.filter((i) => i.available).length;

  const groupedItems =
    activeCat === 'all'
      ? categories.map((cat) => ({
          cat,
          items: filteredItems.filter((i) => i.categoryId === cat.id),
        })).filter((g) => g.items.length > 0)
      : null;

  return (
    <div
      className={`text-[#4A4036] ${embedded ? 'h-full min-h-0' : 'min-h-screen pb-24'} overflow-x-hidden relative`}
      style={{
        fontFamily: restaurant.bodyFont || 'Merriweather, serif',
        ['--accent-color' as any]: accent,
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
        backgroundColor: '#F9F6F0',
        backgroundImage: `url('https://www.transparenttextures.com/patterns/rice-paper-2.png')`,
      }}
    >
      {/* Top bar */}
      <div className="w-full py-3 px-6 flex items-center justify-between sticky top-0 z-50 border-b border-[#D47530]/10"
        style={{ backgroundColor: '#F9F6F0ee', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt="Logo" className="w-8 h-8 object-cover rounded-full border-2 shadow-sm" style={{ borderColor: `${accent}40` }} />
          ) : (
            <UtensilsCrossed className="w-5 h-5" style={{ color: accent }} />
          )}
          <span className="font-bold text-sm tracking-tight" style={{ fontFamily: restaurant.fontStyle, color: accent }}>
            {restaurant.name}
          </span>
        </div>
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
          style={{ borderColor: `${accent}30`, color: accent }}
        >
          {showSearch ? <X className="w-3.5 h-3.5" /> : <Search className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
            style={{ borderColor: `${accent}15`, backgroundColor: '#F9F6F0' }}
          >
            <div className="max-w-2xl mx-auto px-6 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: `${accent}80` }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search dishes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                  style={{
                    borderColor: `${accent}30`,
                    backgroundColor: '#EFE9E0',
                    color: '#4A4036',
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: `${accent}60` }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero header */}
      <div className="pt-14 pb-10 flex flex-col items-center justify-center text-center px-4 relative z-10">
        {/* Decorative rings */}
        <div className="relative mb-6">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative"
            style={{ background: '#EFE9E0' }}
          >
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <span className="text-2xl font-bold italic" style={{ color: accent }}>
                {restaurant.name?.[0] || 'R'}
              </span>
            )}
          </div>
          {/* dashed ring */}
          <div
            className="absolute inset-[-6px] rounded-full border-2 border-dashed pointer-events-none"
            style={{ borderColor: `${accent}40` }}
          />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-sm"
          style={{ fontFamily: restaurant.fontStyle, color: accent }}
        >
          {restaurant.name}
        </motion.h1>

        {restaurant.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-md text-[#8C7A6B] text-base italic leading-relaxed"
          >
            {restaurant.tagline}
          </motion.p>
        )}

        {restaurant.location && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setLocationModalOpen(true)}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <MapPin className="w-4 h-4" />
            <span>View Location</span>
          </motion.button>
        )}

        {/* Ornamental divider */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-12 h-px" style={{ background: `${accent}40` }} />
          <span style={{ color: `${accent}60` }}>✦</span>
          <div className="w-12 h-px" style={{ background: `${accent}40` }} />
        </div>
      </div>

      {/* Hero cover image (if available) */}
      {(restaurant.coverImage || (menuItems.length > 0 && menuItems[0]?.image)) && (
        <div className="max-w-3xl mx-auto px-6 mb-10">
          <div className="w-full aspect-[16/7] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={restaurant.coverImage || menuItems[0]?.image}
              className="w-full h-full object-cover"
              alt="Cover"
            />
          </div>
        </div>
      )}

      {/* Category strip — horizontally scrollable single row */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <div
          ref={catScrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
        >
          <button
            onClick={() => setActiveCat('all')}
            className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border-2 shrink-0 flex items-center gap-1.5"
            style={
              activeCat === 'all'
                ? { background: accent, color: '#fff', borderColor: accent }
                : { background: 'transparent', color: '#8C7A6B', borderColor: `${accent}25` }
            }
          >
            All
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black" style={{ background: activeCat === 'all' ? 'rgba(255,255,255,0.25)' : `${accent}15`, color: activeCat === 'all' ? '#fff' : accent }}>
              {allCount}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border-2 shrink-0 flex items-center gap-1.5"
              style={
                activeCat === cat.id
                  ? { background: accent, color: '#fff', borderColor: accent }
                  : { background: 'transparent', color: '#8C7A6B', borderColor: `${accent}25` }
              }
            >
              {cat.name}
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black" style={{ background: activeCat === cat.id ? 'rgba(255,255,255,0.25)' : `${accent}15`, color: activeCat === cat.id ? '#fff' : accent }}>
                {itemCountForCat(cat.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-12">
        {search && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8C7A6B] text-lg font-medium italic">No dishes match "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-3 text-sm font-bold hover:underline" style={{ color: accent }}>
              Clear search
            </button>
          </div>
        )}

        {groupedItems && !search
          ? groupedItems.map(({ cat, items }) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold" style={{ fontFamily: restaurant.fontStyle, color: accent }}>
                    {cat.name}
                  </h2>
                  <div className="flex-1 h-px" style={{ background: `${accent}25` }} />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>
                    {items.length}
                  </span>
                </div>
                <MenuLayoutManager
                  layout={layout}
                  items={items}
                  likedItems={likedItems}
                  toggleLike={toggleLike}
                  formatPrice={formatPrice}
                  fontStyle={restaurant.fontStyle}
                  primaryColor={accent}
                  theme="warm"
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
              primaryColor={accent}
              theme="warm"
            />
          )}
      </div>

      {!embedded && (
        <div className="text-center py-10" style={{ borderTop: `1px solid ${accent}15` }}>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase italic" style={{ color: '#8C7A6B' }}>
            Powered by <span style={{ color: accent }}>Menova</span>
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
