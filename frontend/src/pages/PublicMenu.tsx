import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export interface PublicMenuProps {
  previewData?: {
    restaurant: any;
    categories: any[];
    menuItems: any[];
  }
}

export default function PublicMenu({ previewData }: PublicMenuProps) {
  const { id } = useParams();
  const { cart, addToCart, updateCartQuantity, tableNumber, setTableNumber } = useStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('');
  const [showTableEntry, setShowTableEntry] = useState(!tableNumber);
  const [tableInput, setTableInput] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMenu() {
      if (previewData) {
        setRestaurant(previewData.restaurant);
        setCategories(previewData.categories);
        setMenuItems(previewData.menuItems);
        if (previewData.categories.length > 0 && !activeCat) {
          setActiveCat(previewData.categories[0].id);
        }
        setLoading(false);
        return;
      }

      if (!id || id === 'demo') {
        // Fallback or demo mode - for now just stay loading or show error
        setLoading(false);
        return;
      }
      try {
        const data = await api.getPublicMenu(id);
        setRestaurant(data.restaurant);
        setCategories(data.categories);
        setMenuItems(data.menuItems);
        if (data.categories.length > 0) setActiveCat(data.categories[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [id, previewData]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading menu...</div>;
  if (!restaurant) return <div className="min-h-screen flex items-center justify-center">Restaurant not found</div>;

  const filteredItems = menuItems.filter((i) => i.categoryId === activeCat && i.available);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartTotal = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  const getCartQty = (itemId: string) => cart.find((c) => c.menuItem.id === itemId)?.quantity || 0;

  if (showTableEntry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors"
            style={{ backgroundColor: restaurant.themeColor ? `var(--primary-color)` : 'var(--primary)', color: 'white' }}
          >
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your table number to start ordering</p>
          <Input
            type="number"
            placeholder="Table Number"
            value={tableInput}
            onChange={(e) => setTableInput(e.target.value)}
            className="text-center text-2xl font-display font-bold h-16 mb-4"
            min={1}
          />
          <Button
            className="w-full h-12"
            disabled={!tableInput || Number(tableInput) < 1}
            onClick={() => {
              setTableNumber(Number(tableInput));
              setShowTableEntry(false);
            }}
          >
            View Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background pb-24 transition-all" 
      style={{ 
        fontFamily: restaurant.fontStyle || 'Inter, sans-serif',
        ['--primary-color' as any]: restaurant.themeColor || '#f97316'
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-8 text-center transition-colors"
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
      >
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
          <UtensilsCrossed className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">{restaurant.name}</h1>
        <p className="text-white/80 text-sm mt-1">Table {tableNumber || "-"} · {restaurant.location || "Online"}</p>
      </div>

      {/* Category tabs */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border overflow-x-auto">
        <div className="flex px-4 gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeCat === cat.id
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No items available in this category.</p>
            ) : (
              filteredItems.map((item) => {
                const qty = getCartQty(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                        <span className="font-display font-bold text-[var(--primary-color)] text-sm flex-shrink-0">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="mt-3 flex items-center justify-end">
                        {qty === 0 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs hover:bg-accent transition-colors"
                            style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, qty - 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-display font-bold text-sm w-6 text-center">{qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border"
        >
          <div className="max-w-lg mx-auto">
            <Button
              className="w-full h-14 text-base justify-between text-white transition-colors border-0"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onClick={() => navigate('/cart')}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
              </div>
              <span className="font-display font-bold">₹{cartTotal}</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center py-6 text-xs text-muted-foreground">
        Powered by <span className="font-semibold text-primary">Menova</span>
      </div>
    </div>
  );
}
