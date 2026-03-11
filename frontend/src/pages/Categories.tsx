import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import type { Category } from '@/types';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => { setEditingCat(null); setName(''); setDialogOpen(true); };
  const openEdit = (cat: Category) => { setEditingCat(cat); setName(cat.name); setDialogOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, name.trim());
        toast({ title: 'Category updated' });
      } else {
        await addCategory(name.trim());
        toast({ title: 'Category added' });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({ title: 'Failed to save category', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCategory(deleteId);
        toast({ title: 'Category deleted', variant: 'destructive' });
        setDeleteId(null);
      } catch (err) {
        toast({ title: 'Failed to delete category', variant: 'destructive' });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Categories</h1>
            <p className="text-muted-foreground text-base mt-2">Manage your menu categories</p>
          </div>
          <Button onClick={openAdd} size="lg"><Plus className="w-5 h-5 mr-2" /> Add Category</Button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-dashed border-border">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display font-semibold text-lg mb-1">No categories yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Create your first category to start building your menu.</p>
            <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-slate-100">
                    <th className="text-left text-xs font-medium text-slate-600 uppercase tracking-wider px-6 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-slate-600 uppercase tracking-wider px-6 py-3">Items</th>
                    <th className="text-left text-xs font-medium text-slate-600 uppercase tracking-wider px-6 py-3">Created</th>
                    <th className="text-right text-xs font-medium text-slate-600 uppercase tracking-wider px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-sm">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{cat.itemCount} items</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(cat.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} aria-label={`Edit ${cat.name}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.id)} className="text-destructive hover:text-destructive" aria-label={`Delete ${cat.name}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCat ? 'Edit Category' : 'Add Category'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="catName">Category Name</Label>
              <Input id="catName" placeholder="e.g. Starters" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCat ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete category?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete this category and potentially impact items assigned to it.</AlertDialogDescription>
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
