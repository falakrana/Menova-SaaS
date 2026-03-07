import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cart, tableNumber, updateCartQuantity, removeFromCart, clearCart, placeOrder, restaurant } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      toast({
        title: 'Order placed! 🎉',
        description: `Your order for Table ${tableNumber} has been sent to the kitchen.`,
      });
      // Redirect back to menu or success page
      const restaurantId = restaurant?.id || 'demo';
      navigate(`/menu/${restaurantId}`);
    } catch (err: any) {
      toast({
        title: 'Order failed',
        description: 'Please try again or call your waiter.',
        variant: 'destructive'
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-sm mb-6">Add items from the menu to get started</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-lg flex-1">Your Order</h1>
          <span className="text-sm text-muted-foreground">Table {tableNumber}</span>
        </div>
      </div>

      {/* Cart items */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {cart.map((c, i) => (
          <motion.div
            key={c.menuItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 p-4 rounded-xl border border-border bg-card"
          >
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {c.menuItem.image ? (
                <img src={c.menuItem.image} alt={c.menuItem.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <UtensilsCrossed className="w-5 h-5 text-muted-foreground/30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-sm">{c.menuItem.name}</h3>
                <button onClick={() => removeFromCart(c.menuItem.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${c.menuItem.name} from cart`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(c.menuItem.id, c.quantity - 1)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label={`Decrease quantity of ${c.menuItem.name}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-display font-bold text-sm w-5 text-center">{c.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(c.menuItem.id, c.quantity + 1)}
                    className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-primary-foreground"
                    aria-label={`Increase quantity of ${c.menuItem.name}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="font-display font-bold text-primary">₹{c.menuItem.price * c.quantity}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>
          <Button className="w-full h-12 text-base" onClick={handlePlaceOrder}>
            Place Order · ₹{total}
          </Button>
        </div>
      </div>
    </div>
  );
}
