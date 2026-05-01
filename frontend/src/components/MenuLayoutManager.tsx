import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Flame, UtensilsCrossed } from 'lucide-react';

type Theme = 'light' | 'dark' | 'warm' | 'default';

const DietaryBadge = ({ label, bg, text, border }: { label: string; bg: string; text: string; border: string }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border"
    style={{ background: bg, color: text, borderColor: border }}
  >
    {label}
  </span>
);

const DietaryIcons = ({ item, theme }: { item: any; theme: Theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-1 shrink-0 flex-wrap">
      {item.isVeg && (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border"
          style={{ background: '#dcfce7', color: '#16a34a', borderColor: '#bbf7d0' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Veg
        </span>
      )}
      {item.isSpicy && (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight border"
          style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}
        >
          <Flame className="w-2.5 h-2.5" />
          Spicy
        </span>
      )}
      {item.isGlutenFree && (
        <DietaryBadge label="GF" bg={isDark ? '#1e3a5f' : '#dbeafe'} text={isDark ? '#93c5fd' : '#1d4ed8'} border={isDark ? '#2563eb40' : '#bfdbfe'} />
      )}
      {item.specifications?.map((spec: string) => (
        <DietaryBadge
          key={spec}
          label={spec}
          bg={isDark ? '#27272a' : '#f1f5f9'}
          text={isDark ? '#a1a1aa' : '#475569'}
          border={isDark ? '#3f3f46' : '#e2e8f0'}
        />
      ))}
    </div>
  );
};

function ImageWithSkeleton({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100/10`}>
        <UtensilsCrossed className="w-8 h-8 text-slate-400/30" />
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200/30 via-slate-100/50 to-slate-200/30" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

interface MenuLayoutManagerProps {
  layout: string;
  items: any[];
  likedItems: string[];
  toggleLike: (id: string) => void;
  formatPrice: (price: number) => string;
  fontStyle?: string;
  primaryColor?: string;
  theme?: Theme;
}

function getCardStyles(theme: Theme) {
  switch (theme) {
    case 'dark':
      return {
        card: 'bg-zinc-900 border border-zinc-800 shadow-xl hover:shadow-2xl hover:border-zinc-700',
        text: 'text-zinc-100',
        subtext: 'text-zinc-400',
        price: 'text-zinc-100',
        likeBtn: 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-red-400 hover:bg-zinc-700',
        likeBtnActive: 'bg-red-500 border-red-400 text-white shadow-lg',
        badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        hotBadge: 'bg-orange-500 text-white',
      };
    case 'warm':
      return {
        card: 'bg-white border border-[#D47530]/10 shadow-md hover:shadow-xl',
        text: 'text-[#4A4036]',
        subtext: 'text-[#8C7A6B]',
        price: 'text-[#D47530]',
        likeBtn: 'bg-[#F9F6F0] border-[#D47530]/20 text-[#8C7A6B] hover:text-red-400 hover:bg-red-50',
        likeBtnActive: 'bg-red-500 border-red-400 text-white shadow-lg',
        badge: 'bg-[#F9F6F0] text-[#8C7A6B] border-[#D47530]/15',
        hotBadge: 'bg-[#D47530] text-white',
      };
    case 'light':
      return {
        card: 'bg-white border border-slate-100 shadow-md hover:shadow-xl',
        text: 'text-slate-900',
        subtext: 'text-slate-500',
        price: 'text-slate-900',
        likeBtn: 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50',
        likeBtnActive: 'bg-red-500 border-red-400 text-white shadow-lg',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        hotBadge: 'bg-orange-400 text-white',
      };
    default:
      return {
        card: 'bg-white/5 border border-slate-100/10 shadow-xl hover:shadow-2xl',
        text: 'text-foreground',
        subtext: 'text-muted-foreground',
        price: 'text-foreground',
        likeBtn: 'bg-muted/50 border-transparent text-muted-foreground hover:bg-white hover:text-red-500',
        likeBtnActive: 'bg-red-500 border-red-400 text-white shadow-lg',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        hotBadge: 'bg-orange-400 text-white',
      };
  }
}

export default function MenuLayoutManager({
  layout, items, likedItems, toggleLike, formatPrice, fontStyle, primaryColor, theme = 'default',
}: MenuLayoutManagerProps) {
  const styles = getCardStyles(theme);
  const [flippedItemId, setFlippedItemId] = useState<string | null>(null);

  useEffect(() => {
    setFlippedItemId(null);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-20 px-4 bg-white/5 backdrop-blur-sm rounded-[32px] border border-dashed border-border/60">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
          <UtensilsCrossed className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <p className="text-muted-foreground font-medium">No items available in this category.</p>
      </div>
    );
  }

  // Identify the most liked item (if more than 0 likes)
  const mostLikedItem = items.reduce((prev, current) => 
    (current.likesCount > 0 && current.likesCount > (prev?.likesCount || 0)) ? current : prev, 
    null as any
  );

  return (
    <motion.div
      layout
      className={
        layout === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8'
          : 'flex flex-col gap-4 lg:gap-5 max-w-4xl mx-auto w-full'
      }
    >
      {items.map((item, index) => {
        const isHot = item.likesCount > 4;
        const liked = likedItems.includes(item.id);
        const isMostLiked = mostLikedItem && item.id === mostLikedItem.id;
        const isFeatured = item.isFeatured || isMostLiked;
        const hasDescription = Boolean(item.description?.trim());
        const isFlipped = flippedItemId === item.id;

        // ANIMATION VARIANTS
        const cardVariants = {
          hidden: { opacity: 0, y: 30, scale: 0.95 },
          visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
              duration: 0.5, 
              ease: "easeOut",
              delay: (index % 4) * 0.1 // Staggering effect
            }
          }
        };

        // MINIMAL LAYOUT
        if (layout === 'minimal') {
          if (!hasDescription) {
            return (
              <motion.div
                key={item.id}
                layout
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl transition-all duration-300 gap-4 w-full ${styles.card} ${
                  isFeatured ? 'ring-2 ring-[var(--accent-color,orange)]/30 bg-[var(--accent-color,orange)]/[0.02]' : ''
                }`}
              >
                <div className="flex-1 min-w-0 sm:pr-4 text-left">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-display font-black text-lg leading-none ${styles.text}`} style={{ fontFamily: fontStyle }}>
                      {item.name}
                    </h3>
                    {isMostLiked && <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-yellow-950 text-[8px] font-black uppercase tracking-tighter flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> Most Liked</span>}
                    {item.isFeatured && !isMostLiked && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-tighter">Chef's Pick</span>}
                    {isHot && !isFeatured && <Star className="w-3 h-3 text-orange-400 fill-current shrink-0" />}
                  </div>
                  <div className="mb-1">
                    <DietaryIcons item={item} theme={theme} />
                  </div>
                  <p className={`text-xs font-medium ${styles.subtext}`}>{item.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-display font-black text-xl tracking-tight ${styles.price}`}>{formatPrice(item.price)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.id}
              layout
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => setFlippedItemId((prev) => (prev === item.id ? null : item.id))}
              className={`relative w-full cursor-pointer [perspective:1200px] ${
                isFeatured ? 'ring-2 ring-[var(--accent-color,orange)]/30 bg-[var(--accent-color,orange)]/[0.02] rounded-2xl' : ''
              }`}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="relative grid [transform-style:preserve-3d]"
              >
                <div className={`group col-start-1 row-start-1 flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl transition-all duration-300 gap-4 w-full ${styles.card} [backface-visibility:hidden]`}>
                  <div className="flex-1 min-w-0 sm:pr-4 text-left">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`font-display font-black text-lg leading-none ${styles.text}`} style={{ fontFamily: fontStyle }}>
                        {item.name}
                      </h3>
                      {isMostLiked && <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-yellow-950 text-[8px] font-black uppercase tracking-tighter flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> Most Liked</span>}
                      {item.isFeatured && !isMostLiked && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-tighter">Chef's Pick</span>}
                      {isHot && !isFeatured && <Star className="w-3 h-3 text-orange-400 fill-current shrink-0" />}
                    </div>
                    <div className="mb-1">
                      <DietaryIcons item={item} theme={theme} />
                    </div>
                    <p className={`text-xs font-medium line-clamp-2 ${styles.subtext}`}>{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-display font-black text-xl tracking-tight ${styles.price}`}>{formatPrice(item.price)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className={`col-start-1 row-start-1 flex flex-col p-5 rounded-2xl w-full ${styles.card} [transform:rotateY(180deg)] [backface-visibility:hidden]`}>
                  <p className={`text-xs font-medium leading-relaxed overflow-y-auto ${styles.subtext}`}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        }

        // CLASSIC LAYOUT
        if (layout === 'classic') {
          if (!hasDescription) {
            return (
              <motion.div
                key={item.id}
                layout
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`group flex flex-row rounded-3xl transition-all duration-500 overflow-hidden h-36 sm:h-44 w-full ${styles.card} ${
                  isFeatured ? 'ring-2 ring-[var(--accent-color,orange)]/30' : ''
                }`}
              >
                <div className="w-32 sm:w-44 h-full relative shrink-0">
                  <ImageWithSkeleton
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  {isMostLiked && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-yellow-400 text-yellow-950 text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Popular
                    </div>
                  )}
                  {item.isFeatured && !isMostLiked && (
                     <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  )}
                  {isHot && !isFeatured && (
                    <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${styles.hotBadge}`}>
                      🔥 Hot
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between text-left min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className={`font-display font-black text-base sm:text-lg leading-snug line-clamp-1 ${styles.text}`} style={{ fontFamily: fontStyle }}>
                        {item.name}
                      </h3>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <DietaryIcons item={item} theme={theme} />
                    </div>
                    <p className={`text-[11px] sm:text-xs font-medium line-clamp-2 leading-relaxed ${styles.subtext}`}>{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
                    <span className={`font-display font-black text-lg sm:text-2xl tracking-tight ${styles.price}`}>{formatPrice(item.price)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.id}
              layout
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => setFlippedItemId((prev) => (prev === item.id ? null : item.id))}
              className={`relative h-36 sm:h-44 w-full cursor-pointer [perspective:1200px] ${
                isFeatured ? 'ring-2 ring-[var(--accent-color,orange)]/30 rounded-3xl' : ''
              }`}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="relative h-full [transform-style:preserve-3d]"
              >
                <div className={`group absolute inset-0 flex flex-row rounded-3xl transition-all duration-500 overflow-hidden ${styles.card} [backface-visibility:hidden]`}>
                  <div className="w-32 sm:w-44 h-full relative shrink-0">
                    <ImageWithSkeleton
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    {isMostLiked && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-yellow-400 text-yellow-950 text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Popular
                      </div>
                    )}
                    {item.isFeatured && !isMostLiked && (
                       <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                        Featured
                      </div>
                    )}
                    {isHot && !isFeatured && (
                      <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${styles.hotBadge}`}>
                        🔥 Hot
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between text-left min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className={`font-display font-black text-base sm:text-lg leading-snug line-clamp-1 ${styles.text}`} style={{ fontFamily: fontStyle }}>
                          {item.name}
                        </h3>
                      </div>
                      <div className="mb-1 sm:mb-2">
                        <DietaryIcons item={item} theme={theme} />
                      </div>
                      <p className={`text-[11px] sm:text-xs font-medium line-clamp-2 leading-relaxed ${styles.subtext}`}>{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3">
                      <span className={`font-display font-black text-lg sm:text-2xl tracking-tight ${styles.price}`}>{formatPrice(item.price)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                      >
                        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`absolute inset-0 rounded-3xl overflow-hidden p-3 sm:p-5 ${styles.card} [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col`}>
                  <p className={`text-[11px] sm:text-xs font-medium leading-relaxed overflow-y-auto ${styles.subtext}`}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        }

        // GRID LAYOUT
        if (!hasDescription) {
          return (
            <motion.div
              key={item.id}
              layout
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className={`group relative flex flex-col rounded-3xl transition-all duration-500 overflow-hidden w-full ${styles.card} ${
                isFeatured ? (isMostLiked ? 'ring-2 ring-yellow-400 shadow-yellow-400/10' : 'ring-2 ring-primary/30') : ''
              } ${isFeatured && layout === 'grid' ? 'sm:col-span-1 lg:col-span-1' : ''}`} // We could make it span 2 columns but it might break grid flow too much
            >
              <div className="relative h-28 sm:h-44 overflow-hidden">
                <ImageWithSkeleton
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {isMostLiked && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5 animate-bounce-subtle">
                    <Star className="w-3.5 h-3.5 fill-current" /> Most Loved
                  </div>
                )}
                {item.isFeatured && !isMostLiked && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 fill-current" /> Must Try
                  </div>
                )}
                {isHot && !isFeatured && (
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${styles.hotBadge}`}>
                    🔥 Bestseller
                  </div>
                )}
              </div>

              <div className="flex-1 p-3 sm:p-5 flex flex-col text-left">
                <div className="mb-1.5">
                  <DietaryIcons item={item} theme={theme} />
                </div>
                <h3
                  className={`font-display font-black text-sm sm:text-lg leading-snug mb-1 line-clamp-1 ${styles.text}`}
                  style={{ fontFamily: fontStyle }}
                >
                  {item.name}
                </h3>
                {item.description && (
                  <p className={`text-[11px] sm:text-xs mb-2 sm:mb-4 line-clamp-2 leading-relaxed ${styles.subtext}`}>
                    {item.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-100/10">
                  <span className={`font-display font-black text-base sm:text-xl tracking-tighter ${styles.price}`}>
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={item.id}
            layout
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            onClick={() => setFlippedItemId((prev) => (prev === item.id ? null : item.id))}
            className={`relative w-full cursor-pointer min-h-[18rem] sm:min-h-[24rem] [perspective:1200px] ${
              isFeatured && layout === 'grid' ? 'sm:col-span-1 lg:col-span-1' : ''
            }`}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative h-full [transform-style:preserve-3d]"
            >
              <div
                className={`group absolute inset-0 flex flex-col rounded-3xl transition-all duration-500 overflow-hidden ${styles.card} [backface-visibility:hidden] ${
                  isFeatured ? (isMostLiked ? 'ring-2 ring-yellow-400 shadow-yellow-400/10' : 'ring-2 ring-primary/30') : ''
                }`}
              >
                <div className="relative h-28 sm:h-44 overflow-hidden">
                  <ImageWithSkeleton
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {isMostLiked && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5 animate-bounce-subtle">
                      <Star className="w-3.5 h-3.5 fill-current" /> Most Loved
                    </div>
                  )}
                  {item.isFeatured && !isMostLiked && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-current" /> Must Try
                    </div>
                  )}
                  {isHot && !isFeatured && (
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg ${styles.hotBadge}`}>
                      🔥 Bestseller
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 sm:p-5 flex flex-col text-left">
                  <div className="mb-1.5">
                    <DietaryIcons item={item} theme={theme} />
                  </div>
                  <h3
                    className={`font-display font-black text-sm sm:text-lg leading-snug mb-1 line-clamp-1 ${styles.text}`}
                    style={{ fontFamily: fontStyle }}
                  >
                    {item.name}
                  </h3>
                  <p className={`text-[11px] sm:text-xs mb-2 sm:mb-4 line-clamp-2 leading-relaxed ${styles.subtext}`}>
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-100/10">
                    <span className={`font-display font-black text-base sm:text-xl tracking-tighter ${styles.price}`}>
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${liked ? styles.likeBtnActive : styles.likeBtn}`}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`absolute inset-0 flex flex-col rounded-3xl overflow-hidden p-3 sm:p-5 ${styles.card} [transform:rotateY(180deg)] [backface-visibility:hidden]`}
              >
                <p className={`text-[11px] sm:text-xs leading-relaxed overflow-y-auto pr-1 ${styles.subtext}`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
