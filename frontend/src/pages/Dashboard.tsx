import { FolderOpen, UtensilsCrossed, QrCode, Eye, ArrowRight, Star, BarChart3, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/api";

export default function Dashboard() {
  const stats = useStore((s) => s.stats);
  const menuItems = useStore((s) => s.menuItems);
  const fetchStats = useStore((s) => s.fetchStats);
  const [showPopularModal, setShowPopularModal] = useState(false);
  const [showViewsModal, setShowViewsModal] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  const widgets = [
    { label: 'Menu Views', value: stats.menuViews.toLocaleString(), icon: Eye, onClick: () => setShowViewsModal(true) },
    { label: 'Menu Items', value: stats.totalItems.toLocaleString(), icon: UtensilsCrossed, link: '/dashboard/items' },
    { label: 'Popular Item', value: stats.popularItem, icon: Star, onClick: () => setShowPopularModal(true) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-in relative">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-[32px] p-8 lg:p-12 border border-primary/10 shadow-2xl shadow-primary/5">
          <div className="absolute inset-0 gradient-mesh opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 noise-bg"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/10"
               >
                 <Star className="w-3 h-3 fill-current" />
                 Platform Overview
               </motion.div>
               <h1 className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                 Welcome back, <br/>
                 <span className="text-gradient">Ready to serve?</span>
               </h1>
               <p className="text-slate-500 font-medium text-lg leading-relaxed">
                 Your digital menu is currently live and performing well. Here's a quick look at your restaurant's performance.
               </p>
            </div>
            
            <div className="flex gap-4">
               <Link to="/dashboard/preview" className="group h-16 px-8 rounded-2xl bg-slate-900 text-white flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                 <Eye className="w-5 h-5 group-hover:text-primary transition-colors" />
                 <span className="font-bold">Live Preview</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Stat Card - Spans 2 cols */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setShowViewsModal(true)}
            className="md:col-span-2 group relative overflow-hidden rounded-[32px] p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-inner">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Menu Views</p>
                   <p className="text-6xl font-black text-slate-900 tracking-tighter">{stats.menuViews.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                   <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[32px] p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            <div className="flex flex-col h-full">
               <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-8 border border-orange-200/50">
                  <UtensilsCrossed className="w-6 h-6" />
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Dishes</p>
               <p className="text-4xl font-black text-slate-900 leading-none mb-4">{stats.totalItems.toLocaleString()}</p>
               <Link to="/dashboard/items" className="mt-auto text-xs font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                  Manage Menu <ArrowRight className="w-3 h-3" />
               </Link>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => setShowPopularModal(true)}
            className="group relative overflow-hidden rounded-[32px] p-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 cursor-pointer"
          >
            <div className="flex flex-col h-full">
               <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-8 border border-yellow-200/50">
                  <Heart className="w-6 h-6 fill-current" />
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bestseller</p>
               <p className="text-lg font-black text-slate-900 leading-tight mb-4 truncate">{stats.popularItem || "None yet"}</p>
               <div className="mt-auto text-xs font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1.5">
                  View Insights <ArrowRight className="w-3 h-3" />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Tools Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] pl-1 border-l-4 border-primary">Core Utilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Link to="/dashboard/categories" className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <FolderOpen className="w-6 h-6 text-slate-400 group-hover:text-white" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Manage Categories</p>
                          <p className="text-xs text-slate-400 font-medium">Create and organize sections</p>
                       </div>
                    </div>
                 </Link>
                 <Link to="/dashboard/qr-code" className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <QrCode className="w-6 h-6 text-slate-400 group-hover:text-white" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">Generate QR Code</p>
                          <p className="text-xs text-slate-400 font-medium">Download digital menu link</p>
                       </div>
                    </div>
                 </Link>
              </div>
           </div>

           {/* Side Branding Tip */}
           <div className="rounded-[2.5rem] p-8 bg-slate-950 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col h-full">
                 <h3 className="text-xl font-black mb-4">Pro Branding Tip</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Modern menus use high-resolution food photography. Try adding "Featured" tags to your high-margin items to boost sales by up to 15%.
                 </p>
                 <Link to="/dashboard/customization" className="mt-auto inline-flex items-center justify-center gap-2 group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-slate-950 transition-all font-bold text-sm">
                    Customize Look <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>

        <PopularItemsModal 
          open={showPopularModal} 
          onOpenChange={setShowPopularModal} 
          items={menuItems} 
        />

        <MenuViewsModal
          open={showViewsModal}
          onOpenChange={setShowViewsModal}
          totalViews={stats.menuViews}
        />
      </div>
    </DashboardLayout>
  );

}

function WidgetContent({ w }: { w: any }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
          <w.icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-display text-2xl font-bold line-clamp-1">{w.value}</p>
      <p className="text-sm text-muted-foreground">{w.label}</p>
    </>
  );
}

function MenuViewsModal({ open, onOpenChange, totalViews }: { open: boolean, onOpenChange: (open: boolean) => void, totalViews: number }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && date?.from && date?.to) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await api.getViewsAnalytics(
            startOfDay(date.from!).toISOString(),
            endOfDay(date.to!).toISOString()
          );
          setData(res);
        } catch (err) {
          console.error('Failed to fetch analytics:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, date]);

  // Aggregate stats from fetched data
  const totalInRange = data.reduce((sum, d) => sum + d.views, 0);
  const averageViews = data.length > 0 ? Math.round(totalInRange / data.length) : 0;
  const mostViewedDay = data.length > 0 
    ? data.reduce((max, day) => day.views > max.views ? day : max)
    : { date: 'N/A', views: 0 };
  
  const maxViews = Math.max(...(data.length > 0 ? data.map(d => d.views) : [0]), 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Menu Views Analytics
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-[260px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">{totalInRange.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Views in Period</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">{averageViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Daily Average</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-bold text-primary">{mostViewedDay.views}</p>
              <p className="text-sm text-muted-foreground">Peak Day</p>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Daily Traffic</h3>
              {loading && <div className="text-xs text-muted-foreground animate-pulse">Loading data...</div>}
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {data.map((day) => (
                  <div key={day.date} className="flex items-center gap-3 group">
                    <div className="w-24 text-sm text-muted-foreground">
                      <div className="font-medium text-foreground">{format(new Date(day.date), "EEE")}</div>
                      <div className="text-[10px] uppercase tracking-tighter">{format(new Date(day.date), "MMM dd")}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.views / maxViews) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                              day.views === mostViewedDay.views ? 'bg-primary' : 'bg-primary/40'
                            }`}
                          />
                          <span className="absolute left-3 inset-y-0 flex items-center text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {day.views} views
                          </span>
                        </div>
                        {day.views === mostViewedDay.views && day.views > 0 && (
                          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                    <BarChart3 className="w-12 h-12 mb-2" />
                    <p>No activity recorded for this period</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Dynamic Insights */}
          {data.length > 0 && totalInRange > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border border-primary/10 p-4 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-primary mb-1">Menu Engagement Insight</p>
                  <p className="text-slate-700">
                    Your busiest day was <span className="font-bold">{format(new Date(mostViewedDay.date), "EEEE, MMM dd")}</span> with <span className="font-bold">{mostViewedDay.views}</span> visits. 
                    {totalInRange > 50 && " This shows strong consistent interest in your menu."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PopularItemsModal({ open, onOpenChange, items }: { open: boolean, onOpenChange: (open: boolean) => void, items: any[] }) {
  const sortedItems = [...items].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">All Menu Items</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4 pr-4">
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex-1 min-w-0 mr-4">
                  <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                </div>
                <div className="flex items-center gap-1 text-[var(--accent-color)]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="text-sm font-bold">{item.likesCount || 0}</span>
                </div>
              </div>
            ))}
            {sortedItems.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-10">No items found</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
