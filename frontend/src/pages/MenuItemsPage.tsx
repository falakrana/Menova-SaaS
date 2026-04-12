import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, Loader2, Upload, X, Star, Heart, Sparkles } from 'lucide-react';
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
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability, fetchMenuItems, generateMenuItemImage } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false });
  const [uploading, setUploading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const updateForm = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', image: '', available: true, isVeg: false, isSpicy: false, isGlutenFree: false });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, price: item.price.toString(), categoryId: item.categoryId, image: item.image || '', available: item.available, isVeg: !!item.isVeg, isSpicy: !!item.isSpicy, isGlutenFree: !!item.isGlutenFree });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await useStore.getState().uploadImage(file, 'menu-items');
      updateForm('image', url);
      toast({ title: 'Image uploaded successfully' });
    } catch (err) {
      toast({ title: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateAiImage = async () => {
    const itemName = form.name.trim();
    if (!itemName) {
      toast({ title: 'Add item name first', description: 'AI image needs at least a dish name.', variant: 'destructive' });
      return;
    }

    setGeneratingAi(true);
    try {
      const result = await generateMenuItemImage({
        name: itemName,
      });
      updateForm('image', result.url);
      toast({ title: 'Google AI image generated' });
    } catch (err) {
      toast({ title: 'Failed to generate Google AI image', variant: 'destructive' });
    } finally {
      setGeneratingAi(false);
    }
  };

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
                  <div className="relative h-48 bg-slate-50 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100/50 group-hover:bg-slate-100 transition-colors">
                        <UtensilsCrossed className="w-12 h-12 text-slate-200" />
                      </div>
                    )}
                    
                    {/* Corner Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       {isHot && (
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                             <Star className="w-3 h-3 fill-current" /> Hot
                          </span>
                       )}
                       <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                          {item.categoryName}
                       </span>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="secondary" size="icon" className="w-9 h-9 rounded-xl shadow-lg" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="w-9 h-9 rounded-xl shadow-lg" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {!item.available && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-4 py-2 rounded-xl bg-white text-black text-xs font-black uppercase tracking-[0.2em] shadow-2xl">Inactive</span>
                       </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-black text-xl text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                      <span className="font-display font-black text-xl text-slate-900 tracking-tight">₹{item.price}</span>
                    </div>
                    <p className="text-slate-400 font-medium text-xs mb-8 line-clamp-2 leading-relaxed">{item.description}</p>
                    {(item.isVeg || item.isSpicy || item.isGlutenFree) && (
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
          <DialogContent className="sm:max-w-lg p-4 [&>button]:hidden">
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
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 p-2 rounded-lg border border-border">
                  <Switch checked={form.isVeg} onCheckedChange={(v) => updateForm('isVeg', v)} />
                  <Label className="text-[11px] font-bold">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg border border-border">
                  <Switch checked={form.isSpicy} onCheckedChange={(v) => updateForm('isSpicy', v)} />
                  <Label className="text-[11px] font-bold">Spicy</Label>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg border border-border">
                  <Switch checked={form.isGlutenFree} onCheckedChange={(v) => updateForm('isGlutenFree', v)} />
                  <Label className="text-[11px] font-bold">Gluten Free</Label>
                </div>
              </div>

              <div>
                <Label>Item Image</Label>
                <div className="mt-1.5 flex flex-col gap-2">
                  {form.image ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border group">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => updateForm('image', '')}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
                      <div className="flex flex-col items-center justify-center py-2">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                            <p className="text-sm text-muted-foreground">Click to upload photo</p>
                          </>
                        )}
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading || generatingAi} />
                    </label>
                  )}

                  <Button type="button" variant="outline" className="h-10" onClick={handleGenerateAiImage} disabled={generatingAi || uploading}>
                    {generatingAi ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate with Google AI
                      </>
                    )}
                  </Button>
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
