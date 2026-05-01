import { FolderOpen, UtensilsCrossed, QrCode, Eye, ArrowRight, ArrowLeft, Star, BarChart3, X, Heart, TrendingUp, Plus, Palette, Share2, Copy, ChevronDown, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useUser } from '@clerk/react';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/api";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Camera, Globe, Link as LinkIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { useRef, useCallback } from 'react';
import type { MenuItem } from '@/types';

export default function Dashboard() {
  const { user } = useUser();
  const stats = useStore((s) => s.stats);
  const menuItems = useStore((s) => s.menuItems);
  const fetchStats = useStore((s) => s.fetchStats);
  const restaurant = useStore((s) => s.restaurant);
  const [showPopularModal, setShowPopularModal] = useState(false);
  const [showViewsModal, setShowViewsModal] = useState(false);

  const firstName = user?.firstName || user?.username || "there";

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // --- Add Menu Item Logic ---
  const { categories, addMenuItem, fetchMenuItems } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false, specifications: [] as string[] });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'device' | 'url' | 'camera' | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const updateForm = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false, specifications: [] });
    setUploadMode(null);
    setDialogOpen(true);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.specifications.includes(tagInput.trim())) {
        updateForm('specifications', [...form.specifications, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateForm('specifications', form.specifications.filter(t => t !== tag));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await useStore.getState().uploadImage(file, 'menu-items');
      updateForm('image', url);
      setUploadMode(null);
      toast({ title: 'Image uploaded successfully' });
    } catch (err) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!imageUrlInput.trim()) return;
    setUploading(true);
    try {
      const { url } = await useStore.getState().uploadImageFromUrl(imageUrlInput.trim(), 'menu-items');
      updateForm('image', url);
      setUploadMode(null);
      setImageUrlInput('');
      toast({ title: 'Image uploaded from URL' });
    } catch (err) {
      toast({ title: 'Failed to fetch image from URL', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      setUploadMode('camera');
    } catch (err) {
      toast({ title: 'Could not access camera', variant: 'destructive' });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUploadMode(null);
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setUploading(true);
            try {
              const { url } = await useStore.getState().uploadImage(file, 'menu-items');
              updateForm('image', url);
              stopCamera();
              toast({ title: 'Photo captured and uploaded' });
            } catch (err) {
              toast({ title: 'Failed to upload photo', variant: 'destructive' });
            } finally {
              setUploading(false);
            }
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    if (!dialogOpen) stopCamera();
  }, [dialogOpen, stopCamera]);

  useEffect(() => {
    if (uploadMode === 'camera' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [uploadMode, stream]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || parseFloat(form.price) <= 0) return;
    const cat = categories.find((c) => c.id === form.categoryId);
    setFormLoading(true);
    try {
      await addMenuItem({
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        categoryName: cat?.name || '',
        available: form.available,
      });
      toast({ title: 'Item added' });
      setDialogOpen(false);
    } catch (err) {
      toast({ title: 'Failed to save item', variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  // --- Share Menu Logic ---
  const handleShare = () => {
    const restaurantId = useStore.getState().restaurant?.id;
    if (!restaurantId) return;
    const menuUrl = `${window.location.origin}/menu/${restaurantId}`;
    navigator.clipboard.writeText(menuUrl);
    toast({ title: 'Menu link copied!' });
  };

  // --- Download QR Logic ---
  const handleDownloadQR = async () => {
    const restaurant = useStore.getState().restaurant;
    if (!restaurant?.id) return;
    try {
      const data = await api.getQRCode(restaurant.id);
      if (!data.qr_code_url) throw new Error();
      const response = await fetch(data.qr_code_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${restaurant.name}-qr-code.png`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'QR code downloaded!' });
    } catch (err) {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const heroSubtitle = stats.menuViews > 0
    ? `Your menu has received ${stats.menuViews.toLocaleString()} views${stats.popularItem ? ` — ${stats.popularItem} is trending!` : ' and is performing well.'}`
    : "Your digital menu is live and ready to impress your guests.";

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <DashboardLayout>
      <div className="space-y-12 animate-fade-in relative">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-[24px] p-8 lg:p-10 border border-primary/10 shadow-2xl shadow-primary/5 hero-section-bg">
          {/* Background blobs */}
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-primary/5 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute inset-0 noise-bg" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* LEFT — Text content */}
            <motion.div
              className="max-w-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-widest mb-5 border border-primary/20 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <Star className="w-3 h-3 fill-current" />
                Platform Overview
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="font-display text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
              >
                Welcome back, {firstName}!<br />
                <span className="text-gradient">Ready to serve?</span>
              </motion.h1>

              {/* Dynamic subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-slate-500 font-medium text-base leading-relaxed mb-7"
              >
                {heroSubtitle}
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
                <a
                  href={`/menu/${restaurant?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-12 px-7 rounded-xl bg-slate-900 text-white flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <Eye className="w-4 h-4 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-sm">Live Preview</span>
                </a>

                <Link
                  to="/dashboard/qr-code"
                  className="group h-12 px-7 rounded-xl border border-primary/25 bg-white/70 backdrop-blur-sm text-primary flex items-center gap-2.5 hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-md font-bold text-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 flex flex-col gap-2 w-full lg:w-60"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 pl-1">Quick Actions</p>

              <button
                onClick={openAdd}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md shadow-slate-200/40 hover:border-primary/30 hover:shadow-primary/10 hover:bg-white transition-all duration-200 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Add Menu Item</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={handleShare}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-md shadow-slate-200/40 hover:border-primary/30 hover:shadow-primary/10 hover:bg-white transition-all duration-200 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Share Menu</span>
                <Copy className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-blue-500 group-hover:scale-110 transition-all" />
              </button>
            </motion.div>
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

        {/* Menu Performance + Top Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <MenuPerformanceCard />
          <TopPerformingCategoriesCard />
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

        {/* Add Menu Item Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto p-4 [&>button]:hidden">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle>Add Item</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={formLoading}>
                  {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Item
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <div>
                <Label>Item Name</Label>
                <Input placeholder="e.g. Paneer Tikka" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Brief description..." value={form.description} onChange={(e) => updateForm('description', e.target.value)} className="mt-1.5" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" placeholder="249" value={form.price} onChange={(e) => updateForm('price', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.categoryId} onValueChange={(v) => updateForm('categoryId', v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item Specifications (Type & Press Enter)</Label>
                <div className="flex flex-wrap gap-2 p-3 min-h-[50px] rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  {form.specifications.map((tag) => (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/10"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-primary-foreground hover:bg-primary rounded-full transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={form.specifications.length === 0 ? "e.g. Vegetarian, Extra Spicy, Dairy-free..." : "Add more..."}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px]"
                  />
                </div>
              </div>

              <div>
                <Label>Item Image</Label>
                <div className="mt-2 min-h-[140px] flex items-center justify-center">
                  {form.image ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group animate-in zoom-in-50 duration-300">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => { updateForm('image', ''); setUploadMode(null); }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  ) : uploadMode === 'url' ? (
                    <div className="w-full space-y-3 animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input 
                            placeholder="Paste image URL..." 
                            value={imageUrlInput} 
                            onChange={(e) => setImageUrlInput(e.target.value)} 
                            className="pl-9 h-11 rounded-xl"
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlUpload()}
                          />
                        </div>
                        <Button onClick={handleUrlUpload} disabled={uploading || !imageUrlInput} className="h-11 rounded-xl px-6">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setUploadMode(null)} className="w-full text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                    </div>
                  ) : uploadMode === 'camera' ? (
                    <div className="w-full space-y-3 animate-in fade-in zoom-in-95 duration-300">
                      <div className="relative w-full max-w-[240px] sm:max-w-[280px] mx-auto aspect-square rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <canvas ref={canvasRef} className="hidden" />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={capturePhoto} disabled={uploading} className="flex-1 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20">
                          Capture Photo
                        </Button>
                        <Button variant="outline" onClick={stopCamera} disabled={uploading} className="h-12 rounded-xl px-4 border-slate-200">
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-6 animate-in fade-in duration-500">
                      <label className="group flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-90">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm group-hover:shadow-md">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>

                      <button 
                        onClick={() => setUploadMode('url')}
                        className="group flex flex-col items-center gap-2 transition-all active:scale-90"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm group-hover:shadow-md">
                          <Globe className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">URL</span>
                      </button>

                      <button 
                        onClick={startCamera}
                        className="group flex flex-col items-center gap-2 transition-all active:scale-90"
                      >
                        <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm group-hover:shadow-md">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Camera</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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

// ── Menu Performance Card ────────────────────────────────────────────────────
function MenuPerformanceCard() {
  const [range, setRange] = useState<'7' | '14' | '30'>('7');
  const [data, setData] = useState<{ date: string; views: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const days = parseInt(range);
        const start = startOfDay(subDays(new Date(), days - 1)).toISOString();
        const end = endOfDay(new Date()).toISOString();
        const res = await api.getViewsAnalytics(start, end);
        setData(res);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  // SVG chart dimensions
  const W = 560;
  const H = 160;
  const PAD = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxViews = Math.max(...data.map(d => d.views), 1);
  const totalViews = data.reduce((s, d) => s + d.views, 0);

  const pts = data.map((d, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2,
    y: chartH - (d.views / maxViews) * chartH,
    ...d,
  }));

  const pathD = pts.length > 1
    ? pts.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      }, '')
    : '';

  const areaD = pathD
    ? `${pathD} L ${pts[pts.length - 1].x} ${chartH} L ${pts[0].x} ${chartH} Z`
    : '';

  const [tooltip, setTooltip] = useState<{ x: number; y: number; views: number; date: string } | null>(null);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="lg:col-span-3 bg-white rounded-[28px] border border-slate-200 shadow-xl shadow-slate-200/40 p-7 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-base">Menu Performance</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium pl-10">Overview of your menu performance</p>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(['7', '14', '30'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-baseline gap-2 pl-1">
        <span className="text-3xl font-black text-slate-900">{totalViews.toLocaleString()}</span>
        <span className="text-sm text-slate-400 font-medium">views in last {range} days</span>
      </div>

      {/* Chart */}
      <div className="relative w-full" style={{ height: H }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : data.length < 2 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-medium">
            Not enough data yet
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #16a34a)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--color-primary, #16a34a)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform={`translate(${PAD.left},${PAD.top})`}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <line
                  key={t}
                  x1={0} y1={chartH * t}
                  x2={chartW} y2={chartH * t}
                  stroke="#f1f5f9" strokeWidth={1}
                />
              ))}
              {/* Y labels */}
              {[0, 0.5, 1].map(t => (
                <text
                  key={t}
                  x={-6} y={chartH * t + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="#94a3b8"
                >
                  {Math.round(maxViews * (1 - t))}
                </text>
              ))}
              {/* Area fill */}
              <path d={areaD} fill="url(#perfGrad)" />
              {/* Line */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--color-primary, #16a34a)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots + hover */}
              {pts.map((p, i) => (
                <g key={i} onMouseEnter={() => setTooltip({ x: p.x, y: p.y, views: p.views, date: p.date })}>
                  <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
                  <circle
                    cx={p.x} cy={p.y} r={4}
                    fill="white"
                    stroke="var(--color-primary, #16a34a)"
                    strokeWidth={2}
                  />
                </g>
              ))}
              {/* X labels — show first, mid, last */}
              {pts.length > 0 && [pts[0], pts[Math.floor(pts.length / 2)], pts[pts.length - 1]].map((p, i) => (
                <text
                  key={i}
                  x={p.x} y={chartH + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#94a3b8"
                >
                  {format(new Date(p.date), 'MMM d')}
                </text>
              ))}
              {/* Tooltip */}
              {tooltip && (
                <g transform={`translate(${tooltip.x + (tooltip.x > chartW * 0.7 ? -80 : 12)},${Math.max(0, tooltip.y - 30)})`}>
                  <rect rx={8} ry={8} width={76} height={38} fill="#0f172a" opacity={0.9} />
                  <text x={8} y={15} fontSize={10} fill="#94a3b8">
                    {format(new Date(tooltip.date), 'MMM d')}
                  </text>
                  <text x={8} y={30} fontSize={12} fontWeight="bold" fill="white">
                    {tooltip.views} views
                  </text>
                </g>
              )}
            </g>
          </svg>
        )}
      </div>
    </motion.div>
  );
}

// ── Top Performing Categories Card ──────────────────────────────────────────
function TopPerformingCategoriesCard() {
  const categories = useStore(s => s.categories);
  const menuItems = useStore(s => s.menuItems);
  const [sortBy, setSortBy] = useState<'items' | 'likes'>('items');
  const [isExpanded, setIsExpanded] = useState(false);

  const CATEGORY_COLORS = [
    'bg-emerald-500',
    'bg-orange-400',
    'bg-blue-400',
    'bg-purple-400',
    'bg-rose-400',
    'bg-amber-400',
  ];

  const ranked = useMemo(() => {
    const sorted = categories
      .map(cat => ({
        ...cat,
        itemCount: menuItems.filter(i => i.categoryId === cat.id).length,
        likes: menuItems
          .filter(i => i.categoryId === cat.id)
          .reduce((s, i) => s + (i.likesCount || 0), 0),
      }))
      .sort((a, b) => sortBy === 'items' ? b.itemCount - a.itemCount : b.likes - a.likes);
      
    return isExpanded ? sorted : sorted.slice(0, 6);
  }, [categories, menuItems, sortBy, isExpanded]);

  const maxValue = useMemo(() => {
    if (ranked.length === 0) return 1;
    return Math.max(...ranked.map(c => sortBy === 'items' ? c.itemCount : c.likes), 1);
  }, [ranked, sortBy]);

  return (
    <motion.div
      layout
      whileHover={!isExpanded ? { y: -3 } : {}}
      className="lg:col-span-2 bg-white rounded-[28px] border border-slate-200 shadow-xl shadow-slate-200/40 p-7 flex flex-col gap-5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-base">Top Performing Categories</h3>
          </div>
          
          <div className="pl-10 relative group flex items-center gap-2">
             <button 
                onClick={() => setSortBy(sortBy === 'items' ? 'likes' : 'items')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all shadow-sm active:scale-95"
             >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Based on <span className="text-primary">{sortBy === 'items' ? 'item count' : 'total likes'}</span>
                </span>
                <TrendingUp className={`w-3 h-3 text-primary transition-transform duration-500 ${sortBy === 'likes' ? 'rotate-0' : 'rotate-180 opacity-40'}`} />
             </button>

             <motion.div
               animate={{ 
                 opacity: [1, 0, 1],
                 x: [0, -3, 0]
               }}
               transition={{ 
                 repeat: Infinity, 
                 duration: 1.2,
                 ease: "easeInOut"
               }}
               className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
             >
               <ArrowLeft className="w-3.5 h-3.5" />
             </motion.div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 flex-1 mt-2">
        {ranked.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-300 text-sm font-medium italic">
            No categories yet
          </div>
        ) : (
          ranked.map((cat, i) => {
            const currentVal = sortBy === 'items' ? cat.itemCount : cat.likes;
            return (
              <motion.div 
                key={cat.id} 
                layout 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-3 group"
              >
                {/* Color dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`} />
                {/* Name */}
                <span className="text-sm font-bold text-slate-600 w-24 shrink-0 truncate group-hover:text-slate-900 transition-colors">{cat.name}</span>
                {/* Bar Container */}
                <div className="flex-1 bg-slate-50 rounded-full h-2.5 overflow-hidden border border-slate-100/50 shadow-inner">
                  <motion.div
                    initial={false}
                    animate={{ 
                      width: `${(currentVal / maxValue) * 100}%`,
                      backgroundColor: i % 2 === 0 ? 'var(--color-primary, #16a34a)' : undefined
                    }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                    className={`h-full rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                </div>
                {/* Value */}
                <div className="w-8 flex justify-end">
                   <motion.span 
                     key={sortBy}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-sm font-black text-slate-900 tabular-nums"
                   >
                     {currentVal}
                   </motion.span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <Link
          to="/dashboard/categories"
          className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary hover:gap-2.5 transition-all"
        >
          Manage Categories <ArrowRight className="w-3 h-3" />
        </Link>
        
        {categories.length > 6 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center group outline-none"
          >
            <motion.div
              animate={{ 
                opacity: [1, 0.4, 1],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.2,
                ease: "easeInOut"
              }}
              className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </motion.div>
          </button>
        )}
      </div>
    </motion.div>
  );
}


function MenuViewsModal({ open, onOpenChange, totalViews }: { open: boolean, onOpenChange: (open: boolean) => void, totalViews: number }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const fetchStats = useStore(s => s.fetchStats);

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

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetViewsAnalytics();
      toast({ title: "Analytics reset successfully" });
      setData([]);
      fetchStats();
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Failed to reset analytics", variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  // Aggregate stats from fetched data
  const totalInRange = data.reduce((sum, d) => sum + d.views, 0);
  const averageViews = data.length > 0 ? Math.round(totalInRange / data.length) : 0;
  const mostViewedDay = data.length > 0 
    ? data.reduce((max, day) => day.views > max.views ? day : max)
    : { date: 'N/A', views: 0 };
  
  const maxViews = Math.max(...(data.length > 0 ? data.map(d => d.views) : [0]), 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[700px] h-[92dvh] sm:h-auto sm:max-h-[90dvh] p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
        <DialogHeader className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Menu Views Analytics
            </DialogTitle>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors px-2 sm:px-3">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Views
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete all your existing menu view analytics from our database. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleReset}
                      className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                      disabled={isResetting}
                    >
                      {isResetting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full sm:w-[260px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
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
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 space-y-5 sm:space-y-6 p-5 sm:p-6 overflow-hidden">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3.5 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xl sm:text-2xl font-bold text-primary">{totalInRange.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Views in Period</p>
            </div>
            <div className="text-center p-3.5 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xl sm:text-2xl font-bold text-primary">{averageViews.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Daily Average</p>
            </div>
            <div className="text-center p-3.5 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xl sm:text-2xl font-bold text-primary">{mostViewedDay.views}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Peak Day</p>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="relative flex-1 min-h-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold">Daily Traffic</h3>
              {loading && <div className="text-xs text-muted-foreground animate-pulse">Loading data...</div>}
            </div>
            
            <ScrollArea className="h-[300px] sm:h-[320px] pr-2 sm:pr-4 rounded-xl border border-slate-200 bg-white">
              <div className="space-y-3 p-3 sm:p-4">
                {data.map((day) => (
                  <div key={day.date} className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-16 sm:w-24 text-sm text-muted-foreground">
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
              className="hidden sm:block bg-primary/5 border border-primary/10 p-4 rounded-xl"
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
