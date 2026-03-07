import { FolderOpen, UtensilsCrossed, QrCode, Eye, ArrowRight, ShoppingCart, Star, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const stats = useStore((s) => s.stats);
  const orders = useStore((s) => s.orders);

  const widgets = [
    { label: 'Menu Views', value: stats.menuViews.toLocaleString(), icon: Eye, link: '/dashboard/preview' },
    { label: 'QR Scans', value: stats.qrScans.toLocaleString(), icon: QrCode, link: '/dashboard/qr-code' },
    { label: 'Popular Item', value: stats.popularItem, icon: Star, link: '/dashboard/items' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, link: '/dashboard/orders' },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your restaurant's digital menu</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={w.link}
                className="block p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                    <w.icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-display text-2xl font-bold">{w.value}</p>
                <p className="text-sm text-muted-foreground">{w.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <Link to="/dashboard/categories" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:-translate-y-0.5 transition-all duration-200">
                <FolderOpen className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Add Category</span>
              </Link>
              <Link to="/dashboard/items" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:-translate-y-0.5 transition-all duration-200">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Add Menu Item</span>
              </Link>
              <Link to="/dashboard/qr-code" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:-translate-y-0.5 transition-all duration-200">
                <QrCode className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Download QR</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Recent Orders</h2>
              <Link to="/dashboard/orders" className="text-primary text-sm font-medium hover:underline">View all</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Table {order.tableNumber}</span>
                      <span className="text-muted-foreground ml-2">· {order.items.length} items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'pending' ? 'bg-warning/10 text-warning' :
                        order.status === 'preparing' ? 'bg-primary/10 text-primary' :
                        order.status === 'ready' ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      }`}>{order.status}</span>
                      <span className="font-display font-bold">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
