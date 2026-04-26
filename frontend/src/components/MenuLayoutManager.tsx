import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Flame, UtensilsCrossed } from 'lucide-react';

const DietaryIcons = ({ item }: { item: any }) => (
  <div className="flex items-center gap-1.5 shrink-0 mt-1">
    {item.isVeg && (
      <div className="w-3.5 h-3.5 rounded-sm border border-green-600 flex items-center justify-center p-[2px]">
        <div className="w-full h-full rounded-full bg-green-600" />
      </div>
    )}
    {item.isSpicy && <Flame className="w-4 h-4 text-orange-500 fill-current" />}
    {item.isGlutenFree && (
      <div className="px-1 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[7px] font-black uppercase tracking-tighter border border-blue-200">
        GF
      </div>
    )}
    {item.specifications?.map((spec: string) => (
      <div key={spec} className="px-1 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[7px] font-black uppercase tracking-tighter border border-slate-200">
        {spec}
      </div>
    ))}
  </div>
);

interface MenuLayoutManagerProps {
  layout: string;
  items: any[];
  likedItems: string[];
  toggleLike: (id: string) => void;
  formatPrice: (price: number) => string;
  fontStyle?: string;
  primaryColor?: string;
}

export default function MenuLayoutManager({ 
  layout, items, likedItems, toggleLike, formatPrice, fontStyle, primaryColor 
}: MenuLayoutManagerProps) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-20 px-4 bg-white/5 bg-black/5 backdrop-blur-sm rounded-[32px] border border-dashed border-border/60">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
           <UtensilsCrossed className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <p className="text-muted-foreground font-medium">No items available in this category.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={
        layout === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          : "flex flex-col gap-4 lg:gap-6 max-w-4xl mx-auto w-full"
      }
    >
      {items.map((item, index) => {
        const isHot = item.likesCount > 4;

        // 1. MINIMAL LAYOUT
        if (layout === 'minimal') {
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-white/5 border border-slate-100/10 hover:bg-white/10 transition-all duration-300 gap-4 w-full"
            >
              <div className="flex-1 min-w-0 sm:pr-6 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-black text-lg group-hover:text-primary transition-colors" style={{ fontFamily: fontStyle }}>{item.name}</h3>
                  {isHot && <Star className="w-3 h-3 text-orange-400 fill-current" />}
                  <DietaryIcons item={item} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{item.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display font-black text-xl tracking-tight shrink-0">{formatPrice(item.price)}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    likedItems.includes(item.id) 
                      ? 'bg-red-500 border-red-400 text-white shadow-lg' 
                      : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          );
        }

        // 2. CLASSIC LAYOUT
        if (layout === 'classic') {
          return (
            <motion.div
              key={item.id}
              layout
              className="group flex flex-col sm:flex-row rounded-[2.5rem] bg-white/5 border border-slate-100/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-fit sm:h-44 w-full"
            >
              <div className="w-full sm:w-44 h-44 sm:h-full relative overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                     <UtensilsCrossed size={40} />
                  </div>
                )}
                {isHot && <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-orange-400 text-white text-[8px] font-black uppercase tracking-widest">Hot</div>}
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between text-left">
                 <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                       <h3 className="font-display font-black text-xl group-hover:text-primary transition-colors leading-none" style={{ fontFamily: fontStyle }}>{item.name}</h3>
                       <DietaryIcons item={item} />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="font-display font-black text-2xl tracking-tight">{formatPrice(item.price)}</span>
                    <button
                       onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                       className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                         likedItems.includes(item.id) 
                           ? 'bg-red-500 border-red-400 text-white shadow-lg' 
                           : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-white hover:text-red-500'
                       }`}
                    >
                       <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                 </div>
              </div>
            </motion.div>
          );
        }

        // 3. GRID LAYOUT
        return (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative flex flex-col rounded-[2.5rem] border border-border/50 bg-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden w-full ${
              isHot ? 'ring-2 ring-[var(--accent-color)]/20 shadow-[var(--accent-color)]/5' : ''
            } `}
          >
            <div className="relative h-44 bg-slate-50/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05] noise-bg" />
              
              <div className="relative w-32 h-32 rounded-full border-[6px] border-white shadow-2xl overflow-hidden z-10 transition-all duration-500 group-hover:scale-110 bg-white/10">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100/10">
                     <UtensilsCrossed className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {isHot && (
                   <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                      Bestseller
                   </span>
                )}
              </div>
            </div>

            <div className="flex-1 p-8 flex flex-col text-left">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 
                  className="font-display font-black text-xl leading-snug group-hover:text-[var(--primary-color)] transition-colors duration-300"
                  style={{ fontFamily: fontStyle }}
                >
                  {item.name}
                </h3>
                <DietaryIcons item={item} />
              </div>
              
              {item.description && (
                <p className="text-muted-foreground/80 font-medium text-xs mb-8 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Price</span>
                  <span className="font-display font-black text-2xl tracking-tighter">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                   <button
                     onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                     className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md ${
                       likedItems.includes(item.id) 
                         ? 'bg-red-500 border-red-400 text-white shadow-lg' 
                         : 'bg-slate-100/10 border-slate-200/10 text-muted-foreground hover:text-red-500 hover:bg-white'
                     }`}
                   >
                     <Heart className={`w-6 h-6 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
