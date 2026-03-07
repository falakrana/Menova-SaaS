import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, UtensilsCrossed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', available: true });
  const updateForm = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const openAdd = () => {
    setEditingItem(null);
    setForm({ name: '', description: '', price: '', categoryId: categories[0]?.id || '', available: true });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, price: item.price.toString(), categoryId: item.categoryId, available: item.available });
    setDialogOpen(true);
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
          <div className="text-center py-20 rounded-xl border border-dashed border-border">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display font-semibold text-lg mb-1">No items found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {search || filterCat !== 'all' ? 'Try adjusting your filters.' : 'Add your first menu item to get started.'}
            </p>
            {!search && filterCat === 'all' && <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="h-36 bg-secondary flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <UtensilsCrossed className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display font-semibold text-sm">{item.name}</h3>
                    <span className="font-display font-bold text-primary text-sm">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{item.categoryName}</span>
                    <div className="flex items-center gap-2">
                       <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleItemAvailability(item.id)}
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(item)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Item Name</Label>
                <Input placeholder="e.g. Paneer Tikka" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Brief description..." value={form.description} onChange={(e) => updateForm('description', e.target.value)} className="mt-1.5" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
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
