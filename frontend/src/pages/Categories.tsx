import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
          <div className="text-center py-24 rounded-[32px] border-2 border-dashed border-slate-200 bg-white shadow-xl shadow-slate-100">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display font-black text-2xl text-slate-900 mb-2 tracking-tight">Your menu is empty</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 max-w-xs mx-auto">Create your first category to start organizing your signature dishes.</p>
            <Button onClick={openAdd} size="lg" className="h-14 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"><Plus className="w-5 h-5 mr-2" /> Create Category</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
             {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                   {/* Background Decor */}
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                   
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                         <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <FolderOpen className="w-7 h-7" />
                         </div>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-slate-100" onClick={() => openEdit(cat)}>
                               <Pencil className="w-4.5 h-4.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-red-50 text-red-500" onClick={() => setDeleteId(cat.id)}>
                               <Trash2 className="w-4.5 h-4.5" />
                            </Button>
                         </div>
                      </div>

                      <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                         {cat.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cat.itemCount} Total Items</span>
                         </div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                            Added {new Date(cat.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                   </div>
                </motion.div>
             ))}
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
