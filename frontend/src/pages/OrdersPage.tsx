import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2, CircleDot, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';

const statusConfig: Record<Order['status'], { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Pending', icon: CircleDot, color: 'bg-warning/10 text-warning border-warning/20' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-primary/10 text-primary border-primary/20' },
  ready: { label: 'Ready', icon: CheckCircle2, color: 'bg-success/10 text-success border-success/20' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'bg-muted text-muted-foreground border-border' },
};

const nextStatus: Record<Order['status'], Order['status'] | null> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
  completed: null,
};

export default function OrdersPage() {
  const { orders, updateOrderStatus, fetchOrders } = useStore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Optional: Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (id: string, next: Order['status']) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, next);
      toast({ title: `Order marked as ${next}` });
    } catch (err) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage incoming orders from your tables</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
            Refresh
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {[...orders].reverse().map((order, i) => {
              const cfg = statusConfig[order.status];
              const next = nextStatus[order.status];
              const isUpdating = updatingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold">Table {order.tableNumber}</h3>
                        <Badge variant="outline" className={`text-xs ${cfg.color}`}>
                          <cfg.icon className="w-3 h-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{timeAgo(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                    <span className="font-display font-bold text-primary">₹{order.total}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          <span className="text-muted-foreground">{item.quantity}× </span>
                          {item.menuItem.name}
                        </span>
                        <span className="text-muted-foreground">₹{item.menuItem.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {next && (
                    <Button
                      size="sm"
                      variant={next === 'completed' ? 'outline' : 'default'}
                      onClick={() => handleStatusUpdate(order.id, next)}
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Mark as {statusConfig[next].label}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
