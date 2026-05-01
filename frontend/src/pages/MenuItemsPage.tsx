import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, Loader2, Upload, X, Star, Heart, Camera, Globe, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { MenuItem } from '@/types';

export default function MenuItems() {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability, fetchMenuItems } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false, isFeatured: false, specifications: [] as string[] });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'device' | 'url' | 'camera' | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const updateForm = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

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

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false, isFeatured: false, specifications: [] });
    setUploadMode(null);
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, price: item.price.toString(), categoryId: item.categoryId, image: item.image || '', available: item.available, isVeg: !!item.isVeg, isSpicy: !!item.isSpicy, isGlutenFree: !!item.isGlutenFree, isFeatured: !!item.isFeatured, specifications: item.specifications || [] });
    setUploadMode(null);
    setDialogOpen(true);
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
    if (!dialogOpen) {
      stopCamera();
    }
  }, [dialogOpen, stopCamera]);

  useEffect(() => {
    if (uploadMode === 'camera' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [uploadMode, stream]);



  const handleSave = async () => {
    if (!form.name.trim() || !form.price || parseFloat(form.price) <= 0) return;
    const cat = categories.find((c) => c.id === form.categoryId);
    setLoading(true);
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, { ...form, price: parseFloat(form.price), categoryName: cat?.name || '' });
        toast({ title: 'Item updated' });
      } else {
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
      }
      setDialogOpen(false);
    } catch (err) {
      toast({ title: 'Failed to save item', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMenuItem(deleteId);
        toast({ title: 'Item deleted', variant: 'destructive' });
        setDeleteId(null);
      } catch (err) {
        toast({ title: 'Failed to delete item', variant: 'destructive' });
      }
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || item.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Menu Items</h1>
            <p className="text-muted-foreground text-base mt-2">Manage your menu items</p>
          </div>
          <Button onClick={openAdd} size="lg"><Plus className="w-5 h-5 mr-2" /> Add Item</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-[32px] border-2 border-dashed border-slate-200 bg-white shadow-xl shadow-slate-100">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 mb-2 tracking-tight">No items matched</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 max-w-xs mx-auto">
               {search || filterCat !== 'all' ? 'Try adjusting your filters or search term to find what you are looking for.' : 'Start your digital menu by adding your first signature dish.'}
            </p>
            {!search && filterCat === 'all' && <Button onClick={openAdd} size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"><Plus className="w-5 h-5 mr-2" /> Add Menu Item</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {filtered.map((item, index) => {
               const isHot = item.likesCount > 5;
               return (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {/* Blurred Image Background */}
                    {item.image && (
                      <div 
                        className="absolute inset-0 z-0 bg-cover bg-center scale-110 blur-sm opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-[1]" />
                    
                    {/* Circular Image Container */}
                    <div className="relative w-32 h-32 rounded-full border-[6px] border-white shadow-2xl shadow-slate-200 overflow-hidden z-10 transition-all duration-500 group-hover:scale-110 group-hover:border-primary/20 bg-white">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100/50">
                          <UtensilsCrossed className="w-10 h-10 text-slate-200" />
                        </div>
                      )}
                    </div>
                    
                    {/* Corner Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                       {isHot && (
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 animate-pulse">
                             <Star className="w-3 h-3 fill-current" /> Hot
                          </span>
                       )}
                       <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {item.categoryName}
                       </span>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <Button variant="secondary" size="icon" className="w-9 h-9 rounded-xl shadow-lg hover:bg-primary hover:text-white transition-colors" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="w-9 h-9 rounded-xl shadow-lg" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {!item.available && (
                       <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-30">
                          <span className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl">Hidden</span>
                       </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-black text-xl text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                      <span className="font-display font-black text-xl text-slate-900 tracking-tight">₹{item.price}</span>
                    </div>
                    <p className="text-slate-400 font-medium text-xs mb-8 line-clamp-2 leading-relaxed">{item.description}</p>
                    {((item.specifications && item.specifications.length > 0) || item.isVeg || item.isSpicy || item.isGlutenFree) && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.isVeg && (
                          <span className="px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                            Vegetarian
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-wide">
                            Spicy
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="px-2.5 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wide">
                            Gluten Free
                          </span>
                        )}
                        {item.specifications?.map(spec => (
                          <span key={spec} className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleItemAvailability(item.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             {item.available ? "Visible" : "Hidden"}
                          </span>
                       </div>
                       
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                          {item.isFeatured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />}
                          <Heart className="w-3.5 h-3.5" /> {item.likesCount || 0} Likes
                       </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}


        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto p-4 [&>button]:hidden">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingItem ? 'Update' : 'Add'}
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
                <div className="flex items-center justify-between">
                  <Label>Item Specifications (Type & Press Enter)</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.isFeatured} onCheckedChange={(v) => updateForm('isFeatured', v)} />
                    <Label className="text-xs font-bold uppercase tracking-wider text-primary">Featured</Label>
                  </div>
                </div>
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
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete item?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently remove this menu item.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
